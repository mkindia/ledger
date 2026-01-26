from rest_framework import serializers  # type: ignore
from .models import TransactionEntry, Transaction
from django.db import transaction as db_transaction # type: ignore

class TransactionEntrySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = TransactionEntry
        fields = ['id', 'ledger', 'entry_type', 'amount', 'narration']
        

class TransactionSerializer(serializers.ModelSerializer):
    entries = TransactionEntrySerializer(many = True)
    id = serializers.IntegerField(read_only=True)
    class Meta:
        model = Transaction
        fields = ['id', 'voucher_no','voucher_type', 'date', 'narration','entries']

    def validate(self, data):
        # voucher_no = data.get('voucher_no')
        debit_total = sum(e['amount'] for e in data['entries'] if e['entry_type'] == 'debit')
        credit_total = sum(e['amount'] for e in data['entries'] if e['entry_type'] == 'credit')
        
        if debit_total != credit_total:
            raise serializers.ValidationError('Debit and Credit Must be equal')
        if len(data) < 2:
            raise serializers.ValidationError("Minimum two entries required")
        return data
    
    def create(self, validated_data):
        entries = validated_data.pop('entries')
        # print(entries)
        with db_transaction.atomic():
            txn = Transaction.objects.create(**validated_data)

            

            for entry in entries:
                TransactionEntry.objects.create(transaction = txn, **entry)

        return txn
    
    def update(self, instance, validated_data):
        entries = validated_data.pop('entries')

        with db_transaction.atomic():
            instance.date = validated_data.get('date', instance.date)
            instance.narration = validated_data.get('narration', instance.narration)
            instance.save()

            existing_ids = set(instance.entries.values_list('id', flat=True))
            incoming_ids = set(e['id'] for e in entries if 'id' in e)

            # delete removed lines
            Entry.objects.filter(id__in=existing_ids - incoming_ids).delete()

            for e in entries:
                if 'id' in e:
                    Entry.objects.filter(id=e['id']).update(**e)
                else:
                    Entry.objects.create(transaction=instance, **e)

        return instance
    
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
#   ],
#   "deleted_entry_ids": [103]
# }

# BULK DELETE (Multiple Transactions)

# {
#   "transaction_ids": [10, 11, 15]
# }