# django を 1ファイルで試す

`settings.configure`してから  `django.setup`  すればいい。公式ドキュメントには記載されてるけど、このあたり自分では発見できなかった。

モデルを使った場合の tableの作り方がわからなくて `call_command('migrate')` をするのかと思ったけど、 connection からつくれる模様。知らなかった。

今回も Makefile を置いておいた。 `make all` で試せる。

## 参考

* 公式ドキュメント: https://docs.djangoproject.com/en/2.0/topics/settings/#calling-django-setup-is-required-for-standalone-django-usage
* 参考リポジトリ: https://github.com/readevalprint/mini-django
* 例: https://gist.github.com/podhmo/7703503ac8bc840fa678e00ae86fab6a

```python
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
```
