from rest_framework import serializers
from .models import AdmissionRequest, StudentInformation
from school.models import School

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
        school = School.objects.get(owner=request.user)

        req = AdmissionRequest.objects.create(student_info=student_info, school=school)

        return student_info


class AdmissionRequestSerializer(serializers.ModelSerializer):
    student_info = StudentNameSerializer()

    class Meta:
        model = AdmissionRequest
        fields = "__all__"

    def update(self, instance, validated_data):
        status = validated_data.get("status", "")

        if status == "approved" and instance.status == "approved":
            raise serializers.ValidationError("Request already approved.")
        return super().update(instance, validated_data)
