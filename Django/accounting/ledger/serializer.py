from rest_framework import serializers  # type: ignore
from .models import Ledger
from rest_framework.validators import UniqueTogetherValidator # type: ignore
from django.db.models import Max # type: ignore
# from transaction.serializer import EntrySerializer, TransactionSerializer

# class CompanySerializer(serializers.ModelSerializer):

#     class Meta:
#         model = Company
#         fields = ['id', 'user', 'name','alies', 'print_name', 'is_selected']
#         read_only_fields = ['id']

    
class LedgerSerializer(serializers.ModelSerializer):   
    parent_name = serializers.CharField(source="parent.name", read_only=True)
    class Meta:
        model = Ledger
        fields = ['id', 'code', 'company', 'ledger_type','parent', 'parent_name', 'name','phone', 'is_pre_defined',]
        read_only_fields = ['id', 'is_pre_defined']
        # write_only_fields = ['is_pre_defined']
        
        validators = [
            UniqueTogetherValidator(
                queryset=Ledger.objects.all(),
                fields=["company", "name"],
                message="Ledger with this name already exists for this company."
            )
        ]

    # def validate(self, attrs:any):     

    #     return attrs

    def create(self, validated_data:any):   
        
        return super().create(validated_data)