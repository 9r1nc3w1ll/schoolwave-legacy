from datetime import datetime

from django.contrib.auth import get_user_model
from rest_framework.reverse import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from .models import Subject, SubjectSelection, SubjectStaffAssignment

from school.models import Class, School
from session.models import Session, Term
from staff.models import Staff, StaffRole

User = get_user_model()

# class SubjectCRUDTestCase(APITestCase):
#     def setUp(self):
#         self.client = APIClient()
        
#         self.user = User.objects.create(
#             username="testowner", password="testpassword"
#         )

#         self.school = School.objects.create(
#             name="chrisland",
#             owner=self.user,
#             date_of_establishment=datetime.now().date(),
#         )

#         self.class_obj = Class.objects.create(
#             name="Test Class", school=self.school, description="Description", code="Prim43"
#         )

#         self.session = Session.objects.create(
#             school=self.school,
#             resumption_date=datetime.now().date(),
#             start_date="2040",
#             end_date="2050"
#         )

#         self.term = Term.objects.create(
#             name="1st Term", active="True", school=self.school, session=self.session, code="Term45"
#         )

#         self.subject = Subject.objects.create(
#             name="Math",
#             description="Mathematics subject",
#             term=self.term,
#             class_id=self.class_obj,
#             code="Subj98"
#         )
#         self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.user.tokens['access']}")

