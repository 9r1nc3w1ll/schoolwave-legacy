from rest_framework import serializers
from .models import LessonNote

class LessonNoteSerializer(serializers.ModelSerializer):
    class_info = serializers.SerializerMethodField()

    class Meta:
        model = LessonNote
        fields = '__all__'
    

    def create(self, validated_data):
        files = validated_data.pop("files", "")

        note = LessonNote.objects.create(**validated_data)
        
        for file in files:
            note.files.set(file)
        
        note.save()

        return note

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
