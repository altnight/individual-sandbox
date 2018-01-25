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
