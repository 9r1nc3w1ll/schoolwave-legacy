from datetime import datetime

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from school.models import School, Class, ClassMember
from session.models import Session
from fees.models import FeeItem, Transaction, FeeTemplate, Discount, Invoice
from django.contrib.contenttypes.models import ContentType


User = get_user_model()

class FeeItemTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = User.objects.create_user(
            username="testuser", password="testpassword", role="owner"
        )

        self.student = User.objects.create_user(
            username="teststudent", password="testpassword", role="student"
        )

        self.school = School.objects.create(
            name="chrisland",
            owner=self.user,
            date_of_establishment=datetime.now().date(),
        )

        self.class_obj = Class.objects.create(
            name="Test Class", school=self.school, description="Description", code='TEST'
        )

        self.discount = Discount.objects.create(
            discount_type="percentage", amount=10, percentage=10,
            school=self.school
        )

        self.fee_item = FeeItem.objects.create(
            name="Fee Item", description="Test Fee Item", amount=100,
            discount=self.discount, school=self.school 
        )

        self.fee_template = FeeTemplate.objects.create(
            school=self.school, class_id=self.class_obj, discount=self.discount
        )

    
    def test_create_fee_item(self):
        url = reverse("list_create_fee_item")
        data = {
            "name": "New Fee Item",
            "school": self.school.id,
            "description": "Description",
            "amount" : 100,
            "discount" : self.discount.id
        }
        self.client.force_authenticate(user=self.user)
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_fee_items(self):
        url = reverse("list_create_fee_item")
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_fee_item(self):
        url = reverse("retrieve_update_destroy_fee_item", args=[self.fee_item.id])
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_fee_item(self):
        url = reverse("retrieve_update_destroy_fee_item", args=[self.fee_item.id])
        data = {"name": "Updated Class", "school": self.school.id}
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_fee_item(self):
        url = reverse("retrieve_update_destroy_fee_item", args=[self.fee_item.id])
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class FeeTemplateTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = User.objects.create_user(
            username="testuser", password="testpassword", role="owner"
        )

        self.student = User.objects.create_user(
            username="teststudent", password="testpassword", role="student"
        )

        self.school = School.objects.create(
            name="chrisland",
            owner=self.user,
            date_of_establishment=datetime.now().date(),
        )

        self.class_obj = Class.objects.create(
            name="Test Class", school=self.school, description="Description", code='TEST'
        )

        self.discount = Discount.objects.create(
            discount_type="percentage", amount=10, percentage=10,
            school=self.school
        )

        self.fee_item = FeeItem.objects.create(
            name="Fee Item", description="Test Fee Item", amount=100,
            discount=self.discount, school=self.school 
        )

        self.fee_template = FeeTemplate.objects.create(
            school=self.school, class_id=self.class_obj, discount=self.discount
        )

    
    def test_create_fee_template(self):
        url = reverse("list_create_fee_template")
        data = {
            "name": "New Fee Item",
            "description": "New Fee Item Description",
            "school": self.school.id,
            "class_id" : self.class_obj.id,
            "required_items" : [self.fee_item.id,],
            "optional_items" : [self.fee_item.id,],
            "discount" : self.discount.id,
            "active": "True",
            "tax": 23
        }
        self.client.force_authenticate(user=self.user)
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_fee_templates(self):
        url = reverse("list_create_fee_template")
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_fee_template(self):
        url = reverse("retrieve_update_destroy_fee_template", args=[self.fee_template.id])
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_fee_template(self):
        url = reverse("retrieve_update_destroy_fee_template", args=[self.fee_template.id])
        data = {"name": "Updated Fees", "school": self.school.id}

        self.client.force_authenticate(user=self.user)
        response = self.client.patch(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_fee_template(self):
        url = reverse("retrieve_update_destroy_fee_template", args=[self.fee_template.id])
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class InvoiceTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = User.objects.create_user(
            username="testuser", password="testpassword", role="owner"
        )

        self.student = User.objects.create_user(
            username="teststudent", password="testpassword", role="student"
        )

        self.student_2 = User.objects.create_user(
            username="teststudent2", password="testpassword", role="student"
        )

        self.school = School.objects.create(
            name="chrisland",
            owner=self.user,
            date_of_establishment=datetime.now().date(),
        )

        self.class_obj = Class.objects.create(
            name="Test Class", school=self.school, description="Description", code='TEST'
        )

        self.class_member_1 = ClassMember.objects.create(
            user=self.student,
            class_id=self.class_obj,
            role="student"
        )

        self.class_member_2 = ClassMember.objects.create(
            user=self.student_2,
            class_id=self.class_obj,
            role="student"
        )

        self.discount = Discount.objects.create(
            discount_type="percentage", amount=10, percentage=10,
            school=self.school
        )

        self.fee_item = FeeItem.objects.create(
            name="Fee Item", description="Test Fee Item", amount=100,
            discount=self.discount, school=self.school 
        )

        self.fee_template = FeeTemplate.objects.create(
            school=self.school, class_id=self.class_obj, discount=self.discount
        )

        self.invoice = Invoice.objects.create(
            school=self.school, template=self.fee_template, student=self.student
        )

    
    def test_create_invoice(self):
        url = reverse("list_create_invoice")
        data = {
            "name": "First Invoice",
            "description": "invoice description",
            "school": self.school.id,
            "items" : [self.fee_item.id,],
            "student" : self.student.id,
            "template" : self.fee_template.id,
            "amount_paid": 32000
        }
        self.client.force_authenticate(user=self.user)
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    

    def test_bulk_create_invoice(self):
        url = reverse("bulk_create_invoice", args=[self.class_obj.id])
        data = {
            "items" : [self.fee_item.id,],
            "template" : self.fee_template.id,
        }
        self.client.force_authenticate(user=self.user)
        response = self.client.post(url, data, format="json")


        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


    def test_list_invoices(self):
        url = reverse("list_create_invoice")
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_invoice(self):
        url = reverse("retrieve_update_destroy_invoice", args=[self.invoice.id])
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_invoice(self):
        url = reverse("retrieve_update_destroy_invoice", args=[self.invoice.id])
        data = {"amount_paid": 3000}

        self.client.force_authenticate(user=self.user)
        response = self.client.patch(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_invoice(self):
        url = reverse("retrieve_update_destroy_invoice", args=[self.invoice.id])
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class DiscountTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = User.objects.create_user(
            username="testuser", password="testpassword", role="owner"
        )

        self.student = User.objects.create_user(
            username="teststudent", password="testpassword", role="student"
        )

        self.school = School.objects.create(
            name="chrisland",
            owner=self.user,
            date_of_establishment=datetime.now().date(),
        )

        self.class_obj = Class.objects.create(
            name="Test Class", school=self.school, description="Description", code='TEST'
        )

        self.discount = Discount.objects.create(
            discount_type="percentage", amount=10, percentage=10,
            school=self.school
        )

        self.fee_item = FeeItem.objects.create(
            name="Fee Item", description="Test Fee Item", amount=100,
            discount=self.discount, school=self.school 
        )

        self.fee_template = FeeTemplate.objects.create(
            school=self.school, class_id=self.class_obj, discount=self.discount
        )

    
    def test_create_discount(self):
        url = reverse("list_create_discount")
        data = {
            "name":"Discount name",
            "description": "Discount description",
            "discount_type": "amount",
            "school" : self.school.id,
            "amount": 32
        }
        self.client.force_authenticate(user=self.user)
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_discounts(self):
        url = reverse("list_create_discount")
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_discount(self):
        url = reverse("retrieve_update_destroy_discount", args=[self.discount.id])
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_discount(self):
        url = reverse("retrieve_update_destroy_discount", args=[self.discount.id])
        data = {"amount": 30}

        self.client.force_authenticate(user=self.user)
        response = self.client.patch(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_discount(self):
        url = reverse("retrieve_update_destroy_discount", args=[self.discount.id])
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class TransactionTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = User.objects.create_user(
            username="testuser", password="testpassword", role="owner"
        )

        self.student = User.objects.create_user(
            username="teststudent", password="testpassword", role="student"
        )

        self.school = School.objects.create(
            name="chrisland",
            owner=self.user,
            date_of_establishment=datetime.now().date(),
        )

        self.class_obj = Class.objects.create(
            name="Test Class", school=self.school, description="Description", code='TEST'
        )

        self.discount = Discount.objects.create(
            discount_type="percentage", amount=10, percentage=10,
            school=self.school
        )

        self.fee_item = FeeItem.objects.create(
            name="Fee Item", description="Test Fee Item", amount=100,
            discount=self.discount, school=self.school 
        )

        self.fee_template = FeeTemplate.objects.create(
            school=self.school, class_id=self.class_obj, discount=self.discount
        )

        self.invoice = Invoice.objects.create(
            school=self.school, template=self.fee_template, student=self.student
        )

        self.transaction = Transaction.objects.create(
            invoice=self.invoice,
            invoice_id=self.invoice.id,
            school=self.school
        )

    
    def test_create_transaction(self):
        url = reverse("list_create_transaction")
        
        data = {
            "content_type" : ContentType.objects.get_for_model(Invoice).id,
            "invoice" : self.invoice.id,
            "school" : self.school.id
        }

        self.client.force_authenticate(user=self.user)
        response = self.client.post(url, data, format="json")


        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_transactions(self):
        url = reverse("list_create_transaction")
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_transaction(self):
        url = reverse("retrieve_update_destroy_transaction", args=[self.transaction.id])
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_transaction(self):
        url = reverse("retrieve_update_destroy_transaction", args=[self.transaction.id])
        data = {
            "reversed_transaction_id": self.transaction.id,
            "status" : "paid"
        }

        self.client.force_authenticate(user=self.user)
        response = self.client.patch(url, data, format="json")


        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_transaction(self):
        url = reverse("retrieve_update_destroy_transaction", args=[self.transaction.id])
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
