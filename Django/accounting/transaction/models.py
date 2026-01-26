from django.db import models
from useraccount.models import UserAccount
from ledger.models import Ledger, Company
from django.template.defaultfilters import length
from django.core.exceptions import ValidationError

def validate_positive(value):
    if value < 0:
        raise ValidationError(
            '%(value)s is not a positive number',
            params={'value': value},
        )
    
class Jurnal(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_on = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    modified_on = models.DateTimeField(auto_now=True, blank=True, null=True)
    created_by = models.ForeignKey(UserAccount,related_name = 'jurnal_ceated_by', on_delete=models.SET_NULL, blank=True, null=True)
    modified_by = models.ForeignKey(UserAccount, related_name = 'jurnal_modified_by', on_delete=models.SET_NULL, blank=True, null=True)

    def __str__(self):
        return self.name

class Transaction(models.Model):
    transaction_type = [('sale','sale'),('purchase','purchase'),
                    ('journal','journal'),('receipt','receipt'),
                    ('contra','contra'),('credit_note','credit_note'),
                    ('debit_note','debit_note'),('delivery_note','delivery_note'),
                    ('payment','payment')]
   
    voucher_no = models.CharField(max_length=100, blank=True)
    voucher_type = models.CharField(max_length=30, choices = transaction_type, default='sales')
    date = models.DateField(auto_now=False, auto_now_add=False)
    narration = models.CharField(max_length=200, blank=True)
    created_on = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    modified_on = models.DateTimeField(auto_now=True, blank=True, null=True)
    created_by = models.ForeignKey(UserAccount,related_name = 'voucher_ceated_by', on_delete=models.SET_NULL, blank=True, null=True)
    modified_by = models.ForeignKey(UserAccount, related_name = 'voucher_modified_by', on_delete=models.SET_NULL, blank=True, null=True)

    class Meta:
        default_permissions = ()        
        verbose_name = 'Transaction'
        verbose_name_plural = 'Transactions'        

    def __str__(self):
        return f"Voucher_No - {self.pk}"        

class TransactionEntry(models.Model):
    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE, related_name='entries')
    ledger = models.ForeignKey(Ledger, on_delete=models.CASCADE, related_name='ledger_entries')
    entry_type = models.CharField(max_length=10, choices=[('debit', 'debit'),('credit','credit')])
    narration = models.CharField(max_length=200, blank=True)
    amount = models.DecimalField(default = 0.00, max_digits=10, decimal_places=2, validators=[validate_positive])    
    
    class Meta:
        default_permissions = ()
        verbose_name = 'Transaction Entery'
        verbose_name_plural = 'Transaction Enteries'

    def save(self, *args, **kwargs):
        if length(self.narration) > 0:
            self.narration = self.narration.lower().strip()
            
        super(TransactionEntry, self).save(*args, **kwargs)

    def __str__(self):
        if self.amount:
            return f"{self.ledger.name} {self.amount} {self.entry_type} Voucher Id - {self.transaction.pk} ( {self.ledger.company} )"
        # return f"{self.ledger.name} debit - {self.entry_type}"
    
