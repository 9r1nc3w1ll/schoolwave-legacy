from rest_framework import serializers
from .models import LessonNote, LessonNoteFile


class LessonNoteSerializer(serializers.ModelSerializer):
    class_info = serializers.SerializerMethodField()

    class Meta:
        model = LessonNote
        fields = '__all__'
        extra_kwargs={'files' : {'read_only' : True}}
    
    def validate(self, attrs):
        files = attrs.pop("files", None)

        return super().validate(attrs)


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


class LessonNoteFileSerializer(serializers.Serializer):
    note_id = serializers.UUIDField()
