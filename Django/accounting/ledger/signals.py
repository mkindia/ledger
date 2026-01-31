from django.db.models.signals import post_save # type: ignore
from django.dispatch import receiver # type: ignore
from  .models import Company, Ledger
from django.db import transaction # type: ignore

# Define the set of ledgers you want each company to start with.
# Use parent_group to link hierarchical ledgers (optional).
DEFAULT_LEDGER_DEFS = [

     # top-level groups    
    {'code':'assets', 'ledger_type' : 0, 'name': 'assets', 'is_pre_defined': True,  'parent': None},
    {'code':'income', 'ledger_type' : 0, 'name': 'income', 'is_pre_defined': True,  'parent': None},
    {'code':'liabilities', 'ledger_type' : 0, 'name': 'liabilities', 'is_pre_defined': True, 'parent': None},
    {'code':'expenses', 'ledger_type' : 0, 'name': 'expenses', 'is_pre_defined': True,  'parent': None},
    {'code':'profit & loss', 'ledger_type': 1, 'name': 'profit & loss', 'parent' : None, 'is_pre_defined': True},
    
    # children example groups
    # {"code": "CURRENT_ASSETS", "name": "Current Assets", "ledger_type": 1, "parent": "ASSETS"},
    {'code': 'capital account', 'ledger_type': 1, 'name': "capital account", 'parent' : 'liabilities', 'is_pre_defined': True},
    {'code': 'current assets', 'ledger_type': 1, 'name': "current assets", 'parent' : 'assets', 'is_pre_defined': True},
    {'code': 'current liabilities', 'ledger_type': 1, 'name': "current liabilities", 'parent' : 'liabilities', 'is_pre_defined': True},
    {'code': 'fixed assets', 'ledger_type': 1, 'name': "fixed assets", 'parent' : 'assets', 'is_pre_defined': True},
    {'code': 'investments', 'ledger_type': 1, 'name': "investments", 'parent' : 'assets', 'is_pre_defined': True},
    {'code': 'loans (liability)', 'ledger_type': 1, 'name': "loans (liability)", 'parent' : 'liabilities', 'is_pre_defined': True},
    {'code': 'pre-operative expenses', 'ledger_type': 1, 'name': "pre-operative expenses", 'parent' : 'expenses', 'is_pre_defined': True},
    # {'code': 108, 'ledger_type': 1, 'name': "profit & loss", 'parent' : None, 'is_pre_defined': True},
    {'code': 'revenue accounts', 'ledger_type': 1, 'name': "revenue accounts", 'parent' : 'income', 'is_pre_defined': True},
    {'code': 'suspense account', 'ledger_type': 1, 'name': "suspense account", 'parent' : 'liabilities', 'is_pre_defined': True},
    {'code': 'cash-in-hand', 'ledger_type': 1, 'name': "cash-in-hand", 'parent' : 'current assets', 'is_pre_defined': True},
    {'code': 'bank accounts', 'ledger_type': 1, 'name': "bank accounts", 'parent' : 'current assets', 'is_pre_defined': True},
    {'code': 'securities & deposits (asset)', 'ledger_type': 1, 'name': "securities & deposits (asset)", 'parent' : 'assets', 'is_pre_defined': True},
    {'code': 'loans & advances (asset)', 'ledger_type': 1, 'name': "loans & advances (asset)", 'parent' : 'current assets', 'is_pre_defined': True},
    {'code': 'stock-in-hand', 'ledger_type': 1, 'name': "stock-in-hand", 'parent' : 'current assets', 'is_pre_defined': True},
    {'code': 'sundry debtors', 'ledger_type': 1, 'name': "sundry debtors", 'parent' : 'current assets', 'is_pre_defined': True},
    {'code': 'sundry creditors', 'ledger_type': 1, 'name': "sundry creditors", 'parent' : 'current liabilities', 'is_pre_defined': True},
    {'code': 'duties & taxes', 'ledger_type': 1, 'name': "duties & taxes", 'parent' : 'current liabilities', 'is_pre_defined': True},
    {'code': 'provisions', 'ledger_type': 1, 'name': "provisions", 'parent' : 'current liabilities', 'is_pre_defined': True},
    {'code': 'secured loans', 'ledger_type': 1, 'name': "secured loans", 'parent' : 'loans (liability)', 'is_pre_defined': True},
    {'code': 'unsecured loans', 'ledger_type': 1, 'name': "unsecured loans", 'parent' : 'loans (liability)', 'is_pre_defined': True},
    {'code': 'purchase accounts', 'ledger_type': 1, 'name': "purchase accounts", 'parent' : 'expenses', 'is_pre_defined': True},
    {'code': 'sales accounts', 'ledger_type': 1, 'name': "sales accounts", 'parent' : 'income', 'is_pre_defined': True},
    {'code': 'expenses direct', 'ledger_type': 1, 'name': "expenses direct", 'parent' : 'expenses', 'is_pre_defined': True},
    {'code': 'expenses indirect', 'ledger_type': 1, 'name': "expenses indirect", 'parent' : 'expenses', 'is_pre_defined': True},
    {'code': 'income direct', 'ledger_type': 1, 'name': "income direct", 'parent' : 'income', 'is_pre_defined': True},
    {'code': 'income indirect', 'ledger_type': 1, 'name': "income indirect", 'parent' : 'income', 'is_pre_defined': True},
    {'code': 'bank od a/c', 'ledger_type': 1, 'name': "bank od a/c", 'parent' : 'loans (liability)', 'is_pre_defined': True},
    {'code': 'reserves & surplus', 'ledger_type': 1, 'name': "reserves & surplus", 'parent' : 'capital account', 'is_pre_defined': True},    
    {'code': 'misc. expenses (asset)', 'ledger_type': 1, 'name': "misc. expenses (asset)", 'parent' : 'expenses', 'is_pre_defined': True},
    {'code': 'branch/divisions', 'ledger_type': 1, 'name': "branch/divisions", 'parent' : 'liabilities', 'is_pre_defined': True},
    {'code': 'deposits(assets)', 'ledger_type': 1, 'name': "deposits(assets)", 'parent' : 'current assets', 'is_pre_defined': True},
    # LEVEL 3 – ACCOUNTS   
    {"code": "cash", "name": "cash", "ledger_type": 2, "parent": "cash-in-hand"},
    {"code": "sales", "name": "sales", "ledger_type": 2, "parent": "sales accounts"},
    {"code": "purchase", "name": "purchase", "ledger_type": 2, "parent": "purchase accounts"},
]

@receiver(post_save, sender=Company)
def create_default_ledgers_for_company(sender:any, instance, **kwargs):

    with transaction.atomic():       
        created = {}
        pending = DEFAULT_LEDGER_DEFS.copy()

        while pending:
            progress = False

            for item in pending[:]:
                parent_code = item["parent"]
                # parent is root OR already created
                if parent_code is None or parent_code in created:
                    parent = created.get(parent_code)                    
                    ledger, _ = Ledger.objects.update_or_create(
                        company=instance,
                        code=item["code"],
                        defaults={
                            "name": item["name"],
                            "ledger_type": item["ledger_type"],
                            "is_pre_defined": True,
                            "parent": parent,
                        }
                    )

                    created[item["code"]] = ledger
                    pending.remove(item)
                    progress = True

            if not progress:
                raise ValueError("Invalid parent reference in DEFAULT_LEDGER_DEFS")

        