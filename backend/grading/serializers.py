from rest_framework import serializers
from .models import Grade, Result, GradingScheme


class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = "__all__"


class ResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = "__all__"



class GradingSchemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GradingScheme
        fields = '__all__'
