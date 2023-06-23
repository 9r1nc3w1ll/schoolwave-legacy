from rest_framework import serializers
from .models import AdmissionRequest, StudentInformation



class StudentNameSerializer(serializers.ModelSerializer):

    class Meta:
        model = StudentInformation
        fields = ("id", "name")

class StudentInformationSerializer(serializers.ModelSerializer):

    class Meta:
        model = StudentInformation
        fields = "__all__"

class AdmissionRequestSerializer(serializers.ModelSerializer):
    student_info = StudentNameSerializer()
    class Meta:
        model = AdmissionRequest
        fields = "__all__"
