from django.shortcuts import render # type: ignore
from rest_framework import viewsets # type: ignore
from .serializer import TempSerializer
from .models import Temp


class CompanyView(viewsets.ModelViewSet):

    def get_serializer_class(self):
        return TempSerializer
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Temp.objects.filter(is_deleted = False).order_by("name")
        else :
            return Temp.objects.filter(is_deleted = False, user_account = user.id).order_by('name')
        
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(modified_by=self.request.user)