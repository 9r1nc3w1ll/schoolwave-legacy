from rest_framework import serializers

from school.models import Class, School, ClassMember
from account.models import User
from admission.models import AdmissionRequest
from staff.models import Staff
from fees.models import Invoice
from session.models import Session

from partial_date import PartialDateField as CustomPartialDateField

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
    
class AdminDashboardSerializer:
    
    @staticmethod
    def get_dashboard_data(school_id):
        try:
            school = School.objects.get(id=school_id)
        except School.DoesNotExist:
            raise serializers.ValidationError("School does not exist.")
        school=school.id
        # Calculate your statistics here
        male_student = AdmissionRequest.objects.filter(school=school, student_info__gender='male').count()
        female_student = AdmissionRequest.objects.filter(school=school, student_info__gender='female').count()
        total_student = AdmissionRequest.objects.filter(school=school).count()
        total_approved_student = AdmissionRequest.objects.filter(school=school, status="approved").count()
        total_pending_student = AdmissionRequest.objects.filter(school=school, status="pending").count()
        total_denied_student = AdmissionRequest.objects.filter(school=school, status="denied").count()
        male_staff = Staff.objects.filter(user__school=school, user__gender='male').count()
        female_staff = Staff.objects.filter(user__school=school, user__gender='female').count()
        total_staff = Staff.objects.filter(user__school=school).count()

        # Retrieve invoices and calculate total and outstanding amounts
        invoices = Invoice.objects.filter(school=school)
        total_paid = sum(invoice.amount_paid for invoice in invoices)
        total_outstanding = sum(invoice.outstanding_balance for invoice in invoices)
        total_amount = total_paid + total_outstanding
        
        # Calculate percentages
        paid_percentage = (total_paid / total_amount) * 100 if total_amount > 0 else 0
        outstanding_percentage = (total_outstanding / total_amount) * 100 if total_amount > 0 else 0

        session = Session.objects.filter(school=school, active=True).first()

        data = {
            'total_student': total_student,
            'male_student_count': male_student,
            'female_student_count': female_student,
            'total_approved_student': total_approved_student,
            'total_pending_student': total_pending_student,
            'total_denied_student': total_denied_student,
            'male_staff_count': male_staff,
            'female_staff_count': female_staff,
            'total_staff': total_staff,
            'total_paid': total_paid,
            'total_outstanding': total_outstanding,
            'total_amount': total_amount,
            'paid_percentage': paid_percentage,
            'outstanding_percentage': outstanding_percentage,
            'session': session.name,
            'session_start_date': str(session.start_date),
            'session_end_date': str(session.end_date),
            'session_resumption_date': session.resumption_date,
        }
        return data

class SchoolSettingsSerializer(serializers.ModelSerializer):

    class Meta:
        model = School
        fields = ("id", "settings")

class SchoolLogoSerializer(serializers.ModelSerializer):
    logo = serializers.SerializerMethodField()

    class Meta:
        model = School
        fields = ("id", "logo")

    def get_logo(self, obj):
        return obj.settings.get("logo", {})

class SchoolBrandSerializer(serializers.ModelSerializer):
    brand = serializers.SerializerMethodField()

    class Meta:
        model = School
        fields = ("id", "brand")

    def get_brand(self, obj):
        return obj.settings.get("brand", {})
    
class SchoolListSerializer(serializers.ModelSerializer):
    

    class Meta:
        model = School
        fields = "__all__"