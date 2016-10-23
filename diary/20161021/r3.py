data = [1,2,[3,4,5, [6,7, [8,9]]],4,5]


out = []
def f(data):
    if isinstance(data, list):
        for i in data:
            f(i)
        return
    else:
        out.append(data)

ret = f(data)
print(out)
