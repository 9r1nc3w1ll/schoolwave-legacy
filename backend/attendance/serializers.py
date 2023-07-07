from rest_framework import serializers
from .models import AttendanceRecord

class AttendanceRecordSerializer(serializers.ModelSerializer):
    class_info = serializers.SerializerMethodField()
    staff_info = serializers.SerializerMethodField()
    attendance = serializers.SerializerMethodField()

    class Meta:
        model = AttendanceRecord
        fields = (
            'class_info',
            'staff_info',
            'class_id',
            'subject',
            'staff',
            'created_at',
            'updated_at',
            'deleted_at',
            'attendance_type',
            'attendance'
        )

    def get_class_info(self, obj):
        data = {
            'id': obj.class_id.id,
            'name': obj.class_id.name,
            'description': obj.class_id.description,
            'class_index': obj.class_id.class_index,
            'code': obj.class_id.code,
        }
        if data:
            return data
        return None

    def get_staff_info(self, obj):
        data = {
            'id': obj.staff.id,
            'title': obj.staff.title,
        }
        if data:
            return data
        return None

    def get_attendance(self, obj):
        attendance_records = AttendanceRecord.objects.filter(
            class_id=obj.class_id,
            subject=obj.subject,
            staff=obj.staff,
            deleted_at=None
        )

        attendance_data = []
        for record in attendance_records:
            student_data = {
                'student_id': record.student.id,
                'first_name': record.student.first_name,
                'last_name': record.student.last_name,
                'present': record.present,
                'remark': record.remark,
                'attendance_id': record.id,
            }
            attendance_data.append(student_data)

        attendance = {
            'date': obj.date,
            'students': attendance_data,
        }
        return [attendance]


