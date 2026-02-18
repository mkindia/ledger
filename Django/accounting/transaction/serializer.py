from rest_framework import serializers  # type: ignore
from .models import Entry, Transaction, CompanyVoucherConfig, FinancialYear, VoucherSequence, VoucherType
from django.db import transaction as db_transaction # type: ignore
from datetime import date

def get_or_create_voucher_config(company, voucher_type):
    config, _ = CompanyVoucherConfig.objects.get_or_create(
        company=company,
        voucher_type=voucher_type,
        defaults={
            "prefix": voucher_type.code[:3],
            "padding": 4,
        }
    )
    return config

def get_financial_year(date):
    year = date.year
    start = year - 1 if date.month < 4 else year
    return start, start + 1

def build_voucher_no(config, number, date):
    num = str(number).zfill(config.padding)
    voucher = ''

    if config.prefix:
        voucher += config.prefix + config.prefix_separator

    voucher += num

    if config.suffix_type != 'NONE':
        start, end = get_financial_year(date)

        if config.suffix_type == 'FY_SHORT':
            suffix = f"{str(start)[-2:]}-{str(end)[-2:]}"
        elif config.suffix_type == 'FY_SINGLE':
            suffix = str(start)[-2:]
        else:
            suffix = str(date.year)

        voucher += config.suffix_separator + suffix

    return voucher

def get_active_financial_year(company, date):
    return FinancialYear.objects.get(
        company=company,
        start_date__lte=date,
        end_date__gte=date,
        is_active=True
    )

def get_voucher_sequence(company, voucher_type, fy):
    seq, _ = VoucherSequence.objects.get_or_create(
        company=company,
        voucher_type=voucher_type,
        financial_year=fy,
        defaults={"current_number": 0}
    )
    return seq

def generate_voucher_no(company, voucher_type, date): 
      
    with db_transaction.atomic():
        fy1 = FinancialYear.objects.filter(
        company=company,
        start_date__lte=date,
        end_date__gte=date,
        is_active=True
        ).first()

        if not fy1:
             raise ValidationError("No active financial year found.")
        
        fy = get_active_financial_year(company, date)
        config = get_or_create_voucher_config(company, voucher_type)
        seq = get_voucher_sequence(company, voucher_type, fy)

        seq.current_number += 1
        seq.save()

        return build_voucher_no(config, seq.current_number, date)
    

class EntrySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only = True)
    ledger_name = serializers.CharField(source='ledger.name', read_only=True)
    voucher_type = serializers.CharField(source='transaction.voucher_type', read_only=True)
    date = serializers.DateField(source='transaction.date', read_only=True)
    class Meta:
        model = Entry
        fields = ['id', 'ledger', 'ledger_name', 'voucher_type', 'debit', 'credit', 'narration', 'date']
    
    def validate(self, data) :
        if data['debit'] <= 0 and data['credit'] <= 0:
            raise serializers.ValidationError("Debit or Credit required")
        if data['debit'] > 0 and data['credit'] > 0:
            raise serializers.ValidationError("Only one of Debit or Credit allowed")
        return data

class TransactionSerializer(serializers.ModelSerializer):
    entries = EntrySerializer(many = True)
    id = serializers.IntegerField(read_only=True)
    voucher_name = serializers.CharField(source='voucher_type.name', read_only=True)
    # company = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Transaction
        fields = ['id','company' ,'voucher_no','voucher_type', 'voucher_name', 'date', 'narration','entries']

    def validate(self, data):
        # voucher_no = data.get('voucher_no')
        date = data.get('date', self.instance.date if self.instance else None)
        company = data.get('company', self.instance.company if self.instance else None)  
        entries = data.get('entries')
        company = data['company']
        voucher_type = data['voucher_type']
        voucher_no = data.get('voucher_no')

        # print(date,company)

        debit_total = sum(e.get('debit', 0) for e in entries)
        credit_total = sum(e.get('credit', 0) for e in entries)
       
        # debit_total = sum(e['amount'] for e in data['entries'] if e['entry_type'] == 'debit')
        # credit_total = sum(e['amount'] for e in data['entries'] if e['entry_type'] == 'credit')
        
        if debit_total != credit_total:
            raise serializers.ValidationError('Debit and Credit Must be equal')
        if len(entries) < 2:
            raise serializers.ValidationError("Minimum two entries required")
        
        
        
        # 🔴 UPDATE → skip voucher checks
        if self.instance:
            return data
        
        # financial Year
        fy = FinancialYear.objects.filter(
            company=company,
            start_date__lte=date,
            end_date__gte=date
            ).first()
               
        if not fy:
            raise serializers.ValidationError( "No financial year found for this date.")

        if not fy.is_active:
            raise serializers.ValidationError("Financial year is closed. Posting not allowed.")
        
        # ---- VOUCHER NUMBER VALIDATION ----        # 🟢 CREATE ONLY
        config = get_or_create_voucher_config(company, voucher_type)
       
        # MANUAL MODE
        if config.numbering_mode == 'MANUAL':
            if not voucher_no:
                raise serializers.ValidationError({"voucher_no": "Required"})

            if Transaction.objects.filter(
                company=company,
                voucher_type=voucher_type,
                voucher_no=voucher_no
            ).exists():
                raise serializers.ValidationError({"voucher_no": "Voucher number already exists."})

        # AUTO MODE
        else:
            data.pop('voucher_no', None)  # ignore user input

        return data
    
    def create(self, validated_data: any):
        entries = validated_data.pop('entries')
        company = validated_data['company']
        voucher_type = validated_data['voucher_type']
        date = validated_data['date']

        with db_transaction.atomic():
             # ---- VOUCHER NUMBER VALIDATION ----
            config = get_or_create_voucher_config(company, voucher_type)
                       
             # AUTO MODE
            if config.numbering_mode == 'AUTO':
                 validated_data['voucher_no'] = generate_voucher_no(
                company, voucher_type, date
            )

            transaction = Transaction.objects.create(**validated_data)
            for entry in entries:
                Entry.objects.create(transaction = transaction, **entry)

        return transaction
    
    def update(self, instance, validated_data:any):
        validated_data.pop('voucher_no', None)
        entries = validated_data.pop('entries')

        with db_transaction.atomic():
            instance.entries.all().delete()
            for e in entries:
                Entry.objects.create(transaction=instance, **e)

        return super().update(instance, validated_data)

class VoucherTypeSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False, read_only=True )
    class Meta:
        model = VoucherType
        fields = ['id', 'code', 'name']
                

# json Example

# {
#     "voucher_no.":"01",
#     "voucher_type":"payment",
#     "date":"2025-10-13",
#     "narration":"rent paid cash",
#     "entyies":[
#         {"ledger":5,"entry_type":"Dr.", "amount":"1000.00"},
#         {"ledger":2,"entry_type":"Cr.", "amount":"1000.00"},
#     ]
# }

# edit json example

# {
#   "id": 10,
#   "date": "2026-01-13",
#   "entries": [
#     { "id": 101, "ledger": 1, "type": "debit", "amount": 50000 },
#     { "id": 102, "ledger": 2, "type": "credit", "amount": 30000 }
#   ]
# }

# Update Payload (Mixed: update + add + delete)

# {
#   "date": "2026-01-13",
#   "entries": [
#     { "id": 101, "ledger": 1, "type": "debit", "amount": 60000 },  // update
#     { "id": 102, "ledger": 2, "type": "credit", "amount": 30000 }, // unchanged
#     { "ledger": 4, "type": "credit", "amount": 30000 }            // new
#   ]
# }

# BULK DELETE (Multiple Transactions)

# {
#   "transaction_ids": [10, 11, 15]
# }