# django single file で select_related / prefetch_related

select_related / prefetch_related で N+1 クエリを減らしたいよね、というときの検証コード。

テンプレートで値を参照するときに発生しがちということで、テンプレートも single file で書く。settingsとしては単に DjangoTemplates を指定すればよく、テンプレートを文字列からつくるには `django.template.Template` `django.template.Context` をつかえばOK。

`make select_related` `make prefetch_related` で試せます。

## select_related

```python
import django
from django.conf import settings
from django.db import models, connections
from django import template


settings.configure(
    DEBUG=True,
    DATABASES={
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': ':memory:'
        }
    },
    INSTALLED_APPS=[__name__],
    TEMPLATES=[{
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
    }],
    LOGGING={
        'version': 1,
        'handlers': {
            'console': {
                'level': 'DEBUG',
                'class': 'logging.StreamHandler',
            }
        },
        'loggers': {
            'django.db.backends': {
                'level': 'DEBUG',
                'handlers': ['console'],
            }
        }
    }
)
django.setup()


def create_table(model):
    connection = connections['default']
    with connection.schema_editor() as schema_editor:
        schema_editor.create_model(model)


class Thread(models.Model):
    name = models.CharField(max_length=10)


class Comment(models.Model):
    body = models.CharField(max_length=2000)
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE)


def main():
    create_table(Thread)
    create_table(Comment)

    thread = Thread.objects.create(name='thread_a')
    Comment.objects.create(body='body_a', thread=thread)
    Comment.objects.create(body='body_b', thread=thread)
    Comment.objects.create(body='body_c', thread=thread)

    print('>' * 40)
    comment = Comment.objects.get(pk=1)
    t = template.Template('''{{ comment.thread.name }}''')
    c = template.Context({'comment': comment})
    res = t.render(c)
    print(res)
    print('<' * 40)

    print('>' * 40)
    comment = Comment.objects.select_related('thread').get(pk=1)
    t = template.Template('''{{ comment.thread.name }}''')
    c = template.Context({'comment': comment})
    res = t.render(c)
    print(res)
    print('<' * 40)


if __name__ == '__main__':
    main()
```

```
➤ make select_related
python3 -m venv venv
./venv/bin/pip install -r requirements.txt
Requirement already satisfied: Django==2.0.1 in ./venv/lib/python3.6/site-packages (from -c constrains.txt (line 1))
Requirement already satisfied: pytz in ./venv/lib/python3.6/site-packages (from Django==2.0.1->-c constrains.txt (line 1))
./venv/bin/python django_select_related.py
(0.000) PRAGMA foreign_keys = OFF; args=None
(0.000) BEGIN; args=None
CREATE TABLE "__main___thread" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "name" varchar(10) NOT NULL); (params None)
(0.000) CREATE TABLE "__main___thread" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "name" varchar(10) NOT NULL); args=None
(0.000) PRAGMA foreign_keys = ON; args=None
(0.000) PRAGMA foreign_keys = OFF; args=None
(0.000) BEGIN; args=None
CREATE TABLE "__main___comment" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "body" varchar(2000) NOT NULL, "thread_id" integer NOT NULL REFERENCES "__main___thread" ("id") DEFERRABLE INITIALLY DEFERRED); (params None)
(0.000) CREATE TABLE "__main___comment" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "body" varchar(2000) NOT NULL, "thread_id" integer NOT NULL REFERENCES "__main___thread" ("id") DEFERRABLE INITIALLY DEFERRED); args=None
CREATE INDEX "__main___comment_thread_id_a6c9689e" ON "__main___comment" ("thread_id"); (params ())
(0.000) CREATE INDEX "__main___comment_thread_id_a6c9689e" ON "__main___comment" ("thread_id"); args=()
(0.000) PRAGMA foreign_keys = ON; args=None
(0.000) BEGIN; args=None
(0.000) INSERT INTO "__main___thread" ("name") VALUES ('thread_a'); args=['thread_a']
(0.000) BEGIN; args=None
(0.000) INSERT INTO "__main___comment" ("body", "thread_id") VALUES ('body_a', 1); args=['body_a', 1]
(0.000) BEGIN; args=None
(0.000) INSERT INTO "__main___comment" ("body", "thread_id") VALUES ('body_b', 1); args=['body_b', 1]
(0.000) BEGIN; args=None
(0.000) INSERT INTO "__main___comment" ("body", "thread_id") VALUES ('body_c', 1); args=['body_c', 1]
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
(0.000) SELECT "__main___comment"."id", "__main___comment"."body", "__main___comment"."thread_id" FROM "__main___comment" WHERE "__main___comment"."id" = 1; args=(1,)
(0.000) SELECT "__main___thread"."id", "__main___thread"."name" FROM "__main___thread" WHERE "__main___thread"."id" = 1; args=(1,)
thread_a
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
(0.000) SELECT "__main___comment"."id", "__main___comment"."body", "__main___comment"."thread_id", "__main___thread"."id", "__main___thread"."name" FROM "__main___comment" INNER JOIN "__main___thread" ON ("__main___comment"."thread_id" = "__main___thread"."id") WHERE "__main___comment"."id" = 1; args=(1,)
thread_a
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
```

## prefetch_related

