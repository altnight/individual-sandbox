# django print logging

## prepare

```shell
python3.6 -m venv venv
. ./venv/bin/activate
pip install 'django<2.0'
```

## run

```shell
python manage.py runserver
```

## result

```python
# myproj/settings.py

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'dev': {
            # 'format': '%(asctime)s - %(name)s - %(funcName)s %(lineno)s - %(levelname)s - %(message)s'
            'format': '%(asctime)s - %(levelname)s - %(message)s'
        }
    },
    'handlers': {
        'stream': {
            'formatter': 'dev',
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        '': {
            'handlers': ['stream'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}

def patch_print_function():

    class Wrapper:
        def __init__(self):
            import logging
            logger = logging.getLogger(__name__)
            self._write = getattr(logger, 'info')

        def write(self, b):
            if b.strip():
                import inspect
                # write - print - original
                original_frame = inspect.currentframe().f_back.f_back

                funcName = original_frame.f_code.co_name
                name = original_frame.f_globals['__name__']
                lineno = original_frame.f_lineno

                self._write(f'{name} {funcName} {lineno} {b}')

    import builtins
    orgprint = builtins.print
    def print(*a, **kw):
        if 'file' not in kw:
            kw['file'] = Wrapper()
        orgprint(*a, **kw)
    builtins.print = print

patch_print_function()

# myapp/views.py
import logging

from django.http import HttpResponse

logger = logging.getLogger(__name__)

def index(request):
    logger.info('logging message')
    print('print message')
    return HttpResponse('ok')

# run
➤ python manage.py runserver
Performing system checks...

System check identified no issues (0 silenced).

You have 13 unapplied migration(s). Your project may not work properly until you apply the migrations for app(s): admin, auth, contenttypes, sessions.
Run 'python manage.py migrate' to apply them.

September 17, 2018 - 05:34:53
Django version 1.11.15, using settings 'myproj.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
2018-09-17 05:34:56,031 - INFO - logging message
2018-09-17 05:34:56,031 - INFO - myapp.views index 9 print message
[17/Sep/2018 05:34:56] "GET / HTTP/1.1" 200 2

```
