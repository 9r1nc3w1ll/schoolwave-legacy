from rest_framework import serializers
from .models import Staff, StaffRole

class StaffSerializer(serializers.ModelSerializer):
    user_info = serializers.SerializerMethodField()
    class Meta:
        model = Staff
        fields = '__all__'

    def get_user_info(self, obj):
        data = {
            'user': obj.user.id,
            'first_name': obj.user.first_name,
            'last_name': obj.user.last_name
        }
        if data:
            return data
        return None


class StaffRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffRole
        fields = '__all__'
