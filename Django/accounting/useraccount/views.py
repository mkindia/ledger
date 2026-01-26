from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore
from .models import UserAccount
from rest_framework_simplejwt.views import TokenObtainPairView # type: ignore
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer # type: ignore
from rest_framework import serializers # type: ignore
from rest_framework import viewsets # type: ignore
from .serializer import UserAccountSerializer, VerifyEmailSerializer, ResendEmailSerializer
from rest_framework.decorators import action # type: ignore
from django.utils import timezone  # type: ignore

class UserAccountView(viewsets.ModelViewSet):
    serializer_class = UserAccountSerializer
    def get_queryset(self):
        user = self.request.user
        if not user.is_staff :
            return UserAccount.objects.filter(is_superuser=False, is_admin=False, is_deleted=False)
        else:
            return UserAccount.objects.filter(is_superuser=False, is_deleted=False)

    def create(self, request, *args, **kwargs):
        serializer = UserAccountSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User registered. Check your email to verify your account.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=["post"])
    def resend_code(self, request):
        serializer = ResendEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({"message": "User registered. Check your email to verify your account."})
    
    @action(detail=False, methods=["post"])
    def verify(self, request):
        serializer = VerifyEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({"message": "Email verified successfully."})

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)        
        self.user.last_login = timezone.now()
        self.user.save(update_fields=['last_login'])       
        if not self.user.is_verified:
            raise serializers.ValidationError('user email not verified.')         
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

