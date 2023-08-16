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
            'attendee',
            'created_at',
            'updated_at',
            'deleted_at',
            'attendance_type',
            'attendance',
            'school',
            "role"
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
            'first_name': obj.staff.first_name,
            'last_name': obj.staff.last_name,
        }
        if data:
            return data
        return None

    def get_attendance(self, obj):
        attendance_records = AttendanceRecord.objects.filter(
            class_id=obj.class_id,
            subject=obj.subject,
            staff=obj.staff,
            deleted_at=None,
            role=obj.role
        )

        attendance_data = []
        for record in attendance_records:
            attendee_data = {
                'attendee_id': record.attendee.id,
                'first_name': record.attendee.first_name,
                'last_name': record.attendee.last_name,
                'present': record.present,
                'remark': record.remark,
                'attendance_id': record.id,
                "role":record.role
            }
            attendance_data.append(attendee_data)

        attendance = {
            'date': obj.date,
            'attendees': attendance_data,
        }
        return [attendance]


class MultipleAttendanceRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceRecord
        fields =  "__all__"