# django の unittest で parameterized

すべてテストを pytest で書く場合なら `pytest.mark.parametrize` を使えばよさそうだけど、既存のdjangoのテストをあまり書き換えたくないけど parameterized を使えないかな、という試み。

django のテストケースは xUnit 形式の(であってるはず) `unittest.TestCase` をベースとした `django.test.TestCase` を使っているので、 `@parameterized.expand` をそのまま使えた。

データの読み込みについて、リポジトリの README.rst 的には `*json.loads(line)` でまとめて読み込んでたりする。

`make all` で試せます。


## 参考

* http://h-miyako.hatenablog.com/entry/2017/08/16/173000
* https://qiita.com/nittyan/items/0152a3b93e17c177f5f5
* https://github.com/wolever/parameterized


```python
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
```

```
➤ make all
python3 -m venv venv
./venv/bin/pip install -r requirements.txt
Requirement already satisfied: Django==2.0.1 in ./venv/lib/python3.6/site-packages (from -c constrains.txt (line 1))
Requirement already satisfied: parameterized==0.6.1 in ./venv/lib/python3.6/site-packages (from -c constrains.txt (line 2))
Requirement already satisfied: pytz==2017.3 in ./venv/lib/python3.6/site-packages (from -c constrains.txt (line 3))
./venv/bin/python -m unittest django_test_parameterized.py
.F...F..F.
======================================================================
FAIL: test_add_params_1 (django_test_parameterized.Test)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "venv/lib/python3.6/site-packages/parameterized/parameterized.py", line 392, in standalone_func
    return func(*(a + p.args), **p.kwargs)
  File "django_test_parameterized.py", line 52, in test_add_params
    self.assertEqual(add(a, b), expected)
AssertionError: 5 != 6

======================================================================
FAIL: test_count_equal_by_dict_2 (django_test_parameterized.Test)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "venv/lib/python3.6/site-packages/parameterized/parameterized.py", line 392, in standalone_func
    return func(*(a + p.args), **p.kwargs)
  File "django_test_parameterized.py", line 74, in test_count_equal_by_dict
    self.assertEqual(X.objects.count(), data['expected']['X'])
AssertionError: 3 != 10

======================================================================
FAIL: test_count_equal_by_list_2 (django_test_parameterized.Test)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "venv/lib/python3.6/site-packages/parameterized/parameterized.py", line 392, in standalone_func
    return func(*(a + p.args), **p.kwargs)
  File "django_test_parameterized.py", line 62, in test_count_equal_by_list
    self.assertEqual(M.objects.count(), expected)
AssertionError: 4 != 5

----------------------------------------------------------------------
Ran 10 tests in 0.017s

FAILED (failures=3)
make: *** [all] Error 1
```
