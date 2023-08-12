from django.core.management.base import BaseCommand
from faker import Faker
import random
from datetime import date

from requests import delete
from account.models import User
from admission.models import AdmissionRequest, StudentInformation
from staff.models import StaffRole
from utils.factory import UserFactory, SchoolFactory, InvoiceFactory, TransactionFactory, DiscountFactory, FeeItemFactory, FeeTemplateFactory, \
    SessionFactory, TermFactory, ClassFactory, ClassMemberFactory, StaffRoleFactory, StaffFactory,\
        SubjectStaffAssignmentFactory, StudentInformationFactory, AdmissionRequestFactory, \
        AttendanceRecordFactory, QuestionFactory, QuestionOptionFactory, ExamFactory, AnswerFactory, \
        GradeFactory, GradingSchemeFactory, ResultFactory, LessonNoteFactory, FileFactory, SubjectFactory

fake = Faker()


class Command(BaseCommand):
    help = "Seed the database with sample data using factories."

    def handle(self, *args, **kwargs):
        
        if input("This command will delete all data. Do you want to continue? (Y/N): ").lower() != "y":
            self.stdout.write(self.style.WARNING("Database seeding aborted."))
            return
        
        User.objects.all().delete()
        StaffRole.objects.all().delete()
        AdmissionRequest.objects.all().delete()
        StudentInformation.objects.all().delete()

        num_records_per_factory = 5
        num_schools = 2

        self.stdout.write("Seeding the database with sample data...")

        superuser = User.objects.create_user(username="admin", email="admin@localhost", password="admin", role="super_admin")

        self.stdout.write(self.style.SUCCESS("Created admin user with username: admin & password: admin"))



        for _ in range(num_schools):
            owner = UserFactory.create()
            school = SchoolFactory.create(owner=owner)
            teacher = UserFactory.create(role="teacher")
            role = StaffRoleFactory.create()
            staff = StaffFactory.create(user=teacher)

            for _ in range(num_records_per_factory):
                owner = UserFactory.create()
                school = SchoolFactory.create(owner=owner)
                teacher = UserFactory.create(role="teacher")
                role = StaffRoleFactory.create()
                staff = StaffFactory.create(user=teacher)

                for _ in range(random.randint(3, 6)):
                    student = UserFactory.create(role="student")
                    class_instance = ClassFactory.create(school=school)
                    session_instance = SessionFactory.create(school=school)
                    term_instance = TermFactory.create(school=school, session=session_instance)
                    subject = SubjectFactory.create(class_id=class_instance, term=term_instance,school=school)
                    discount = DiscountFactory.create(school=school)
                    fee_item = FeeItemFactory.create(discount=discount, school=school)
                    template = FeeTemplateFactory.create(discount=discount, school=school, class_id=class_instance)
                    invoice = InvoiceFactory.create(template=template, school=school, student=owner)
                    transaction = TransactionFactory.create(school=school)
                    class_member = ClassMemberFactory.create(user=owner, class_id=class_instance, school=school)
                    subject_staff_assignment = SubjectStaffAssignmentFactory.create(staff=staff, role=role, subject=subject, school=school)
                    student_info = StudentInformationFactory.create()
                    ad_request = AdmissionRequestFactory.create(school=school, student_info=student_info)
                    at_record = AttendanceRecordFactory.create(student=student, class_id=class_instance, subject=subject, staff=teacher, school=school)
                    question = QuestionFactory.create(subject=subject, school=school)
                    q_option = QuestionOptionFactory.create(question=question, school=school)
                    exam = ExamFactory.create(class_name=class_instance, subject=subject, school=school)
                    answer = AnswerFactory.create(question=question, answer_option=q_option, school=school)
                    grade = GradeFactory.create(student=student, subject=subject, term=term_instance, school=school)
                    g_scheme = GradingSchemeFactory.create(school=school)
                    result = ResultFactory.create(student=student, term=term_instance, subject=subject, school=school)
                    l_note = LessonNoteFactory.create(class_id=class_instance, created_by=teacher, last_updated_by=teacher, school=school)
                    file = FileFactory.create(created_by=owner)

        self.stdout.write(self.style.SUCCESS("Database seeding complete!"))
