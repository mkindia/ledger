from django.db import models

# Create your models here.

class Item(models.Model):
    name = models.CharField(max_length=150)
    hsn_code = models.CharField(max_length=20)
    base_unit = models.CharField(max_length=20)

    def __str__(self):
        return self.name

class ItemVariant(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    sku = models.CharField(max_length=50)
    rate = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.sku
    
