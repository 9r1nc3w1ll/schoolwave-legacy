from rest_framework import serializers
from .models import AdmissionRequest, StudentInformation



class StudentInformationSerializer(serializers.ModelSerializer):

    class Meta:
        model = StudentInformation
        fields = "__all__"

class AdmissionRequestSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = AdmissionRequest
        fields = "__all__"
