from django.db import models # type: ignore
from useraccount.models import UserAccount
from ledger.models import Ledger
from company.models import Company
from django.template.defaultfilters import length # type: ignore
from django.core.exceptions import ValidationError # type: ignore

def validate_positive(value:int):
    if value < 0:
        raise ValidationError(
            '%(value)s is not a positive number',
            params={'value': value},
        )
        
class VoucherType(models.Model):
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=50)

    class Meta:
        default_permissions = ()        
        verbose_name = 'Voucher Type'
        verbose_name_plural = 'Voucher Types'

    def __str__(self) -> any:
        return self.name
    
class CompanyVoucherConfig(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    voucher_type = models.ForeignKey(VoucherType, on_delete=models.CASCADE)

    numbering_mode = models.CharField(
        max_length=10,
        choices=[('AUTO', 'Auto'), ('MANUAL', 'Manual')],
        default='AutO'
    )

    prefix = models.CharField(max_length=20, blank=True)
    prefix_separator = models.CharField(max_length=5, blank=True, default='/')
    suffix_separator = models.CharField(max_length=5, blank=True, default='/')

    suffix_type = models.CharField(
        max_length=20,
        choices=[
            ('NONE', 'No suffix'),
            ('FY_SHORT', 'Financial Year (YY-YY)'),
            ('FY_SINGLE', 'Financial Year (YY)'),
            ('YEAR', 'Calendar Year (YYYY)'),
        ],
        default='NONE'
    )
   
    padding = models.PositiveIntegerField(default=4)

    class Meta:
        default_permissions = ()
        unique_together = ('company', 'voucher_type')

    def __str__(self):
       return self.voucher_type.name + " ( " +self.company.name + " ) "
    
class Transaction(models.Model):
    
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    voucher_no = models.CharField(max_length=100, blank=True)
    voucher_type = models.ForeignKey(VoucherType, on_delete=models.PROTECT)
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

class FinancialYear(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=False)

    class Meta:
        unique_together = ('company', 'start_date')

    def delete(self, *args, **kwargs):
        from .models import VoucherSequence
        if VoucherSequence.objects.filter(financial_year=self).exists():
            raise ValidationError(
                "Cannot delete financial year with vouchers."
            )

        super().delete(*args, **kwargs)

    def __str__(self):
        return f"{self.company.name} / {self.start_date.year}-{self.end_date.year}"

class VoucherSequence(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    voucher_type = models.ForeignKey(VoucherType, on_delete=models.CASCADE)
    financial_year = models.ForeignKey(FinancialYear, on_delete=models.CASCADE)

    current_number = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = (
            'company',
            'voucher_type',
            'financial_year'
        )

    def __str__(self):
       return self.voucher_type.name + " ( " +self.company.company_name + " ) "

class Entry(models.Model):
    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE, related_name='entries')
    ledger = models.ForeignKey(Ledger, on_delete=models.PROTECT, related_name='ledger_entries')
    # entry_type = models.CharField(max_length=10, choices=[('debit', 'debit'),('credit','credit')])
    debit = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, validators=[validate_positive])
    credit = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, validators=[validate_positive])
    narration = models.CharField(max_length=200, blank=True)
    # amount = models.DecimalField(default = 0.00, max_digits=10, decimal_places=2, validators=[validate_positive])    
    
    class Meta:
        default_permissions = ()
        verbose_name = 'Transaction Entery'
        verbose_name_plural = 'Transaction Enteries'

    def save(self, *args, **kwargs):
        if length(self.narration) > 0:
            self.narration = self.narration.lower().strip()
            
        super(Entry, self).save(*args, **kwargs)

    def __str__(self):
        if self.debit or self.credit :
            return f"{self.ledger.name}  Voucher Id - {self.transaction.pk} ( {self.ledger.company} )"
        # return f"{self.ledger.name} debit - {self.entry_type}"
    
