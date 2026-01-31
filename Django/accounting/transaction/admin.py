from django.contrib import admin # type: ignore
from .models import Transaction, TransactionEntry
admin.site.register(Transaction)

# class Entry(admin.ModelAdmin):  #for Deletion Protect in admin panel
#     def has_delete_permission(self, request, obj=None) -> any:
#         return False
               
admin.site.register(TransactionEntry)