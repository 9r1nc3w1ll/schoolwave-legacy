from rest_framework import serializers
from .models import SchoolSettings, SchoolLogo, SchoolBrand


class SchoolSettingsSerializer(serializers.ModelSerializer):

    class Meta:
        model = SchoolSettings
        fields = "__all__"


class SchoolLogoSerializer(serializers.ModelSerializer):

    class Meta:
        model = SchoolLogo
        fields = "__all__"

class SchoolBrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolBrand
        fields = "__all__"