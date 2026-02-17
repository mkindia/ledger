from rest_framework import viewsets, status # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework.decorators import action, api_view # type: ignore
# from django.db import transaction as db_transaction # type: ignore
from .models import Transaction, Entry, VoucherType
from .serializer import TransactionSerializer, EntrySerializer, VoucherTypeSerializer

class VoucherTypeVieSet(viewsets.ModelViewSet):
    queryset = VoucherType.objects.all()
    serializer_class = VoucherTypeSerializer


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.prefetch_related('entries__ledger')
    serializer_class = TransactionSerializer
    
    @action(detail=True, methods=['get'])
    def entries(self, request:any, pk=None):
        transaction = self.get_object()
        entries = transaction.entries.select_related('ledger')
        data = [
            {
                # "transaction" : e.transaction.id,
                # "voucher_type" : e.transaction.voucher_type,
                "date" : e.transaction.date,
                "ledger": e.ledger.name,
                "debit" : e.debit,
                "credit": e.credit
                }
                for e in entries
                ]
        return Response(data)
    

# parms EntryViewSet
    #GET /api/entries/?voucher_type=Sales
    #GET /api/entries/?date=2024-10-01
    #GET /api/entries/?from_date=2024-10-01&to_date=2024-10-31
    # GET /api/entries/?voucher_type=Sales&from_date=2026-01-01&to_date=2026-01-31    

class EntryViewSet(viewsets.ModelViewSet):
    serializer_class = EntrySerializer
    queryset = Entry.objects.select_related('ledger', 'transaction')

    def get_queryset(self:any):
        qs = super().get_queryset()
        print(self.request.query_params.get('voucher_type'))
        voucher = self.request.query_params.get('voucher_type')
        date = self.request.query_params.get('date')
        from_date = self.request.query_params.get('from_date')
        to_date = self.request.query_params.get('to_date')

        if voucher:
            qs = qs.filter(transaction__voucher_type=voucher)

        if date:
            qs = qs.filter(transaction__date=date)

        if from_date and to_date:
            qs = qs.filter(transaction__date__range=[from_date, to_date])

        return qs.order_by('transaction__date', 'id')
    


    
# @api_view(['POST'])
# def bulk_delete_transactions(request:any):
#     ids = request.data.get('transaction_ids', [])

#     if not ids:
#         return Response(
#             {"error": "No transaction ids provided"},
#             status=status.HTTP_400_BAD_REQUEST
#         )

#     Transaction.objects.filter(id__in=ids).delete()
#     return Response({"status": "deleted"}, status=status.HTTP_200_OK)
    

