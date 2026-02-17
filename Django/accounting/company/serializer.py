from rest_framework import serializers
from .models import Company


class CompanySerializer(serializers.ModelSerializer):
    is_selected = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = ['id', 'name', 'is_selected']

    def validate_name(self, value):
        user = self.context['request'].user

        if Company.objects.filter(name=value, created_by=user).exists():
            raise serializers.ValidationError(
                "Company with this name already exists."
            )

        return value

    def get_is_selected(self, obj):
        user = self.context['request'].user

        from .models import UserCompanyPreference
        preference = UserCompanyPreference.objects.filter(user=user).first()

        if preference and preference.default_company:
            return obj.id == preference.default_company.id

        return False



# from rest_framework import serializers
# from django.db.models import Q
# from .models import Company


# class CompanySerializer(serializers.ModelSerializer):
#     users = serializers.StringRelatedField(
#         many=True,
#         read_only=True
#     )
#     is_selected = serializers.SerializerMethodField()
#     class Meta:
#         model = Company
#         fields = ['id', 'name', 'users', 'is_selected']
#         read_only_fields = ['created_by']

#     def get_is_selected(self, obj):
#         user = self.context['request'].user
#         preference = getattr(user, 'company_preference', None)

#         if preference and preference.default_company:
#             return obj.id == preference.default_company.id

#         return False
    
#     # def validate_name(self, value):
#     #     user = self.context['request'].user

#     #     if Company.objects.filter(
#     #         name=value,
#     #         created_by=user
#     #     ).exists():
#     #         raise serializers.ValidationError(
#     #             "You already created a company with this name."
#     #         )

#     #     return value

#     # def create(self, validated_data):
#     #     user = self.context['request'].user

#     #     company = Company.objects.create(
#     #         created_by=user,
#     #         **validated_data
#     #     )

#     #     # Add creator to company users
#     #     company.users.add(user)

#     #     return company

