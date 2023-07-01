from rest_framework import serializers
from .models import Family, FamilyRole

class ParentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Family
        fields = '__all__'


class ParentRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = FamilyRole
        fields = '__all__'