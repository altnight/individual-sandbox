class D:
    def __init__(self, name, files=[]):
        self._name = name
        self.files = files
        self.depth = 0

    @property
    def name(self):
        return '.' * self.depth + repr(self)

    def __iter__(self):
        return iter(self.files)

    def __repr__(self):
        return self._name

class F:
    def __init__(self, name):
        self._name = name
        self.depth = 0

    @property
    def name(self):
        return '.' * self.depth + repr(self)

    def __repr__(self):
        return self._name

def to_loop(x):
    if isinstance(x, D):
        print(x.name)
        x.depth += 1
        for i in x:
            i.depth = x.depth
            to_loop(i)
    else:
        print(x.name)


def main():
    f1 = F('f1')
    f2 = F('f2')
    f3 = F('f3')
    f4 = F('f4')
    d1 = D('d1', [f1, f2])
    d2 = D('d2', [f3, f4, d1])
    d3 = D('d3', [d2, f1])

    to_loop(d3)

if __name__ == '__main__':
    main()
