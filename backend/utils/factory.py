import factory
import faker
from factory.faker import Faker

from account.models import User

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
