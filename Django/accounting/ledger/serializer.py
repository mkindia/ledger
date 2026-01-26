from rest_framework import serializers  # type: ignore
from .models import Company, Ledger
from rest_framework.validators import UniqueTogetherValidator # type: ignore
from django.db.models import Max # type: ignore
from transaction.serializer import TransactionEntrySerializer, TransactionSerializer

class CompanySerializer(serializers.ModelSerializer):

    class Meta:
        model = Company
        fields = ['id', 'user_account', 'company_name','alies', 'print_name', 'is_selected']
        read_only_fields = ['id']

    
class LedgerSerializer(serializers.ModelSerializer):   
    # id = serializers.IntegerField(read_only=True)
    # access_code = AccessCodeSerializer(many=True)
    # ledger_entries = TransactionSerializer(many = True)
    # is_pre_defined = serializers.BooleanField(read_only=True)
    class Meta:
        model = Ledger
        fields = ['id', 'group', 'company', 'ledger_type','under', 'name','phone', 'is_pre_defined',]
        read_only_fields = ['id', 'is_pre_defined']
        # write_only_fields = ['is_pre_defined']
        
        validators = [
            UniqueTogetherValidator(
                queryset=Ledger.objects.all(),
                fields=["company", "name"],
                message="Ledger with this name already exists for this company."
            )
        ]

    def validate(self, attrs):
        
        # ledger_nature = attrs.get('ledger_nature')
        # parent_group_code = attrs.get('parent_group')
        # access_code = attrs.get('access_code')
        # print(access_code)
        # if is_primary and not ledger_nature:
        #     raise serializers.ValidationError({
        #         'ledger_nature': 'nature of group Not Found'
        #     })
        # elif not is_primary and not parent_group_code :
        #     raise serializers.ValidationError({
        #         'parent_group_code': 'parent group code not Found'
        #     })

        return attrs

    def create(self, validated_data):        
        # if 'code' not in validated_data or validated_data['code'] is None:
        #     last_id = ledger.objects.aggregate(Max('code'))['code__max']
        #     if last_id < 1000:
        #         last_id = 1000
        #     validated_data['code'] = last_id + 1
        return super().create(validated_data)