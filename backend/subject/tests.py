from datetime import datetime

from django.contrib.auth import get_user_model
from rest_framework.reverse import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from .models import Subject, SubjectSelection

from school.models import Class, School
from session.models import Session, Term

User = get_user_model()

class SubjectCRUDTestCase(APITestCase):
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
            name="Test Class", school=self.school, description="Description"
        )

        self.session = Session.objects.create(
            school=self.school,
            resumption_date=datetime.now().date(),
            start_date="2040",
            end_date="2050"
        )

        self.term = Term.objects.create(
            name="1st Term", active="True", school=self.school, session=self.session
        )

        self.subject = Subject.objects.create(
            name="Math",
            description="Mathematics subject",
            term=self.term,
            class_id=self.class_obj
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.user.tokens['access']}")

    def test_list_subjects(self):
        url = reverse("subject_list_create")
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            len(response.data["data"]), 1
        )

    def test_create_subject(self):
        url = reverse("subject_list_create")
        self.client.force_authenticate(user=self.user)

        data = {
            "name": "Science",
            "description": "Science subject",
            "term":self.term
        }

        response = self.client.post(url, data)

    def test_retrieve_subject(self):
        url = reverse("subject_retrieve_update_destroy", kwargs={"pk":self.subject.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Subject retrieved successfully.")

    def test_update_subject(self):
        url = reverse("subject_retrieve_update_destroy", kwargs={"pk": self.subject.id})
        self.client.force_authenticate(user=self.user)

        data = {
            "name": "Updated Science",
            "description": "Updated Science subject",
            "term":self.term.id
        }

        response = self.client.patch(url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Subject updated successfully.")
        self.assertEqual(response.data["data"]["name"], "Updated Science")

    def test_delete_subject(self):
        url = reverse("subject_retrieve_update_destroy", kwargs={"pk": self.subject.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(response.data["message"], "Subject deleted successfully.")

class SubjectSelectionCRUDTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

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
            name="Test Class", school=self.school, description="Description"
        )

        self.session = Session.objects.create(
            school=self.school,
            resumption_date=datetime.now().date(),
            start_date="2040",
            end_date="2050"
        )

        self.term = Term.objects.create(
            name="1st Term", active="True", school=self.school, session=self.session
        )

        self.subject = Subject.objects.create(
            name="Math",
            description="Mathematics subject",
            term=self.term,
            class_id=self.class_obj
        )

        self.subject_selection = SubjectSelection.objects.create(
            term=self.term,
            subject=self.subject,
            score=80
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.user.tokens['access']}")

    def test_list_subject_selections(self):
        url = reverse("subject_selection_list_create")
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            len(response.data["data"]), 1
        )

    def test_create_subject_selection(self):
        url = reverse("subject_selection_list_create")
        self.client.force_authenticate(user=self.user)

        data = {
            "term":self.term,
            "subject": self.subject.id,
            "score": 90
        }

        response = self.client.post(url, data)

    def test_retrieve_subject_selection(self):
        url = reverse("subject_selection_retrieve_update_destroy", kwargs={"pk":self.subject_selection.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Subject Selection retrieved successfully.")

    def test_update_subject_selection(self):
        url = reverse("subject_selection_retrieve_update_destroy", kwargs={"pk": self.subject_selection.id})
        self.client.force_authenticate(user=self.user)

        data = {
            "term": self.term.id,
            "subject": self.subject,
            "score": 95
        }

        response = self.client.patch(url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        print(f"Here -- {response.data} ")
        self.assertEqual(response.data["message"], "Subject Selection updated successfully.")
        self.assertEqual(response.data["data"]["subject"], "Math")

    def test_delete_subject_selection(self):
        url = reverse("subject_selection_retrieve_update_destroy", kwargs={"pk": self.subject_selection.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(response.data["message"], "Subject Selection deleted successfully.")
