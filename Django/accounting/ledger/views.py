from django.shortcuts import render # type: ignore
from rest_framework import viewsets # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework.decorators import action # type: ignore
from .serializer import CompanySerializer, LedgerSerializer
from .models import Company, Ledger

class CompanyView(viewsets.ModelViewSet):

    def get_serializer_class(self):
        return CompanySerializer
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Company.objects.filter(is_deleted = False).order_by("company_name")
        else :
            return Company.objects.filter(is_deleted = False, user_account = user.id).order_by('company_name')
        
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(modified_by=self.request.user)

class LedgerView(viewsets.ModelViewSet):

    def get_serializer_class(self):
        return LedgerSerializer
    
    def get_queryset(self):                
        queryset = Ledger.objects.filter(is_deleted = False).select_related('company')        
        if self.request.query_params.get('company'):
            queryset_comapny = Ledger.objects.filter(is_deleted = False, company = self.request.query_params.get('company')).select_related('company')
            return queryset_comapny        
        return queryset        
        
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(modified_by=self.request.user)

    @action(detail=True, methods=['get'])
    def entries(self, request, pk=None):
        ledger = self.get_object()
        entries =  ledger.ledger_entries.select_related('ledger')
        data = []
        
        for e in entries:   
            # find opposite entry in same transaction
            against_entries = (e.transaction.entries.exclude(ledger=e.ledger.id).select_related('ledger'))

            against_ledger_names = [against_entries[0].ledger.name]

            data.append({
                "transaction" : e.transaction.id,
                "date": e.transaction.date,
                "voucher_no": e.transaction.voucher_no,
                "voucher_type" : e.transaction.voucher_type,
                "entry_type" : e.entry_type,
                "amount": e.amount,
                "against": ", ".join(against_ledger_names),
                "narration": e.narration
            })
        return Response(data)