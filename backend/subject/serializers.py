from rest_framework import serializers
from .models import Subject, SubjectSelection, SubjectStaffAssignment

class SubjectSerializer(serializers.ModelSerializer):
    class_id = serializers.SerializerMethodField()
    term = serializers.SerializerMethodField()
    class Meta:
        model = Subject
        fields = '__all__'

    def get_class_id(self, obj):
        data =  {
                'id': obj.class_id.id,
                'name': obj.class_id.name,
                'description': obj.class_id.description,
                'class_index': obj.class_id.class_index,
                'code': obj.class_id.code,
            }
        if data:
            return data
        return None
    
    def get_term(self, obj):
        data =  {
                'id': obj.term.id,
                'name': obj.term.name,
                'active': obj.term.active,
                'code': obj.term.code,
            }
        if data:
            return data
        return None

class SubjectSelectionSerializer(serializers.ModelSerializer):
    subject = serializers.PrimaryKeyRelatedField(queryset=Subject.objects.all())
    subject_name = serializers.SerializerMethodField()
    class Meta:
        model = SubjectSelection
        fields = '__all__'

    def get_subject_name(self, obj):
        return obj.subject.name

class SubjectStaffAssignmentSerializer(serializers.ModelSerializer):
    subject_name = serializers.StringRelatedField()
    class Meta:
        model = SubjectStaffAssignment
        fields = '__all__'