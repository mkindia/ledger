from django.contrib import admin
from .models import UserAccount
from django.contrib.auth.admin import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin


class UsersAdmin(BaseUserAdmin):       
    list_display = ('id','username', 'is_verified', 'is_active')
    list_filter = ('username',)
    fieldsets = (
        ('User Credentials', {'fields': ('username','password')}),        
        ('Personal info', {'fields': ('email', 'first_name', 'last_name', 'is_active', 'is_verified', 'is_admin')}),
        ('Permissions',{'classes':('collapse',),'fields':('user_permissions', 'groups')},)
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2')}
        ),
    )
    search_fields = ['username',]
    ordering = ['username']
    filter_horizontal = ()
    
    # hide super user for other admin status
    def get_queryset(self, request):
        qs=super(UsersAdmin, self).get_queryset(request)
        if not request.user.is_superuser:
            return qs.filter(is_superuser=False)
        return qs
    
    #for pervent deletion is_superuser and is_admin    
    def has_delete_permission(self, request, obj=None):
       if obj is None:
           return True
       elif  obj.is_superuser:
           return not obj.is_superuser 
       else:
           return not obj.is_admin

admin.site.register(UserAccount, UsersAdmin)
# admin.site.unregister(Group)
