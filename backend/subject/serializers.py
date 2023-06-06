from rest_framework import serializers
from .models import Subject, SubjectSelection

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'

class SubjectSelectionSerializer(serializers.ModelSerializer):
    subject = serializers.StringRelatedField()
    class Meta:
        model = SubjectSelection
        fields = '__all__'
