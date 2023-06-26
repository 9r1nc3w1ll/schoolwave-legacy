from rest_framework import serializers
from .models import Subject, SubjectSelection, SubjectStaffAssignment

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'

class SubjectSelectionSerializer(serializers.ModelSerializer):
    subject = serializers.PrimaryKeyRelatedField(queryset=Subject.objects.all())
    subject_name = serializers.StringRelatedField(source='subject')
    class Meta:
        model = SubjectSelection
        fields = '__all__'

class SubjectStaffAssignmentSerializer(serializers.ModelSerializer):
    subject_name = serializers.StringRelatedField()
    class Meta:
        model = SubjectStaffAssignment
        fields = '__all__'