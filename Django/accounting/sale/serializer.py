from django.db import transaction
from decimal import Decimal
from rest_framework import serializers
from .models import *
from .services import calculate_invoice


class SalesInvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesInvoiceItem
        exclude = ('invoice',)


class SalesInvoiceSundrySerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesInvoiceSundry
        exclude = ('invoice',)


class SalesInvoiceSerializer(serializers.ModelSerializer):
    items = SalesInvoiceItemSerializer(many=True)
    sundries = SalesInvoiceSundrySerializer(many=True)

    class Meta:
        model = SalesInvoice
        fields = ['company', 'items', 'sundries']

    # ✅ CREATE
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        sundries_data = validated_data.pop('sundries', [])

        with transaction.atomic():

            invoice = SalesInvoice.objects.create(**validated_data)

            for item in items_data:
                item['amount'] = Decimal(item['qty']) * Decimal(item['rate'])
                SalesInvoiceItem.objects.create(invoice=invoice, **item)

            for s in sundries_data:
                SalesInvoiceSundry.objects.create(invoice=invoice, **s)

            calculate_invoice(invoice)

        return invoice

    # ✅ UPDATE (VERY IMPORTANT)
    def update(self, instance, validated_data):
        items_data = validated_data.pop('items')
        sundries_data = validated_data.pop('sundries', [])

        with transaction.atomic():

            # Update header fields
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()

            # 🔥 Delete old items & sundries
            instance.items.all().delete()
            instance.sundries.all().delete()

            # 🔥 Recreate items
            for item in items_data:
                item['amount'] = Decimal(item['qty']) * Decimal(item['rate'])
                SalesInvoiceItem.objects.create(invoice=instance, **item)

            # 🔥 Recreate sundries
            for s in sundries_data:
                SalesInvoiceSundry.objects.create(invoice=instance, **s)

            # 🔥 Recalculate totals
            calculate_invoice(instance)

        return instance

# Body
# {
#   "invoice_no": "SI-3001",
#   "invoice_date": "2026-02-11",
#   "billing_party": 1,
#   "shipping_party": 2,

#   "items": [
#     {
#       "item": 1,
#       "variant": 1,
#       "qty": 5,
#       "rate": 1000
#     }
#   ],

#   "sundries": [
#     {
#       "ledger": 3,
#       "apply_on": "ITEM",
#       "type": "ADD",
#       "calculation_type": "PERCENT",
#       "value": 9
#     },
#     {
#       "ledger": 4,
#       "apply_on": "ITEM",
#       "type": "ADD",
#       "calculation_type": "PERCENT",
#       "value": 9
#     }
#   ]
# }
