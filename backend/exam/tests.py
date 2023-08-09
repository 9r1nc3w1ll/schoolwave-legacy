from datetime import datetime
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from subject.models import Subject

from school.models import Class, School
from session.models import Session, Term

from .models import Question, QuestionOption, Exam, Answer

User = get_user_model()


class BatchUploadAPITest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="testpass")
        
        self.school = School.objects.create(
            name="chrisland",
            owner=self.user,
            date_of_establishment=datetime.now().date(),
        )

        self.class_obj = Class.objects.create(
            name="Test Class", school=self.school, description="Description", code="Prim"
        )

        self.session = Session.objects.create(
            school=self.school,
            resumption_date=datetime.now().date(),
            start_date="2040",
            end_date="2050"
        )

        self.term = Term.objects.create(
            name="1st Term", active="True", school=self.school, session=self.session, code="Term45"
        )

        self.subject = Subject.objects.create(
            name="Math",
            description="Mathematics subject",
            term=self.term,
            class_id=self.class_obj,
            code="MAT101",
            school=self.school
        )

    def test_batch_upload(self):
        
        url = reverse("exam_batch_upload")
        self.client.force_authenticate(user=self.user)

        subject = Subject.objects.get(id=self.subject.id)

        with open("exam/question_options.csv") as csv:
            response = self.client.post(
                path=url,
                data={"csv": csv,
                    "school_id":self.school.id},
        )
            
        print(response.data)


        self.assertEqual(response.status_code, 201)
        

class QuestionAPITestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        
        self.user = User.objects.create(
            username="testowner", password="testpassword"
        )

        self.school = School.objects.create(
            name="chrisland",
            owner=self.user,
            date_of_establishment=datetime.now().date(),
        )

        self.class_obj = Class.objects.create(
            name="Test Class", school=self.school, description="Description", code="Prim43"
        )

        self.session = Session.objects.create(
            school=self.school,
            resumption_date=datetime.now().date(),
            start_date="2040",
            end_date="2050"
        )

        self.term = Term.objects.create(
            name="1st Term", active="True", school=self.school, session=self.session, code="Term45"
        )

        self.subject = Subject.objects.create(
            name="Math",
            description="Mathematics subject",
            term=self.term,
            class_id=self.class_obj,
            code="Subj98",
            school=self.school,
        )

        self.question = Question.objects.create(
            title="Test Question",
            subject=self.subject,
            details="Question details",
            type="quiz",
            school=self.school
        )

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.user.tokens['access']}")

    def test_list_questions(self):
        url = reverse("question_list_create")
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["data"]), 1)

    def test_create_question(self):
        url = reverse("question_list_create")
        self.client.force_authenticate(user=self.user)

        data = {
            "title": "New Question",
            "subject": self.subject.id,
            "details": "Question details",
            "type": "quiz",
            "school":self.school.id
        }

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"], "Question created successfully.")

    def test_retrieve_question(self):
        url = reverse("question_retrieve_update_destroy", kwargs={"pk": self.question.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Question retrieved successfully.")

    def test_update_question(self):
        url = reverse("question_retrieve_update_destroy", kwargs={"pk": self.question.id})
        self.client.force_authenticate(user=self.user)

        data = {
            "title": "Updated Question",
            "details": "Updated details"
        }

        response = self.client.patch(url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Question updated successfully.")
        self.assertEqual(response.data["data"]["title"], "Updated Question")

    def test_delete_question(self):
        url = reverse("question_retrieve_update_destroy", kwargs={"pk": self.question.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(response.data["message"], "Question deleted successfully.")


class QuestionOptionAPITestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        
        self.user = User.objects.create(
            username="testowner", password="testpassword"
        )

        self.school = School.objects.create(
            name="chrisland",
            owner=self.user,
            date_of_establishment=datetime.now().date(),
        )

        self.class_obj = Class.objects.create(
            name="Test Class", school=self.school, description="Description", code="Prim43"
        )

        self.session = Session.objects.create(
            school=self.school,
            resumption_date=datetime.now().date(),
            start_date="2040",
            end_date="2050"
        )

        self.term = Term.objects.create(
            name="1st Term", active="True", school=self.school, session=self.session, code="Term45"
        )

        self.subject = Subject.objects.create(
            name="Math",
            description="Mathematics subject",
            term=self.term,
            class_id=self.class_obj,
            code="Subj98",
            school=self.school,
        )

        self.question = Question.objects.create(
            title="Test Question",
            subject=self.subject,
            details="Question details",
            type="quiz",
            school=self.school
        )

        self.question_option = QuestionOption.objects.create(
            question=self.question,
            value="Option A",
            right_option=True,
            school=self.school
        )

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.user.tokens['access']}")

    def test_list_question_options(self):
        url = reverse("question_option_list_create")
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["data"]), 1)

    def test_create_question_option(self):
        url = reverse("question_option_list_create")
        self.client.force_authenticate(user=self.user)

        data = {
            "question": self.question.id,
            "value": "Option B",
            "right_option": False,
            "school": self.school.id
        }

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"], "Question option created successfully.")

    def test_retrieve_question_option(self):
        url = reverse("question_option_retrieve_update_destroy", kwargs={"pk": self.question_option.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Question option retrieved successfully.")

    def test_update_question_option(self):
        url = reverse("question_option_retrieve_update_destroy", kwargs={"pk": self.question_option.id})
        self.client.force_authenticate(user=self.user)

        data = {
            "value": "Updated Option",
            "right_option": False
        }

        response = self.client.patch(url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Question option updated successfully.")
        self.assertEqual(response.data["data"]["value"], "Updated Option")

    def test_delete_question_option(self):
        url = reverse("question_option_retrieve_update_destroy", kwargs={"pk": self.question_option.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(response.data["message"], "Question option deleted successfully.")


class ExamAPITestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        
        self.user = User.objects.create(
            username="testowner", password="testpassword"
        )

        self.school = School.objects.create(
            name="chrisland",
            owner=self.user,
            date_of_establishment=datetime.now().date(),
        )

        self.class_obj = Class.objects.create(
            name="Test Class", school=self.school, description="Description", code="Prim43"
        )

        self.session = Session.objects.create(
            school=self.school,
            resumption_date=datetime.now().date(),
            start_date="2040",
            end_date="2050"
        )

        self.term = Term.objects.create(
            name="1st Term", active="True", school=self.school, session=self.session, code="Term45"
        )

        self.subject = Subject.objects.create(
            name="Math",
            description="Mathematics subject",
            term=self.term,
            class_id=self.class_obj,
            code="Subj98",
            school=self.school,
        )

        self.question = Question.objects.create(
            title="Test Question",
            subject=self.subject,
            details="Question details",
            type="quiz",
            school=self.school
        )

        self.question_option = QuestionOption.objects.create(
            question=self.question,
            value="Option A",
            right_option=True,
            school=self.school
        )

        self.exam = Exam.objects.create(
            name="Test Exam",
            description="Exam description",
            class_name=self.class_obj,
            start_date=datetime.now().date(),
            due_date=datetime.now().date(),
            weight=0.5,
            subject=self.subject,
            school=self.school
        )

        self.exam.questions.add(Question.objects.create(
            title="Question 1",
            subject=self.subject,
            details="Question 1 details",
            type="quiz",
            school=self.school
        ))

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.user.tokens['access']}")

    def test_list_exams(self):
        url = reverse("exam_list_create")
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["data"]), 1)

    def test_create_exam(self):
        url = reverse("exam_list_create")
        self.client.force_authenticate(user=self.user)

        data = {
            "name": "New Exam",
            "description": "Exam description",
            "class_name": self.class_obj.id,
            "start_date": datetime.now().date(),
            "due_date": datetime.now().date(),
            "weight": 0.5,
            "subject":self.subject.id,
            "questions":list([self.question.id]),
            "school":self.school.id
        }

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"], "Exam created successfully.")

    def test_retrieve_exam(self):
        url = reverse("exam_retrieve_update_destroy", kwargs={"pk": self.exam.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Exam retrieved successfully.")

    def test_update_exam(self):
        url = reverse("exam_retrieve_update_destroy", kwargs={"pk": self.exam.id})
        self.client.force_authenticate(user=self.user)

        data = {
            "name": "Updated Exam",
            "description": "Updated description"
        }

        response = self.client.patch(url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Exam updated successfully.")
        self.assertEqual(response.data["data"]["name"], "Updated Exam")

    def test_delete_exam(self):
        url = reverse("exam_retrieve_update_destroy", kwargs={"pk": self.exam.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(response.data["message"], "Exam deleted successfully.")

class AnswerAPITestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        
        self.user = User.objects.create(
            username="testowner", password="testpassword"
        )

        self.school = School.objects.create(
            name="chrisland",
            owner=self.user,
            date_of_establishment=datetime.now().date(),
        )

        self.class_obj = Class.objects.create(
            name="Test Class", school=self.school, description="Description", code="Prim43"
        )

        self.session = Session.objects.create(
            school=self.school,
            resumption_date=datetime.now().date(),
            start_date="2040",
            end_date="2050"
        )

        self.term = Term.objects.create(
            name="1st Term", active="True", school=self.school, session=self.session, code="Term45"
        )

        self.subject = Subject.objects.create(
            name="Math",
            description="Mathematics subject",
            term=self.term,
            class_id=self.class_obj,
            code="Subj98",
            school=self.school,
        )

        self.question = Question.objects.create(
            title="Test Question",
            subject=self.subject,
            details="Question details",
            type="quiz",
            school=self.school
        )

        self.question_option = QuestionOption.objects.create(
            question=self.question,
            value="Option A",
            right_option=True,
            school=self.school
        )

        self.exam = Exam.objects.create(
            name="Test Exam",
            description="Exam description",
            class_name=self.class_obj,
            start_date=datetime.now().date(),
            due_date=datetime.now().date(),
            weight=0.5,
            subject=self.subject,
            school=self.school
        )

        self.exam.questions.add(Question.objects.create(
            title="Question 1",
            subject=self.subject,
            details="Question 1 details",
            type="quiz",
            school=self.school
        ))

        self.answer = Answer.objects.create(
            question=self.question,
            answer_option=self.question_option,
            answer_value="Ade is a Boy",
            correct_answer=True,
            school=self.school
        )

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.user.tokens['access']}")

    def test_list_answers(self):
        url = reverse("answer_list_create")
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["data"]), 1)

    def test_create_answer(self):
        url = reverse("answer_list_create")
        self.client.force_authenticate(user=self.user)

        data = {
            "question": self.question.id,
            "answer_option":self.question_option.id,
            "answer_value":"Simbi is a Boy",
            "correct_answer":False,
            "school":self.school.id
        }

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"], "Answer created successfully.")

    def test_retrieve_answer(self):
        url = reverse("answer_retrieve_update_destroy", kwargs={"pk": self.answer.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Answer retrieved successfully.")

    def test_update_answer(self):
        url = reverse("answer_retrieve_update_destroy", kwargs={"pk": self.answer.id})
        self.client.force_authenticate(user=self.user)

        data = {
            "answer_value": "Updated answer"
        }

        response = self.client.patch(url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Answer updated successfully.")
        self.assertEqual(response.data["data"]["answer_value"], "Updated answer")

    def test_delete_answer(self):
        url = reverse("answer_retrieve_update_destroy", kwargs={"pk": self.answer.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(response.data["message"], "Answer deleted successfully.")