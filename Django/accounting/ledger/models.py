from django.db import models # type: ignore
from useraccount.models import UserAccount
from django.template.defaultfilters import length # type: ignore
from django.core.exceptions import ValidationError # type: ignore
from django.db.models import Q # type: ignore
from company.models import Company


# class Company(models.Model):
#     user = models.ManyToManyField(UserAccount, related_name='companies')    
#     name = models.CharField(max_length=30)
#     alies = models.CharField(max_length=30, blank=True)
#     print_name = models.CharField(max_length=30, blank=True)
#     # financial_year_start = models.DateField(blank=True, null=True)
#     is_deleted = models.BooleanField(default=False, help_text='company should be treated as deleted',
#                                      verbose_name='company_deleted')
#     is_selected = models.BooleanField(default=False)
#     created_on = models.DateTimeField(auto_now_add=True, blank=True, null=True)
#     modified_on = models.DateTimeField(auto_now=True, blank=True, null=True)
#     created_by = models.ForeignKey(UserAccount, related_name='company_created_by', on_delete=models.SET_NULL, blank=True, null=True)
#     modified_by = models.ForeignKey(UserAccount, related_name='company_modified_by', on_delete=models.SET_NULL, blank=True, null=True)

#     class Meta:
#         verbose_name = 'Company ( User )'
#         verbose_name_plural = 'Companies'
#         constraints = [
#             models.UniqueConstraint(fields=['user', 'name'], name='unique_name_per_user')
#         ]

#     # def clean(self, *args:any, **kwargs):        
#     #     if Company.objects.filter(user=self.user, name__iexact=self.name).exclude(pk=self.pk).exists():                               
#     #             raise ValidationError({"__all__": "You already have a company with this name."})

#     #     if self.is_selected:
#     #         qs = Company.objects.filter(user=self.user, is_selected=True).exclude(pk=self.pk)
#     #         if qs.exists():
#     #             raise ValidationError("You can only select one company as active.")   

#     def save(self, *args:any, **kwargs):

#         # if self.is_selected:
#         #     # Unselect all other companies for this user
#         #     Company.objects.filter(user=self.user, is_selected=True).update(is_selected=False)
        
#         if length(self.name) > 0:
#             self.name = self.name.lower().strip()
#         if length(self.alies) > 0:
#             self.alies = self.alies.lower().strip()
#         if length(self.print_name) > 0:
#             self.print_name = self.print_name.lower().strip()

#         # self.full_clean()
#         super().save(*args, **kwargs)

#     def __str__(self) -> str:
#         return f"{self.name}"
    
# class Code(models.IntegerChoices):
#         ASSETS = 1, 'Assets'
#         INCOME = 2, 'Income'
#         LIABILITIES = 3, 'Liabilities'
#         EXPENSES = 4, 'Expenses'
#         CAPITAL_ACCOUNT = 100, 'Capital Account'
#         CASH_IN_HAND = 111, 'Cash-In-Hand'
#         BANK_ACCOUNT = 112, "Bank Accounts"
#         SECURITIES_AND_DEPOSITS_ASSET = 113, "Securities & Deposits (Asset)"
#         LOANS_AND_ADVANCES_ASSETS = 114, "Loans & advances (Asset)"
#         STOCK_IN_HAND = 115, "Stock-In-Hand"
#         SUNDRY_DEBTORS = 116, "Sundry Debtors"
#         SUNDRY_CREDITORS = 117, "Sundry Creditors"
#         DUTIES_AND_TAXES = 118, "Duties & Taxes"
#         PROVISIONS = 119, "Provisions"
#         SECURED_LOANS = 120, "Secured Loans"
#         UNSECURED_LOANS = 121, "Unsecured Loans"
#         PURCHASE_ACCOUNTS = 122, "Purchase Accounts"
#         SALES_ACCOUNTS = 123, "Sales Accounts"
#         EXPENSES_DIRECT = 124, "Expenses Direct"
#         EXPENSES_INDIRECT = 125, "Expenses Indirect"
#         INCOME_DIRECT = 126, "Income Direct"
#         INCOME_INDIRECT = 127, "Income Indirect"
#         BANK_OD_ACCOUNT = 128, "Bank Od A/C"
#         RESERVES_AND_SURPLUS = 129, "Reserves & Surplus"
#         MISC_EXPENSES_ASSETS = 132, "Misc. Expenses (Asset)"

