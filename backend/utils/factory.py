import factory
import faker
from factory.faker import Faker

from account.models import User

import uuid
from django.contrib.contenttypes.models import ContentType

from fees.models import Invoice

fk = faker.Faker()


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "account.User"
        django_get_or_create = ("username",)

    username = fk.first_name()


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