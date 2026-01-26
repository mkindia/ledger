from django.db import models # type: ignore
from useraccount.models import UserAccount

# Create your models here.
class Temp(models.Model):
    Temp_id = models.PositiveSmallIntegerField(default=1, unique=True, editable=False)
    name = models.CharField(max_length=50)
    value = models.TextField(max_length=1000)
    comment = models.TextField(max_length=100)
    created_on = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    modified_on = models.DateTimeField(auto_now=True, blank=True, null=True)
    created_by = models.ForeignKey(UserAccount, related_name='temp_created_by', on_delete=models.SET_NULL, blank=True, null=True)
    modified_by = models.ForeignKey(UserAccount, related_name='temp_modified_by', on_delete=models.SET_NULL, blank=True, null=True)

    def save(self, *args, **kwargs):
        self.Temp_id_id = 1  # always force only one row
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
