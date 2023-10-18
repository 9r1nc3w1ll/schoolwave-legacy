from datetime import datetime

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from school.models import Class, School
from session.models import Session, Term
from lessonnotes.models import LessonNote

User = get_user_model()

class LessonNoteAPITestCase(APITestCase):
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

        self.session = Session.objects.create(
            school=self.school,
            resumption_date=datetime.now().date(),
            start_date="2040-11-18",
            end_date="2050-11-18"
        )

        self.term = Term.objects.create(
            name="1st Term",
            active="True",
            school=self.school,
            session=self.session,
            code="Term45",
            start_date="2023-10-01",
            end_date="2023-12-01"
        )

        self.class_obj = Class.objects.create(
            name="Test Class", school=self.school, description="Description", code="Prim43"
        )

        self.lesson_note = LessonNote.objects.create(
            week="1", class_id=self.class_obj, content="This is a content", created_by=self.user, last_updated_by=self.user, school=self.school
        )

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.user.tokens['access']}")

    def test_list_lesson_note(self):
        url = reverse("lesson_note_list_create")
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            len(response.data["data"]), 1
        )

    def test_create_lesson_note(self):
        url = reverse("lesson_note_list_create")
        self.client.force_authenticate(user=self.user)
        data = {
            "week": 1,
            "class_id":self.class_obj.id,
            "term" : self.term.id,
            "content":"This is another content",
            "created_by":self.user.id,
            "last_updated_by":self.user.id,
            "topic": "Hello",
            "description": "Hello",
            "tag": "Hello",
            "school":self.school.id
        }

        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"], "Lesson Note created successfully.")

    def test_retrieve_lesson_note(self):
        url = reverse("lesson_note_retrieve_update_destroy", kwargs={"pk": self.lesson_note.id})

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Lesson Note retrieved successfully.")

    def test_update_lesson_note(self):
        url = reverse("lesson_note_retrieve_update_destroy", kwargs={"pk": self.lesson_note.id})
        data = {
            "content":"Updated content",
        }

        response = self.client.patch(url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Lesson Note updated successfully.")
        
    

    def test_delete_lesson_note(self):
        url = reverse("lesson_note_retrieve_update_destroy", kwargs={"pk": self.lesson_note.id})

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)