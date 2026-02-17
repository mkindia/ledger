from rest_framework.viewsets import ModelViewSet
from .models import SalesInvoice
from .serializer import SalesInvoiceSerializer


class SalesInvoiceViewSet(ModelViewSet):
    queryset = SalesInvoice.objects.all().order_by('-id')
    serializer_class = SalesInvoiceSerializer



# Body
# {
#   "invoice_no": "SI-3001",
#   "invoice_date": "2026-02-12",
#   "billing_party": 1,
#   "shipping_party": 2,

#   "items": [
#     {
#       "item": 1,
#       "variant": 1,
#       "qty": 10,
#       "rate": 1200
#     }
#   ],

#   "sundries": [
#     {
#       "ledger": 3,
#       "apply_on": "ITEM",
#       "type": "ADD",
#       "calculation_type": "PERCENT",
#       "value": 9
#     }
#   ]
# }
