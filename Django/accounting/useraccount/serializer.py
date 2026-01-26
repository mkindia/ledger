from rest_framework import serializers  # type: ignore
from .models import UserAccount
from django.contrib.auth.password_validation import validate_password # type: ignore
from django.core.mail import send_mail # type: ignore
from django.conf import settings # type: ignore
# from django.contrib.auth.hashers import make_password
# from django.utils import timezone
# from datetime import timedelta
# from rest_framework_simplejwt.tokens import RefreshToken # type: ignore
import random

def send_verification_email(self, user_email, verification_code):
    send_mail(
        subject='Verify your email',
        message=f'Your verification code is: {verification_code}',
        from_email=settings.EMAIL_HOST_USER,  # DEFAULT_FROM_EMAIL for console
        recipient_list=[user_email]
        )

class UserAccountSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = UserAccount
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'password']

    def create(self, validated_data):
        user = UserAccount.objects.create_user(
            email=validated_data['email'],           
            first_name = validated_data['first_name'],
            last_name = validated_data['last_name'],
            username=validated_data['username'],
            password=validated_data['password']
        )        
        send_verification_email(self={'recipient_list': user.email, 'message': user.verification_code}, user_email=user.email, verification_code=user.verification_code)
        return user
    
class ResendEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()
    
    def validate(self, data):
        try:
            user = UserAccount.objects.get(email=data["email"])
            if not user.is_verified :
                send_verification_email(self='', user_email=user.email, verification_code=user.verification_code)
            else:
                raise serializers.ValidationError("user already verified login with user name and password")
        except UserAccount.DoesNotExist:
            raise serializers.ValidationError("No user found with this email.")
        
        return data


class VerifyEmailSerializer(serializers.Serializer):    
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)

    def validate(self, data):
        try:
            user = UserAccount.objects.get(email=data["email"])
        except UserAccount.DoesNotExist:
            raise serializers.ValidationError("No user found with this email.")

        if user.verification_code != data["code"]:
            raise serializers.ValidationError("Invalid verification code.")

        user.is_verified = True
        user.is_active = True
        # user.verification_code = None
        user.save()
        return data
