# celery のモニタリングに flower を使う

celery でどういうタスクが動いているか確認するGUIツールとして flower がある。ということで、 flower を動かす。

## 準備

celery を起動する

`celery worker --app tasks --concurrency 2 --loglevel=INFO -f celery.log`

flower を起動する

`celery flower --app tasks`

適当に何回かタスクを動かす

`for i in {0..10}; do python -c 'from tasks import hello; print(hello.apply_async())'; done`

## 確認

ホストマシンから管理画面にアクセスする。無事みれる。

`http://localhost:5555`

![celery_flower](https://raw.githubusercontent.com/altnight/individual-sandbox/master/diary/20180127/celery_flower.gif)


## 参考

* http://dnond.hatenablog.com/entry/2013/07/31/221130
* https://qiita.com/xecus/items/9722b287cc6aee4083ae#celeryconfigpy
