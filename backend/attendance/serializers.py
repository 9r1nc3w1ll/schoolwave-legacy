from rest_framework import serializers
from .models import AttendanceRecord

class AttendanceRecordSerializer(serializers.ModelSerializer):
    student = serializers.SerializerMethodField()
    class_id = serializers.SerializerMethodField()
    staff = serializers.SerializerMethodField()

    class Meta:
        model = AttendanceRecord
        fields = '__all__'

    def get_student(self, obj):
        data = {
                'id': obj.student.id,
                'first_name': obj.student.first_name,
                'last_name': obj.student.last_name
            }
        if data:
            return data
        return None
    
    def get_class_id(self, obj):
        data =  {
                'id': obj.class_id.id,
                'name': obj.class_id.name,
                'description': obj.class_id.description,
                'class_index': obj.class_id.class_index,
                'code': obj.class_id.code,
            }
        if data:
            return data
        return None


    def get_staff(self, obj):
        data =  {
                'id': obj.staff.id,
                'title': obj.staff.title,
                'role': list(obj.staff.role.values_list('name', flat=True))
            }
        if data:
            return data
        return None