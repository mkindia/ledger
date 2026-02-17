from django.db import models
from useraccount.models import UserAccount
from django.template.defaultfilters import length # type: ignore
from django.core.exceptions import ValidationError # type: ignore
from django.db.models import Q 

class Company(models.Model):
    users = models.ManyToManyField(UserAccount, related_name='companies', blank=True)    
    name = models.CharField(max_length=30)
    alies = models.CharField(max_length=30, blank=True)
    print_name = models.CharField(max_length=30, blank=True)
    # financial_year_start = models.DateField(blank=True, null=True)
    is_deleted = models.BooleanField(default=False, help_text='company should be treated as deleted',
                                     verbose_name='company_deleted')    
    created_on = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    modified_on = models.DateTimeField(auto_now=True, blank=True, null=True)
    created_by = models.ForeignKey(UserAccount, related_name='created_company', on_delete=models.SET_NULL, blank=True, null=True)
    modified_by = models.ForeignKey(UserAccount, related_name='modified_company', on_delete=models.SET_NULL, blank=True, null=True)

    class Meta:
        verbose_name = 'Company'
        verbose_name_plural = 'Companies'
        constraints = [
            models.UniqueConstraint(fields=['name', 'created_by'], name='unique_name_per_user')
        ]

    

    # def clean(self, *args:any, **kwargs):        
    #     if Company.objects.filter(user=self.user, name__iexact=self.name).exclude(pk=self.pk).exists():                               
    #             raise ValidationError({"__all__": "You already have a company with this name."})

    #     if self.is_selected:
    #         qs = Company.objects.filter(user=self.user, is_selected=True).exclude(pk=self.pk)
    #         if qs.exists():
    #             raise ValidationError("You can only select one company as active.")   

    def save(self, *args:any, **kwargs):

        # if self.is_selected:
        #     # Unselect all other companies for this user
        #     Company.objects.filter(user=self.user, is_selected=True).update(is_selected=False)
        
        if length(self.name) > 0:
            self.name = self.name.lower().strip()
        if length(self.alies) > 0:
            self.alies = self.alies.lower().strip()
        if length(self.print_name) > 0:
            self.print_name = self.print_name.lower().strip()

        # self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.name}"
    
class UserCompanyPreference(models.Model):
    user = models.OneToOneField(UserAccount, on_delete=models.CASCADE, related_name='company_preference')
    default_company = models.ForeignKey(Company, null=True, blank=True, on_delete=models.SET_NULL, related_name='default_for_users')

    def __str__(self):
        return f"{self.user} → {self.default_company}"
