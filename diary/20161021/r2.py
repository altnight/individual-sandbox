data2 = [1,2,3,[4,5], 6, [7, [], [[8]]]]
depth = 0


def ff(data2, sep='_'):
    global depth
    if isinstance(data2, int):
        print(sep * depth + str(data2))
    elif isinstance(data2, list):
        depth += 1
        for i in data2:
            '{}'.format(ff(i))
        depth -= 1
ff(data2)
