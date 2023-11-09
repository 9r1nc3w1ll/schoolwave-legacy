from rest_framework import serializers
from .models import Question, QuestionOption, Exam, Answer



class BatchUploadSerializer(serializers.Serializer):
    school_id = serializers.UUIDField()
    csv = serializers.FileField()

class QuestionSerializer(serializers.ModelSerializer):
    subject_info = serializers.SerializerMethodField()
    class Meta:
        model = Question
        fields = '__all__'
    
    def get_subject_info(self, obj):
        data =  {
                'id': obj.subject.id,
                'name': obj.subject.name
            }
        if data:
            return data
        return None




class QuestionOptionSerializer(serializers.ModelSerializer):
    question_info = serializers.SerializerMethodField()
    class Meta:
        model = QuestionOption
        fields = '__all__'

    def get_question_info(self, obj):
        data =  {
                'id': obj.question.id,
                'title': obj.question.title,
            }
        if data:
            return data
        return None


class BatchQuestionSerializer(serializers.ModelSerializer):
    options = QuestionOptionSerializer(many=True)

    class Meta:
        model = Question
        fields = '__all__'



class ExamSerializer(serializers.ModelSerializer):
    class_info = serializers.SerializerMethodField()
    subject_info = serializers.SerializerMethodField()
    class Meta:
        model = Exam
        fields = '__all__'
    
    def get_class_info(self, obj):
        data =  {
                'id': obj.class_name.id,
                'name': obj.class_name.name,
            }
        if data:
            return data
        return None
    
    def get_subject_info(self, obj):
        data =  {
                'id': obj.subject.id,
                'name': obj.subject.name,
            }
        if data:
            return data
        return None


class AnswerSerializer(serializers.ModelSerializer):
    question_info = serializers.SerializerMethodField()
    answer_opt_info = serializers.SerializerMethodField()
    class Meta:
        model = Answer
        fields = '__all__'

    def get_question_info(self, obj):
        data =  {
                'id': obj.question.id,
                'title': obj.question.title,
            }
        if data:
            return data
        return None
    
    def get_answer_opt_info(self, obj):
        data =  {
                'id': obj.answer_option.id,
                'value': obj.answer_option.value,
                'right_option': obj.answer_option.right_option,
            }
        if data:
            return data
        return None