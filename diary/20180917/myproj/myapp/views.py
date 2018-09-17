import logging

from django.http import HttpResponse

logger = logging.getLogger(__name__)

def index(request):
    logger.info('logging message')
    print('print message')
    return HttpResponse('ok')
