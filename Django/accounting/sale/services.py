from decimal import Decimal


def calculate_invoice(invoice):
    item_total = Decimal(0)

    for item in invoice.items.all():
        item_total += item.amount

    sundry_total = Decimal(0)

    for s in invoice.sundries.all():
        base = item_total

        if s.calculation_type == 'PERCENT':
            amount = base * s.value / Decimal(100)
        else:
            amount = s.value

        if s.type == 'LESS':
            amount = -amount

        s.amount = amount
        s.save()

        sundry_total += amount

    invoice.item_total = item_total
    invoice.sundry_total = sundry_total
    invoice.grand_total = item_total + sundry_total
    invoice.save()

    return invoice
