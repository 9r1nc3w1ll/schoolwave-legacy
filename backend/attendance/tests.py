from datetime import datetime

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from attendance.models import AttendanceRecord

from school.models import Class, School
from subject.models import Subject
from session.models import Term, Session
from staff.models import Staff, StaffRole
from admission.models import AdmissionRequest

User = get_user_model()

class AttendanceRecordAPITestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = User.objects.create(
            username="testowner", password="testpassword", role="staff"
        )

        self.student_obj = User.objects.create(
            username="teststudent", password="testpassword", role="student"
        )

        self.student_obj_2 = User.objects.create(
            username="teststudent2", password="testpassword", role="student"
        )

        self.staff_role = StaffRole.objects.create(
            name="Teacher", description="Test Desc"
        )

        self.staff_obj = User.objects.create(
            username="teststaff", password="testpassword", role="admin"
        )
    
        self.school = School.objects.create(
            name="chrisland",
            owner=self.user,
            date_of_establishment=datetime.now().date(),
        )

        self.class_obj = Class.objects.create(
            name="Test Class",
            school=self.school,
            description="Description",
            class_index=1,
            code="class12"
        )

        self.session = Session.objects.create(
            school=self.school,
            resumption_date=datetime.now().date(),
            start_date="2040",
            end_date="2050"
        )

        self.term = Term.objects.create(
            name='Test', active=True, school=self.school, session=self.session, code="TEST"
        )

        self.subject = Subject.objects.create(
            name="Test Subject", description="Teste", class_id=self.class_obj, term=self.term,
            code='TEST', school=self.school,
        )

        self.attendance = AttendanceRecord.objects.create(
            date="2023-05-30",
            student=self.student_obj,
            class_id=self.class_obj,
            start_time="09:00:00",
            end_time="10:00:00",
            attendance_type="Daily",
            present=True,
            remark="Good",
            staff=self.staff_obj,
            school=self.school,
        )

        self.client.force_authenticate(user=self.user)
        
    
    def test_list_attendance(self):
        url = reverse("student_attendance_list_create")
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            len(response.data["data"]), 1
        )

    def test_create_student_attendance(self):
        url = reverse("student_attendance_list_create")
        self.client.force_authenticate(user=self.user)

        data = {
            "class_info": {
                "class_id": str(self.class_obj.id),
                'name': str(self.class_obj.name),
                'description': str(self.class_obj.description),
                'class_index': str(self.class_obj.class_index),
                'code': str(self.class_obj.code),
            },
            "staff_info": {
                "staff_id": str(self.staff_obj.id),
                'first_name': str(self.staff_obj.first_name),
            },
            'attendance_type': "Class",
            "attendance": [
                {
                    "student_id": str(self.student_obj.id),
                    "date": "2023-05-30",
                    "present": True,
                    "remark": "Poor"
                }
            ],
            "school":self.school.id
        }

        response = self.client.post(url, data, format='json')        

    def test_update_student_attendance(self):
        url = reverse("student_attendance_update_destroy", kwargs={
            "pk": self.attendance.id,
            })
        self.client.force_authenticate(user=self.user)

        data = {"start_time": "10:00:00", "end_time": "11:00:00"}

        response = self.client.patch(url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
    

    def test_retrieve_student_class_attendance(self):
        url = reverse("student_attendance_retrieve", kwargs={
            "pk": self.attendance.id,
            "startdate" : "2023-01-01",
            "enddate" : "2023-02-01"
            })
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)


        self.assertEqual(response.status_code, status.HTTP_200_OK)