from rest_framework import serializers
from .models import LessonNote

class LessonNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonNote
        fields = '__all__'