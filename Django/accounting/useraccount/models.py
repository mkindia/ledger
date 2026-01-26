from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin 
from django.template.defaultfilters import length
from django.dispatch.dispatcher import receiver
from django.db.models.signals import pre_delete
from django.core.exceptions import PermissionDenied
from django.utils import timezone
import random, string

def generate_code():
    return ''.join(random.choices(string.digits, k=6))  # 6-digit OTP


class UsersManager(BaseUserManager):
    def create_user(self, email, username, first_name, last_name, is_active = False, password=None):
        if not email:
            raise ValueError('Users must have an email address')
        user = self.model(
            email=self.normalize_email(email),
            username = username,
            first_name=first_name,
            last_name=last_name
        )
        user.is_active = is_active
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, first_name, last_name, password=None):
        user = self.create_user(
            email=email,
            username=username,
            first_name=first_name,
            last_name=last_name,
            password=password
        )
        user.is_superuser = True
        user.is_admin = True
        user.is_active = True
        user.is_verified = True
        user.save(using=self._db)
        return user

class UserAccount(AbstractBaseUser, PermissionsMixin):    
    username = models.CharField(max_length=30, unique=True, verbose_name="username")
    email = models.EmailField(max_length=255, unique=True, verbose_name='email')
    first_name = models.CharField(max_length=150, verbose_name='first name')
    last_name = models.CharField(max_length=150, verbose_name='last name')   
    is_verified = models.BooleanField(default=False, help_text='user should be email verified')
    multi_user = models.BooleanField(default=False, help_text='user should be multi company opration')
    is_superuser = models.BooleanField(default=False, help_text='has all permissions', verbose_name='superuser')
    is_admin = models.BooleanField(default=False, help_text='has permissions for staff.', verbose_name='admin')
    is_active = models.BooleanField(default=False, help_text='user should be treated as active', verbose_name='active')
    is_deleted = models.BooleanField(default=False, help_text='user should be treated as deleted', verbose_name='deleted')
    verification_code = models.CharField(max_length=6, blank=True, default=generate_code)
    comment = models.TextField(blank=True, default='')
    last_login = models.DateTimeField(auto_now=True, blank=True, null=True, verbose_name='last login')
    created_on = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    modified_on = models.DateTimeField(auto_now=True, blank=True, null=True)    
    created_by = models.ForeignKey('self', on_delete=models.SET_NULL, null=True)
    modified_by = models.ForeignKey('self', related_name='user_modified_by', on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        default_permissions = ()
        
    objects = UsersManager()
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name']

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        if length(self.username) > 0:
            self.username = self.username.lower().strip()
        if length(self.comment) > 0:
            self.comment = self.comment.lower().strip()
        if length(self.email) > 0:
            self.email = self.email.lower().strip()
        super(UserAccount, self).save(*args, **kwargs)

    def has_perm(self, perm, obj=None):
        """Does the user have a specific permission?"""
        # Simplest possible answer: Yes, always
        return True

    def has_module_perms(self, app_label):
        """Does the user have permissions to view the app `app_label`?"""
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        """Is the user a member of staff?"""
        # Simplest possible answer: All admins are staff
        return self.is_admin

#for pervent deletion is_superuser and is_admin    
@receiver(pre_delete, sender=UserAccount)
def delete_user(sender, instance, **kwargs):
    if instance.is_superuser or instance.is_admin:
        raise PermissionDenied