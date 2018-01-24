from parameterized import parameterized
import django
from django.test import TestCase
from django.conf import settings
from django.db import models, connections


settings.configure(
    DEBUG=True,
    DATABASES={
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': ':memory:'
        }
    },
    INSTALLED_APPS=[__name__],
)
django.setup()


def create_table(model):
    connection = connections['default']
    with connection.schema_editor() as schema_editor:
        schema_editor.create_model(model)


class M(models.Model):
    name = models.CharField(max_length=10)

class X(models.Model):
    age = models.IntegerField()

class Test(TestCase):
    def setUp(self):
        create_table(M)
        create_table(X)

    def test_django_model_count(self):
        self.assertEqual(1, 1)
        M.objects.create(name='a')
        self.assertEqual(M.objects.count(), 1)

    @parameterized.expand([
        (1, 1, 2),
        (2, 3, 6),
        (4, 6, 10),
    ])
    def test_add_params(self, a, b, expected):
        def add(x, y):
            return x + y

        self.assertEqual(add(a, b), expected)

    @parameterized.expand([
        [['a', 'b'], 2],
        [['a', 'b', 'c'], 3],
        [['a', 'b', 'c', 'd'], 5],
    ])
    def test_count_equal_by_list(self, input_, expected):
        M.objects.bulk_create([M(name=_) for _ in input_])

        self.assertEqual(M.objects.count(), expected)

    @parameterized.expand([
        [{'input': {'M': ['a', 'b'], 'X': [10]}, 'expected': {'M': 2, 'X': 1}}],
        [{'input': {'M': ['a', 'b', 'c'], 'X': [10, 20]}, 'expected': {'M': 3, 'X': 2}}],
        [{'input': {'M': ['a', 'b', 'c', 'd'], 'X': [10, 20, 30]}, 'expected': {'M': 4, 'X': 10}}],
    ])
    def test_count_equal_by_dict(self, data):
        M.objects.bulk_create([M(name=_) for _ in data['input']['M']])
        X.objects.bulk_create([X(age=_) for _ in data['input']['X']])

        self.assertEqual(M.objects.count(), data['expected']['M'])
        self.assertEqual(X.objects.count(), data['expected']['X'])
