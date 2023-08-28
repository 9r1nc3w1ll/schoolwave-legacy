from rest_framework import serializers
from .models import AdmissionRequest, StudentInformation
from school.models import School
from school_settings.models import SchoolSettings

from django.contrib.auth import get_user_model

User = get_user_model()


class StudentNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentInformation
        fields = ("id", "first_name", "last_name")


class StudentInformationSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentInformation
        fields = "__all__"

    # def validate_username(self, username):
    #     if User.objects.filter(username=username).exists():
    #         raise serializers.ValidationError(f"Student with username {username} already exists.")

    def create(self, validated_data):
        student_info = StudentInformation.objects.create(**validated_data)

        request = self.context["request"]
        school = request.data.get("school")
        school_settings = SchoolSettings.objects.get(school=school)

        prefix = school_settings.student_code_prefix
        total_students = AdmissionRequest.objects.filter(
            school=school
        ).count()
        student_number = f"{prefix}{total_students + 1:04d}"
        request.data["student_number"] = student_number
        
        school = School.objects.get(id=school)

        req = AdmissionRequest.objects.create(student_info=student_info, school=school, student_number=student_number)

        return student_info


class AdmissionRequestSerializer(serializers.ModelSerializer):
    student_info = StudentInformationSerializer(read_only=True)

    class Meta:
        model = AdmissionRequest
        fields = "__all__"

    def update(self, instance, validated_data):
        status = validated_data.get("status", "")

        if status == "approved" and instance.status == "approved":
            raise serializers.ValidationError("Request already approved.")
        return super().update(instance, validated_data)
