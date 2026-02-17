from rest_framework import viewsets # type: ignore
from .serializer import CompanySerializer
from .models import Company
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

class CompanyView(viewsets.ModelViewSet):
    
    def get_serializer_class(self):
        return CompanySerializer
    
    def get_queryset(self):
        user = self.request.user   
        # return Company.objects.filter(users=self.request.user.id)     

        if user.is_staff:
            return Company.objects.filter(is_deleted = False).order_by("name")
        else :
            return Company.objects.filter(is_deleted = False, users = user.id).order_by('name')
        
    def perform_create(self, serializer):
        user = self.request.user
        company = serializer.save(created_by=user)
        company.users.add(user)

        # 🔥 Auto select company if no default exists
        from .models import UserCompanyPreference
        preference, created = UserCompanyPreference.objects.get_or_create(user=user)

        if not preference.default_company:
            preference.default_company = company
            preference.save()

    
    # ✅ Custom Action
    @action(detail=True, methods=['post'])
    def set_default(self, request, pk=None):        
        company = self.get_object()
        preference = request.user.company_preference
        preference.default_company = company
        print(preference)
        preference.save()

        return Response({"message": "Default company updated"})