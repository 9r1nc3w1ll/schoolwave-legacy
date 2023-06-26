from rest_framework import serializers

from school.models import Class, School, ClassUser


class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = "__all__"


class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = "__all__"

class ClassUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassUser
        fields = "__all__"
