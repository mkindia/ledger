from django.contrib import admin # type: ignore
from .models import Transaction, Entry, CompanyVoucherConfig, VoucherType, FinancialYear, VoucherSequence
admin.site.register(Transaction)
admin.site.register(VoucherType)
admin.site.register(CompanyVoucherConfig)
admin.site.register(FinancialYear)
admin.site.register(VoucherSequence)

# class Entry(admin.ModelAdmin):  #for Deletion Protect in admin panel
#     def has_delete_permission(self, request, obj=None) -> any:
#         return False
               
admin.site.register(Entry)