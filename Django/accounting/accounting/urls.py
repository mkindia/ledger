from django.contrib import admin # type: ignore
from django.urls import path, include # type: ignore
from django.contrib.admin import AdminSite  # type: ignore
# from account.views import (CompanyView)
from useraccount.views import (CustomTokenObtainPairView, UserAccountView)
from ledger.views import LedgerView
from company.views import CompanyView
from transaction.views import TransactionViewSet, EntryViewSet, VoucherTypeVieSet
from rest_framework.routers import DefaultRouter # type: ignore
from rest_framework_simplejwt.views import TokenRefreshView # type: ignore

AdminSite.site_header = "Administration" 
AdminSite.site_title = "Site Admin"
AdminSite.index_title = "Site Administration"


router = DefaultRouter()
# router.register('signup', UserAccountView, basename='signup' )
router.register('company', CompanyView, basename='company' )
router.register("user", UserAccountView, basename="user")
router.register("ledger", LedgerView, basename="ledger")
router.register("transaction", TransactionViewSet, basename="transaction")
router.register('entries', EntryViewSet, basename='entries')
router.register('voucher_type', VoucherTypeVieSet, basename='voucher_type')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    # path('transactions/bulk-delete/', bulk_delete_transactions),
    # path('signup/', UserAccountView.as_view(), name='signup'),
    # path('verify-email/<uuid:uuid>/', VerifyEmailView.as_view(), name='verify-email'),
    path('signin/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='refresh'),   
]
