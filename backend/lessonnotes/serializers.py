from rest_framework import serializers
from .models import LessonNote

class LessonNoteSerializer(serializers.ModelSerializer):
    class_info = serializers.SerializerMethodField()

    class Meta:
        model = LessonNote
        fields = '__all__'

    def get_class_info(self, obj):
        data = {
            'id': obj.class_id.id,
            'name': obj.class_id.name,
            'class_index': obj.class_id.class_index,
            'code': obj.class_id.code,
        }
        if data:
            return data
        return None
