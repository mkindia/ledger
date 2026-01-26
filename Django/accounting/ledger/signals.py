from django.db.models.signals import post_save # type: ignore
from django.dispatch import receiver # type: ignore
from  .models import Company, Ledger
from django.db import transaction # type: ignore

# Define the set of ledgers you want each company to start with.
# Use parent_group to link hierarchical ledgers (optional).
DEFAULT_LEDGER_DEFS = [
     # top-level groups
    
    {'group':'assets', 'ledger_type' : 0, 'name': 'assets', 'is_pre_defined': True,  'parent_group': None},
    {'group':'income', 'ledger_type' : 0, 'name': 'income', 'is_pre_defined': True,  'parent_group': None},
    {'group':'liabilities', 'ledger_type' : 0, 'name': 'liabilities', 'is_pre_defined': True, 'parent_group': None},
    {'group':'expenses', 'ledger_type' : 0, 'name': 'expenses', 'is_pre_defined': True,  'parent_group': None},
    {'group': 'profit & loss', 'ledger_type': 1, 'name': 'profit & loss', 'parent_group' : None, 'is_pre_defined': True},

     # children example
    
    {'group': 'capital account', 'ledger_type': 1, 'name': "capital account", 'parent_group' : 3, 'is_pre_defined': True},
    {'group': 'current assets', 'ledger_type': 1, 'name': "current assets", 'parent_group' : 1, 'is_pre_defined': True},
    {'group': 'current liabilities', 'ledger_type': 1, 'name': "current liabilities", 'parent_group' : 3, 'is_pre_defined': True},
    {'group': 'fixed assets', 'ledger_type': 1, 'name': "fixed assets", 'parent_group' : 1, 'is_pre_defined': True},
    {'group': 'investments', 'ledger_type': 1, 'name': "investments", 'parent_group' : 1, 'is_pre_defined': True},
    {'group': 'loans (liability)', 'ledger_type': 1, 'name': "loans (liability)", 'parent_group' : 3, 'is_pre_defined': True},
    {'group': 'pre-operative expenses', 'ledger_type': 1, 'name': "pre-operative expenses", 'parent_group' : 4, 'is_pre_defined': True},
    # {'group': 108, 'ledger_type': 1, 'name': "profit & loss", 'parent_group' : None, 'is_pre_defined': True},
    {'group': 'revenue accounts', 'ledger_type': 1, 'name': "revenue accounts", 'parent_group' : 2, 'is_pre_defined': True},
    {'group': 'suspense account', 'ledger_type': 1, 'name': "suspense account", 'parent_group' : 3, 'is_pre_defined': True},
    {'group': 'cash-in-hand', 'ledger_type': 1, 'name': "cash-in-hand", 'parent_group' : 102, 'is_pre_defined': True},
    {'group': 'bank accounts', 'ledger_type': 1, 'name': "bank accounts", 'parent_group' : 102, 'is_pre_defined': True},
    {'group': 'securities & deposits (asset)', 'ledger_type': 1, 'name': "securities & deposits (asset)", 'parent_group' : 102, 'is_pre_defined': True},
    {'group': 'loans & advances (asset)', 'ledger_type': 1, 'name': "loans & advances (asset)", 'parent_group' : 102, 'is_pre_defined': True},
    {'group': 'stock-in-hand', 'ledger_type': 1, 'name': "stock-in-hand", 'parent_group' : 102, 'is_pre_defined': True},
    {'group': 'sundry debtors', 'ledger_type': 1, 'name': "sundry debtors", 'parent_group' : 102, 'is_pre_defined': True},
    {'group': 'sundry creditors', 'ledger_type': 1, 'name': "sundry creditors", 'parent_group' : 103, 'is_pre_defined': True},
    {'group': 'duties & taxes', 'ledger_type': 1, 'name': "duties & taxes", 'parent_group' : 103, 'is_pre_defined': True},
    {'group': 'provisions', 'ledger_type': 1, 'name': "provisions", 'parent_group' : 103, 'is_pre_defined': True},
    {'group': 'secured loans', 'ledger_type': 1, 'name': "secured loans", 'parent_group' : 106, 'is_pre_defined': True},
    {'group': 'unsecured loans', 'ledger_type': 1, 'name': "unsecured loans", 'parent_group' : 106, 'is_pre_defined': True},
    {'group': 'purchase accounts', 'ledger_type': 1, 'name': "purchase accounts", 'parent_group' : 4, 'is_pre_defined': True},
    {'group': 'sales accounts', 'ledger_type': 1, 'name': "sales accounts", 'parent_group' : 2, 'is_pre_defined': True},
    {'group': 'expenses direct', 'ledger_type': 1, 'name': "expenses direct", 'parent_group' : 4, 'is_pre_defined': True},
    {'group': 'expenses indirect', 'ledger_type': 1, 'name': "expenses indirect", 'parent_group' : 4, 'is_pre_defined': True},
    {'group': 'income direct', 'ledger_type': 1, 'name': "income direct", 'parent_group' : 2, 'is_pre_defined': True},
    {'group': 'income indirect', 'ledger_type': 1, 'name': "income indirect", 'parent_group' : 2, 'is_pre_defined': True},
    {'group': 'bank od a/c', 'ledger_type': 1, 'name': "bank od a/c", 'parent_group' : 106, 'is_pre_defined': True},
    {'group': 'reserves & surplus', 'ledger_type': 1, 'name': "reserves & surplus", 'parent_group' : 101, 'is_pre_defined': True},
    # {'group': 130, 'ledger_type': 1, 'name': "bank accounts", 'parent_group' : 102, 'is_pre_defined': True},
    # {'group': 131, 'ledger_type': 1, 'name': "bank accounts", 'parent_group' : 102, 'is_pre_defined': True},
    {'group': 'misc. expenses (asset)', 'ledger_type': 1, 'name': "misc. expenses (asset)", 'parent_group' : 1, 'is_pre_defined': True},

    # creat for user
    {'group': 'sales accounts', 'ledger_type': 2, 'name': "sales", 'parent_group' : 2, 'is_pre_defined': False,},
]

@receiver(post_save, sender=Company)
def create_default_ledgers_for_company(sender, instance: Company, created, **kwargs):
    if not created:
        return

    # create ledgers in a transaction and resolve parents by group
    with transaction.atomic():
        created_map = {}  # group -> Ledger instance for this company

        # first pass: create top-level ledgers and any with no parent defined
        for item in DEFAULT_LEDGER_DEFS:
            if not item.get('parent_group'):
                ledger, _ = Ledger.objects.get_or_create(
                    company=instance,
                    group=item['group'],
                    defaults={
                        'name': item['name'],
                        'ledger_type': item['ledger_type'],
                        'is_pre_defined': item['is_pre_defined'],                       
                    }
                )
                created_map[item['group']] = ledger

        # second pass: create children, resolving parent from created_map or DB
        for item in DEFAULT_LEDGER_DEFS:
            parent_group = item.get('parent_group')
            if parent_group:
                parent = created_map.get(parent_group) or Ledger.objects.filter(company=instance, group = parent_group).first()
                ledger, _ = Ledger.objects.get_or_create(
                    company=instance,
                    group=item['group'],
                    defaults={
                        'name': item['name'],
                        'ledger_type': item['ledger_type'],
                        'is_pre_defined': item['is_pre_defined'],                       
                        'under': parent
                    }
                )
                created_map[item['group']] = ledger

        