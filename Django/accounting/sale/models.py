from django.db import models
from ledger.models import Ledger
from item.models import Item, ItemVariant

# Create your models here.
class SalesInvoice(models.Model):
    invoice_no = models.CharField(max_length=30, unique=True)
    invoice_date = models.DateField()

    billing_party = models.ForeignKey(
        Ledger,
        related_name='billing_invoices',
        on_delete=models.PROTECT
    )

    shipping_party = models.ForeignKey(
        Ledger,
        related_name='shipping_invoices',
        on_delete=models.PROTECT,
        null=True,
        blank=True
    )

    item_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    sundry_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    grand_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    created_at = models.DateTimeField(auto_now_add=True)

class SalesInvoiceItem(models.Model):
    invoice = models.ForeignKey(
        SalesInvoice,
        related_name='items',
        on_delete=models.CASCADE
    )

    item = models.ForeignKey(Item, on_delete=models.PROTECT)
    variant = models.ForeignKey(
        ItemVariant,
        on_delete=models.PROTECT,
        null=True,
        blank=True
    )

    qty = models.DecimalField(max_digits=10, decimal_places=2)
    rate = models.DecimalField(max_digits=10, decimal_places=2)
    amount = models.DecimalField(max_digits=12, decimal_places=2)

class SalesInvoiceSundry(models.Model):
    APPLY_ON = [
        ('ITEM', 'Item Total'),
        ('INVOICE', 'Invoice Total'),        
    ]

    TYPE = [
        ('ADD', 'Add'),
        ('LESS', 'Less'),
    ]

    CALC_TYPE = [
        ('PERCENT', 'Percentage'),
        ('FIXED', 'Fixed'),
    ]

    invoice = models.ForeignKey(
        SalesInvoice,
        related_name='sundries',
        on_delete=models.CASCADE
    )

    ledger = models.ForeignKey(Ledger, on_delete=models.PROTECT)

    apply_on = models.CharField(max_length=10, choices=APPLY_ON)
    type = models.CharField(max_length=10, choices=TYPE)
    calculation_type = models.CharField(max_length=10, choices=CALC_TYPE)

    value = models.DecimalField(max_digits=10, decimal_places=2)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