class Code(models.TextChoices):             
        ASSETS = 'assets', 'Assets'
        INCOME = 'income', 'Income'
        LIABILITIES = 'liabilities', 'Liabilities'
        EXPENSES = 'expenses', 'Expenses'
        CAPITAL_ACCOUNT = 'capital account', 'Capital Account'
        CASH_IN_HAND = 'cash-in-hand', 'Cash-In-Hand'
        BANK_ACCOUNT = 'bank accounts', 'Bank Accounts'
        SECURITIES_AND_DEPOSITS_ASSET = 'securities & deposits (asset)', 'Securities & Deposits (Asset)'
        LOANS_AND_ADVANCES_ASSETS = 'loans & advances (asset)', 'Loans & advances (Asset)'
        STOCK_IN_HAND = 'stock-in-hand', 'Stock-In-Hand'
        SUNDRY_DEBTORS = 'sundry debtors', 'Sundry Debtors'
        SUNDRY_CREDITORS = 'sundry creditors', 'Sundry Creditors'
        DUTIES_AND_TAXES = 'duties & taxes', 'Duties & Taxes'
        PROVISIONS = 'provisions', 'Provisions'
        SECURED_LOANS = 'secured loans', 'Secured Loans'
        UNSECURED_LOANS = 'unsecured loans', 'Unsecured Loans'
        PURCHASE_ACCOUNTS = 'purchase accounts', 'Purchase Accounts'
        SALES_ACCOUNTS = 'sales accounts', 'Sales Accounts'
        EXPENSES_DIRECT = 'expenses direct', 'Expenses Direct'
        EXPENSES_INDIRECT = 'expenses indirect', 'Expenses Indirect'
        INCOME_DIRECT = 'income direct', 'Income Direct'
        INCOME_INDIRECT = 'income indirect', 'Income Indirect'
        BANK_OD_ACCOUNT = 'bank od a/c', 'Bank Od A/C'
        RESERVES_AND_SURPLUS = 'reserves & surplus', 'Reserves & Surplus'
        MISC_EXPENSES_ASSETS = 'misc. expenses (asset)', 'Misc. Expenses (Asset)'
        DEPOSITS_ASSETS = 'deposits(assets)', 'Deposits(Assets)'
        BRANCH_DIVISIONS = 'branch/divisions', 'Branch/Divisions'

class ledger_type_choice(models.IntegerChoices):
        DEFAULT = 0, 'Primary'
        PRE_DEFINED_ACCOUNTING_GROUP = 1, 'Accounting group ( Pre defined )'
        CREATED_BY_USER_ACCOUNTING = 2, 'Accounting ledger ( Created by user )'

class Ledger(models.Model):
   
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='ledgers')
    ledger_type = models.PositiveSmallIntegerField(choices=ledger_type_choice.choices)
    code = models.CharField(max_length=50, choices=Code.choices, blank=True)
    name = models.CharField(max_length=100, error_messages='Plese Enter Uniqe Name')
    alias = models.CharField(max_length=100, blank=True, null=True)
    print_name = models.CharField(max_length=100, blank=True)   
    parent = models.ForeignKey("self", on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    opening_balance = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    balance_type = models.CharField(max_length=10, choices=[('debit','debit'),('credit','credit')],default='debit')
    is_pre_defined = models.BooleanField(default=False)    
    affect_gross_profits = models.BooleanField(default=False)
    is_sub_ledger = models.BooleanField(default=False)
    nett_debit_credit_balances_reporting = models.BooleanField(default=False)
    phone = models.CharField(max_length=20, blank=True) 
    is_deleted = models.BooleanField(default=False, help_text='ledger should be treated as deleted',
                                     verbose_name='ledger_deleted')
    created_on = models.DateTimeField(auto_now_add=True, null=True)
    modified_on = models.DateTimeField(auto_now=True, null=True)    
    created_by = models.ForeignKey(UserAccount, related_name='group_created_by', on_delete=models.SET_NULL, null=True)
    modified_by = models.ForeignKey(UserAccount, related_name='group_modified_by', on_delete=models.SET_NULL, null=True)

    class Meta:
        default_permissions = ()       
        verbose_name = 'Ledger'
        verbose_name_plural = 'Ledgers'
        constraints = [            
            models.UniqueConstraint(fields=['company', 'name', 'alias'], condition=~Q(alias = None), name='unique_alias_if_not_null'),            
            models.UniqueConstraint(fields=['company', 'name', ], name='unique_name'),            
        ]

            
    def delete(self, *args:any, **kwargs):
        if self.is_pre_defined:
            raise ValidationError("Cannot delete an is Pre Defined Ledger.")
        return super().delete(*args, **kwargs)
    
    @classmethod
    def prevent_bulk_delete(cls, queryset:any):
        # Filter out active objects before deletion
        inactive_queryset = queryset.filter(is_pre_defined=False)
        if queryset.count() != inactive_queryset.count():
            raise ValidationError("Cannot delete active records in bulk.")
        inactive_queryset.delete()


    def __str__(self) -> str:
        return f"{self.name} ( {self.company.name} )"
