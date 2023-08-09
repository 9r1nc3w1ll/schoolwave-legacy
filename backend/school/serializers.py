from rest_framework import serializers

from school.models import Class, School, ClassMember
from account.models import User


class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = "__all__"


class ClassSerializer(serializers.ModelSerializer):
    student_count = serializers.SerializerMethodField()
    class_teacher = serializers.SerializerMethodField()

    class Meta:
        model = Class
        fields = ('id', 'name', 'description', 'class_index', 'code', 'school', 'student_count', 'class_teacher')
    
    def get_student_count(self, obj):
        return obj.classmember_set.filter(user__role="student").count()


    def get_class_teacher(self, obj):
        class_teacher = obj.classmember_set.filter(role="Class Teacher").first()
        if class_teacher:
            return {
                'id': class_teacher.user.id,
                'name': class_teacher.user.get_full_name(),
                # Include other relevant details of the class teacher
            }
        return None




class ClassMemberSerializer(serializers.ModelSerializer):
    class_info = serializers.SerializerMethodField()
    student_info = serializers.SerializerMethodField()

    class Meta:
        model = ClassMember
        fields = ('user', 'role', 'class_id', 'class_info', 'student_info', 'school')

    def get_class_info(self, obj):
        data = {
            'id': obj.class_id.id,
            'name': obj.class_id.name,
            'description': obj.class_id.description,
            'class_index': obj.class_id.class_index,
            'code': obj.class_id.code,
        }
        if data:
            return data
        return None
    
    def get_student_info(self, obj):
        data = {
            'id': obj.user.id,
            'first_name': obj.user.first_name,
            'last_name': obj.user.last_name,
        }
        if data:
            return data
        return None