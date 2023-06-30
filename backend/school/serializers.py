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
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()

    class Meta:
        model = ClassMember
        fields = ('user', 'first_name', 'last_name', 'class_id', 'role')

    def get_first_name(self, obj):
        return obj.user.first_name

    def get_last_name(self, obj):
        return obj.user.last_name

