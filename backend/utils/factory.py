import factory
import faker
from factory.faker import Faker

from account.models import User

import uuid
from django.contrib.contenttypes.models import ContentType

from fees.models import Invoice

from datetime import time, date
import random

fk = faker.Faker()


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "account.User"
        django_get_or_create = ("username", "role")

    username = factory.Sequence(lambda n: f"owner{n}")
    role = "student"


class SchoolFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "school.School"

    name = factory.Faker("company")
    description = factory.Faker("paragraph")
    logo_file_name = factory.Faker("file_name")
    date_of_establishment = factory.Faker("date")
    motto = factory.Faker("sentence")
    owner = factory.SubFactory(UserFactory)
    tag = factory.LazyAttribute(lambda _: fk.slug()[:10])
    website_url = factory.Faker("url")


class SessionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "session.Session"

    name = factory.Faker("word")
    active = factory.Faker("boolean")
    school = factory.SubFactory(SchoolFactory)
    start_date = factory.Faker("date")
    end_date = factory.Faker("date")
    resumption_date = factory.Faker("date")


class ClassFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "school.Class"

    school = factory.SubFactory(SchoolFactory)
    name = factory.Faker("word")
    description = factory.Faker("paragraph")
    class_index = factory.Sequence(lambda n: n)
    code = factory.LazyFunction(lambda: fk.unique.random_number(digits=6, fix_len=True))

class TermFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "session.Term"

    name = factory.Faker("word")
    active = factory.Faker("boolean")
    school = factory.SubFactory(SchoolFactory)
    session = factory.SubFactory(SessionFactory)
    code = factory.LazyFunction(lambda: fk.unique.random_number(digits=6, fix_len=True))

class SubjectFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "subject.Subject"

    name = factory.Faker("word")
    description = factory.Faker("paragraph")
    class_id = factory.SubFactory(ClassFactory)
    term = factory.SubFactory(TermFactory)
    code = factory.LazyFunction(lambda: fk.unique.random_number(digits=6, fix_len=True))

class DiscountFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "fees.Discount"

    discount_type = 'percentage'
    amount = 0
    percentage = 10
    school = factory.SubFactory(SchoolFactory)


class FeeItemFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "fees.FeeItem"

    name = factory.Faker('word')
    description = factory.Faker('sentence')
    amount = 100.00
    tax = 10.00
    discount = factory.SubFactory(DiscountFactory)
    school = factory.SubFactory(SchoolFactory)


class FeeTemplateFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "fees.FeeTemplate"

    name = factory.Faker('word')
    description = factory.Faker('sentence')
    school = factory.SubFactory(SchoolFactory)
    class_id = factory.SubFactory(ClassFactory)
    tax = 5
    discount = factory.SubFactory(DiscountFactory)


class InvoiceFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "fees.Invoice"

    school = factory.SubFactory(SchoolFactory)
    template = factory.SubFactory(FeeTemplateFactory)
    amount_paid = 50.00
    student = factory.SubFactory(UserFactory)

    @factory.post_generation
    def items(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for item in extracted:
                self.items.add(item)


class TransactionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "fees.Transaction"

    content_type = factory.LazyAttribute(lambda obj: ContentType.objects.get_for_model(Invoice))
    invoice_id = factory.LazyAttribute(lambda obj: uuid.uuid4())
    reversed_transaction_id = factory.LazyAttribute(lambda obj: uuid.uuid4())
    status = 'pending'
    school = factory.SubFactory(SchoolFactory)

class ClassMemberFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "school.ClassMember"

    user = factory.SubFactory(UserFactory)
    class_id = factory.SubFactory(ClassFactory)
    role = factory.Faker('word')

class StaffRoleFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "staff.StaffRole"

    name = factory.Sequence(lambda n: f"name{n}")
    description = factory.Sequence(lambda n: f"desc{n}")

class StaffFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "staff.Staff"

    user = factory.SubFactory(UserFactory, staff=None)
    title = factory.Faker('word')
    school = factory.SubFactory(SchoolFactory)
    staff_number = factory.Faker('word')


class SubjectStaffAssignmentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "subject.SubjectStaffAssignment"

    staff = factory.SubFactory(StaffFactory)
    role = factory.SubFactory(StaffRoleFactory)
    subject = factory.SubFactory(SubjectFactory)
    active = factory.Faker('boolean')



GENDERS = [("male", "Male"), ("female", "Female")]
ADMISSION_STATUS = [("pending", "Pending"), ("approved", "Approved"), ("declined", "Declined")]

class StudentInformationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "admission.StudentInformation"

    username = factory.Sequence(lambda n: f"student{n}")
    password = "password123"
    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")
    email = factory.Faker("email")
    date_of_birth = factory.Faker("date_of_birth")
    gender = factory.Faker("random_element", elements=[choice[0] for choice in GENDERS])

    blood_group = factory.Faker("random_element", elements=["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"])
    religion = factory.Faker("random_element", elements=["Christianity", "Islam", "Hinduism", "Buddhism", "Judaism", "Sikhism", "Other"])
    phone_number = factory.Faker("phone_number", locale="th")
    city = factory.Faker("city")
    state = factory.Faker("state")
    address = factory.Faker("address")

    guardian_name = factory.Faker("name")
    relation = factory.Faker("random_element", elements=["father", "mother", "guardian"])
    guardian_occupation = factory.Faker("job")
    guardian_phone_number = factory.Faker("phone_number", locale="th")
    guardian_address = factory.Faker("address")


class AdmissionRequestFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "admission.AdmissionRequest"

    status = factory.Faker("random_element", elements=[choice[0] for choice in ADMISSION_STATUS])
    student_info = factory.SubFactory(StudentInformationFactory)
    school = factory.SubFactory(SchoolFactory) 
    comment_if_declined = factory.Faker("text")
    student_number = factory.Faker('word')

class AttendanceRecordFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "attendance.AttendanceRecord"

    date = date.today()
    attendee = factory.SubFactory(UserFactory) 
    class_id = factory.SubFactory(ClassFactory)  
    subject = factory.SubFactory(SubjectFactory) 
    start_time = factory.Faker("time", end_datetime=None)
    end_time = factory.Faker("time", end_datetime=None)
    attendance_type = factory.Faker("random_element", elements=["Daily", "Class"])
    present = factory.Faker("boolean")
    remark = factory.Faker("text")
    staff = factory.SubFactory(UserFactory)


class QuestionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "exam.Question"

    title = factory.Faker("sentence", nb_words=4)
    subject = factory.SubFactory(SubjectFactory)
    details = factory.Faker("text")
    type = factory.Faker("random_element", elements=["quiz", "free form"])


class QuestionOptionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "exam.QuestionOption"

    question = factory.SubFactory(QuestionFactory)
    value = factory.Faker("word")
    right_option = factory.Faker("boolean")


class ExamFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "exam.Exam"

    name = factory.Faker("sentence", nb_words=3)
    description = factory.Faker("paragraph", nb_sentences=2)
    class_name = factory.SubFactory(ClassFactory)
    start_date = factory.Faker("date_this_year")
    due_date = factory.Faker("date_between", start_date=start_date)
    weight = factory.Faker("pyfloat", left_digits=2, right_digits=2, positive=True)
    subject = factory.SubFactory(SubjectFactory)


class AnswerFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "exam.Answer"

    question = factory.SubFactory(QuestionFactory)
    answer_option = factory.SubFactory(QuestionOptionFactory)
    answer_value = factory.Faker("text")
    correct_answer = factory.Faker("boolean")




class GradeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "grading.Grade"

    weight = factory.Faker("pyint", min_value=1, max_value=100)
    student = factory.SubFactory(UserFactory)
    subject = factory.SubFactory(SubjectFactory)
    term = factory.SubFactory(TermFactory)
    score = factory.Faker("pyfloat", left_digits=3, right_digits=2, positive=True)


class GradingSchemeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "grading.GradingScheme"

    school = factory.SubFactory(SchoolFactory)
    scheme = {}



class ResultFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "grading.Result"

    student = factory.SubFactory(UserFactory)
    term = factory.SubFactory(TermFactory)
    total_score = factory.LazyFunction(lambda: round(random.uniform(0, 999.99), 2))
    grade = factory.Faker("word")
    subject = factory.SubFactory(SubjectFactory)


class LessonNoteFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "lessonnotes.LessonNote"

    week = factory.LazyFunction(lambda: random.randint(1, 9))
    class_id = factory.SubFactory(ClassFactory)
    topic = factory.Faker("sentence", nb_words=3)
    description = factory.Faker("text")
    tag = factory.Faker("word")
    content = factory.Faker("text")
    created_by = factory.SubFactory(UserFactory)
    last_updated_by = factory.SubFactory(UserFactory)


class FileFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "lessonnotes.File"

    host = factory.Faker("domain_name")
    file_path = factory.Faker("file_path", depth=2)
    created_by = factory.SubFactory(UserFactory)
