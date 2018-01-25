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