#     def test_list_subjects(self):
#         url = reverse("subject_list_create")
#         self.client.force_authenticate(user=self.user)
#         response = self.client.get(url)

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(
#             len(response.data["data"]), 1
#         )

#     def test_create_subject(self):
#         url = reverse("subject_list_create")
#         self.client.force_authenticate(user=self.user)

#         data = {
#             "name": "Science",
#             "description": "Science subject",
#             "term":self.term,
#             "code":"Subj65"
#         }

#         response = self.client.post(url, data)

#     def test_retrieve_subject(self):
#         url = reverse("subject_retrieve_update_destroy", kwargs={"pk":self.subject.id})
#         self.client.force_authenticate(user=self.user)
#         response = self.client.get(url)

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(response.data["message"], "Subject retrieved successfully.")

#     def test_update_subject(self):
#         url = reverse("subject_retrieve_update_destroy", kwargs={"pk": self.subject.id})
#         self.client.force_authenticate(user=self.user)

#         data = {
#             "name": "Updated Science",
#             "description": "Updated Science subject",
#             "term":self.term.id,
#             "code":"Subj111"
#         }

#         response = self.client.patch(url, data)

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(response.data["message"], "Subject updated successfully.")
#         self.assertEqual(response.data["data"]["name"], "Updated Science")

#     def test_delete_subject(self):
#         url = reverse("subject_retrieve_update_destroy", kwargs={"pk": self.subject.id})
#         self.client.force_authenticate(user=self.user)
#         response = self.client.delete(url)

#         self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
#         self.assertEqual(response.data["message"], "Subject deleted successfully.")

# class SubjectSelectionCRUDTestCase(APITestCase):
#     def setUp(self):
#         self.client = APIClient()

#         self.client = APIClient()
        
#         self.user = User.objects.create(
#             username="testowner", password="testpassword"
#         )

#         self.school = School.objects.create(
#             name="chrisland",
#             owner=self.user,
#             date_of_establishment=datetime.now().date(),
#         )

#         self.class_obj = Class.objects.create(
#             name="Test Class", school=self.school, description="Description", code="Class321"
#         )

#         self.session = Session.objects.create(
#             school=self.school,
#             resumption_date=datetime.now().date(),
#             start_date="2040",
#             end_date="2050"
#         )

#         self.term = Term.objects.create(
#             name="1st Term", active="True", school=self.school, session=self.session, code="Term122"
#         )

#         self.subject = Subject.objects.create(
#             name="Math",
#             description="Mathematics subject",
#             term=self.term,
#             class_id=self.class_obj,
#             code="Subj231"
#         )

#         self.subject_selection = SubjectSelection.objects.create(
#             term=self.term,
#             subject=self.subject,
#             score=80
#         )
#         self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.user.tokens['access']}")

#     def test_list_subject_selections(self):
#         url = reverse("subject_selection_list_create")
#         self.client.force_authenticate(user=self.user)
#         response = self.client.get(url)

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(
#             len(response.data["data"]), 1
#         )

#     def test_create_subject_selection(self):
#         url = reverse("subject_selection_list_create")
#         self.client.force_authenticate(user=self.user)

#         data = {
#             "term":self.term,
#             "subject": self.subject.id,
#             "score": 90
#         }

#         response = self.client.post(url, data)

#     def test_retrieve_subject_selection(self):
#         url = reverse("subject_selection_retrieve_update_destroy", kwargs={"pk":self.subject_selection.id})
#         self.client.force_authenticate(user=self.user)
#         response = self.client.get(url)

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(response.data["message"], "Subject Selection retrieved successfully.")

#     def test_update_subject_selection(self):
#         url = reverse("subject_selection_retrieve_update_destroy", kwargs={"pk": self.subject_selection.id})
#         self.client.force_authenticate(user=self.user)

#         data = {
#             "term": self.term.id,
#             "subject": self.subject,
#             "score": 95
#         }

#         response = self.client.patch(url, data)

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         print(f"Here -- {response.data} ")
#         self.assertEqual(response.data["message"], "Subject Selection updated successfully.")
#         self.assertEqual(response.data["data"]["subject"], "Math")

#     def test_delete_subject_selection(self):
#         url = reverse("subject_selection_retrieve_update_destroy", kwargs={"pk": self.subject_selection.id})
#         self.client.force_authenticate(user=self.user)
#         response = self.client.delete(url)

#         self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
#         self.assertEqual(response.data["message"], "Subject Selection deleted successfully.")

class SubjectStaffAssignmentCRUDTestCase(APITestCase):
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
            name="Test Class", school=self.school, description="Description", code="Class321"
        )

        self.session = Session.objects.create(
            school=self.school,
            resumption_date=datetime.now().date(),
            start_date="2040",
            end_date="2050"
        )

        self.term = Term.objects.create(
            name="1st Term", active="True", school=self.school, session=self.session, code="Term122"
        )

        self.subject = Subject.objects.create(
            name="Math",
            description="Mathematics subject",
            term=self.term,
            class_id=self.class_obj,
            code="Subj231"
        )

        self.subject_selection = SubjectSelection.objects.create(
            term=self.term,
            subject=self.subject,
            score=80
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.user.tokens['access']}")

        self.staff_user = User.objects.create(
            username="staffuser", password="staffpassword", role="staff"
        )

        self.staff_role = StaffRole.objects.create(
            name = "Class Teacher",
            description = "Primary 4 class teacher"
        )

        self.staff_role_1 = StaffRole.objects.create(
            name = "Nursery Teacher",
            description = "Nursery 2 class teacher"
        )

        self.staff = Staff.objects.create(
            user=self.staff_user,
            title="Staff Title",
        )

        role = StaffRole.objects.get(name="Class Teacher")
        self.staff.role.set([role])

        self.subject_staff_assignment = SubjectStaffAssignment.objects.create(
            staff=self.staff,
            role=self.staff_role,
            subject=self.subject,
            active="True"
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.user.tokens['access']}")


    def test_list_subject_staff_assignment(self):
        url = reverse("subject_staff_assignment_list_create")
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            len(response.data["data"]), 1
        )

    def test_create_subject_staff_assignment(self):
        url = reverse("subject_staff_assignment_list_create")
        self.client.force_authenticate(user=self.user)

        data = {
            "staff":self.staff,
            "role": self.staff_role,
            "subject":self.subject.id,
            "active":"True"
        }

        response = self.client.post(url, data)

    def test_retrieve_subject_selection(self):
        url = reverse("subject_staff_assignment_retrieve_update_destroy", kwargs={"pk":self.subject_staff_assignment.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Subject staff assignment retrieved successfully.")

    def test_update_subject_selection(self):
        url = reverse("subject_staff_assignment_retrieve_update_destroy", kwargs={"pk": self.subject_staff_assignment.id})
        self.client.force_authenticate(user=self.user)

        data = {
            "staff":self.staff.id,
            "role": self.staff_role.id,
            "subject":self.subject,
            "active":"False"
        }

        response = self.client.patch(url, data)
        self.assertEqual(response.data["message"], "Subject staff assignment updated successfully.")
        self.assertEqual(response.data["data"]["active"], False)

    def test_delete_subject_selection(self):
        url = reverse("subject_staff_assignment_retrieve_update_destroy", kwargs={"pk": self.subject_staff_assignment.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(response.data["message"], "Subject staff assignment deleted successfully.")
