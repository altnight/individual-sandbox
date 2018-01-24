import django
from django.conf import settings
from django.db import models, connections


def create_table(model):
    # ref: https://gist.github.com/podhmo/7703503ac8bc840fa678e00ae86fab6a
    connection = connections['default']
    with connection.schema_editor() as schema_editor:
        schema_editor.create_model(model)

def setup():
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

def main():
    setup()

    class M(models.Model):
        name = models.CharField(max_length=10)
    create_table(M)

    M.objects.create(name='a')
    M.objects.create(name='b')
    M.objects.create(name='c')
    print(M.objects.all())
    # <QuerySet [<M: M object (1)>, <M: M object (2)>, <M: M object (3)>]>


if __name__ == '__main__':
    main()
