import logging

logger = logging.getLogger(__name__)


def call(x, name, *args, **kwargs):
    logger.info('name:%s, args:%s, kwargs:%s', name, args, kwargs)
    f = getattr(x, name)
    val = f(*args, **kwargs)
    logger.info('val: %s', val)
    return val

class Wrap:
    def __init__(self, x):
        self.x = x

    def __getattr__(self, name, *args, **kwargs):
        return lambda *args, **kwargs: call(self.x, name, *args, **kwargs)


class Client(object):
    def __init__(self, url, port):
        self.url = url
        self.port = port

    def add(self, *args):
        _ = 0
        for x in args:
            _ += x
        return _

    def mul(self, *args):
        _ = 1
        for x in args:
            _ = _ * x
        return _

    def address(self, **kwargs):
        url = kwargs.pop('url', self.url)
        port = kwargs.pop('port', self.port)
        return 'http://{}:{}'.format(url, port)


def main():
    c = Wrap(Client('domain', 'port'))
    c.add(2, 3)
    c.add(4, 2)
    c.mul(1, 2, 3)
    c.mul(3)
    c.address()
    c.address(url='localhost', port=8080)

if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    main()
