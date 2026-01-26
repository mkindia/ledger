from rest_framework import viewsets, status # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework.decorators import action, api_view # type: ignore
from django.db import transaction as db_transaction # type: ignore
from .models import Transaction, TransactionEntry
from .serializer import TransactionSerializer

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.prefetch_related('entries__ledger')
    serializer_class = TransactionSerializer

    def create (self, request, *arg, **kwargs):
        serializer= self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception = True)
        with db_transaction.atomic():
            try:
                self.perform_create(serializer)
            except Exception as e:
                db_transaction.set_rollback(True)
                return Response({"error":str(e)},status = status.Http_400_BAD_REQUEST)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers = headers)  

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(modified_by=self.request.user)  
    
    @action(detail=True, methods=['get'])
    def entries(self, request, pk=None):
        transaction = self.get_object()
        entries = transaction.entries.select_related('ledger')
        data = [
            {
                # "transaction" : e.transaction.id,
                "voucher_type" : e.transaction.voucher_type,
                "date" : e.transaction.date,
                "ledger": e.ledger.name,
                "entry_type" : e.entry_type,
                "amount": e.amount
                }
                for e in entries
                ]
        return Response(data)
    
    def update(self, request, *args, **kwargs):
        """
        BULK UPDATE:
        - add new entries
        - update existing entries
        - delete removed entries
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        serializer = self.get_serializer(
            instance, data=request.data, partial=partial
        )
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        """
        Delete single transaction (auto deletes entries)
        """
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

@api_view(['POST'])
def bulk_delete_transactions(request):
    ids = request.data.get('transaction_ids', [])

    if not ids:
        return Response(
            {"error": "No transaction ids provided"},
            status=status.HTTP_400_BAD_REQUEST
        )

    Transaction.objects.filter(id__in=ids).delete()
    return Response({"status": "deleted"}, status=status.HTTP_200_OK)
    
    # def destroy(self, request, *args, **kwargs):
    #     return Response(
    #         {"error": "Delete not allowed"},
    #         status=403
    #     )
