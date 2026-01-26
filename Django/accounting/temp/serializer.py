from rest_framework import serializers  # type: ignore
from .models import Temp


class TempSerializer(serializers.ModelSerializer):

    class Meta:
        model = Temp
        fields = ['id', 'name', 'value']
    
        