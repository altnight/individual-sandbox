data = [None,2,{'k': {'kk': 'b', 'hoge': [1, 2, True, False]}},[4,5,'a'], 7]

def f(data):
    if isinstance(data, list):
        t = []
        for v in data:
            t.append(f(v))
        return t
    elif isinstance(data, str):
        return data
    elif isinstance(data, dict):
        t = {}
        for k,v in data.items():
            t[k] = f(v)
        return t
    elif isinstance(data, bool):
        if data is True:
            return 'True'
        else:
            return 'False'
    elif data is None:
        return 'None'
    else:
        return str(data)

print(f(data))