```python
import django
from django.conf import settings
from django.db import models, connections
from django import template


settings.configure(
    DEBUG=True,
    DATABASES={
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': ':memory:'
        }
    },
    INSTALLED_APPS=[__name__],
    TEMPLATES=[{
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
    }],
    LOGGING={
        'version': 1,
        'handlers': {
            'console': {
                'level': 'DEBUG',
                'class': 'logging.StreamHandler',
            }
        },
        'loggers': {
            'django.db.backends': {
                'level': 'DEBUG',
                'handlers': ['console'],
            }
        }
    }
)
django.setup()


def create_table(model):
    connection = connections['default']
    with connection.schema_editor() as schema_editor:
        schema_editor.create_model(model)


class Thread(models.Model):
    name = models.CharField(max_length=10)


class Comment(models.Model):
    body = models.CharField(max_length=2000)
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE)


def main():
    create_table(Thread)
    create_table(Comment)

    thread_a = Thread.objects.create(name='thread_a')
    Comment.objects.create(body='aaaa', thread=thread_a)
    Comment.objects.create(body='bbbb', thread=thread_a)
    thread_b = Thread.objects.create(name='thread_b')
    Comment.objects.create(body='cccc', thread=thread_b)
    Comment.objects.create(body='dddd', thread=thread_b)


    print('>' * 40)
    for thread in Thread.objects.all():
        t = template.Template('''{% for comment in thread.comment_set.all %}{{ comment.body }}{% endfor %}''')
        c = template.Context({'thread': thread})
        res = t.render(c)
        print(res)
    print('<' * 40)

    print('>' * 40)
    for thread in Thread.objects.prefetch_related('comment_set').all():
        t = template.Template('''{% for comment in thread.comment_set.all %}{{ comment.body }}{% endfor %}''')
        c = template.Context({'thread': thread})
        res = t.render(c)
        print(res)
    print('<' * 40)


if __name__ == '__main__':
    main()
```

```
➤ make prefetch_related
python3 -m venv venv
./venv/bin/pip install -r requirements.txt
Requirement already satisfied: Django==2.0.1 in ./venv/lib/python3.6/site-packages (from -c constrains.txt (line 1))
Requirement already satisfied: pytz in ./venv/lib/python3.6/site-packages (from Django==2.0.1->-c constrains.txt (line 1))
./venv/bin/python django_prefetch_related.py
(0.000) PRAGMA foreign_keys = OFF; args=None
(0.000) BEGIN; args=None
CREATE TABLE "__main___thread" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "name" varchar(10) NOT NULL); (params None)
(0.000) CREATE TABLE "__main___thread" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "name" varchar(10) NOT NULL); args=None
(0.000) PRAGMA foreign_keys = ON; args=None
(0.000) PRAGMA foreign_keys = OFF; args=None
(0.000) BEGIN; args=None
CREATE TABLE "__main___comment" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "body" varchar(2000) NOT NULL, "thread_id" integer NOT NULL REFERENCES "__main___thread" ("id") DEFERRABLE INITIALLY DEFERRED); (params None)
(0.000) CREATE TABLE "__main___comment" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "body" varchar(2000) NOT NULL, "thread_id" integer NOT NULL REFERENCES "__main___thread" ("id") DEFERRABLE INITIALLY DEFERRED); args=None
CREATE INDEX "__main___comment_thread_id_a6c9689e" ON "__main___comment" ("thread_id"); (params ())
(0.000) CREATE INDEX "__main___comment_thread_id_a6c9689e" ON "__main___comment" ("thread_id"); args=()
(0.000) PRAGMA foreign_keys = ON; args=None
(0.000) BEGIN; args=None
(0.000) INSERT INTO "__main___thread" ("name") VALUES ('thread_a'); args=['thread_a']
(0.000) BEGIN; args=None
(0.000) INSERT INTO "__main___comment" ("body", "thread_id") VALUES ('aaaa', 1); args=['aaaa', 1]
(0.000) BEGIN; args=None
(0.000) INSERT INTO "__main___comment" ("body", "thread_id") VALUES ('bbbb', 1); args=['bbbb', 1]
(0.000) BEGIN; args=None
(0.000) INSERT INTO "__main___thread" ("name") VALUES ('thread_b'); args=['thread_b']
(0.000) BEGIN; args=None
(0.000) INSERT INTO "__main___comment" ("body", "thread_id") VALUES ('cccc', 2); args=['cccc', 2]
(0.000) BEGIN; args=None
(0.000) INSERT INTO "__main___comment" ("body", "thread_id") VALUES ('dddd', 2); args=['dddd', 2]
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
(0.000) SELECT "__main___thread"."id", "__main___thread"."name" FROM "__main___thread"; args=()
(0.000) SELECT "__main___comment"."id", "__main___comment"."body", "__main___comment"."thread_id" FROM "__main___comment" WHERE "__main___comment"."thread_id" = 1; args=(1,)
aaaabbbb
(0.000) SELECT "__main___comment"."id", "__main___comment"."body", "__main___comment"."thread_id" FROM "__main___comment" WHERE "__main___comment"."thread_id" = 2; args=(2,)
ccccdddd
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
(0.000) SELECT "__main___thread"."id", "__main___thread"."name" FROM "__main___thread"; args=()
(0.000) SELECT "__main___comment"."id", "__main___comment"."body", "__main___comment"."thread_id" FROM "__main___comment" WHERE "__main___comment"."thread_id" IN (1, 2); args=(1, 2)
aaaabbbb
ccccdddd
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
```

