# systemd で celery を起動して、タスクを正常終了させる

特に変わったことはしてないけど検証。あとせっかくなので `./Vagrantfile` に環境をまとめてみた。

## 参考

* http://tokibito.hatenablog.com/entry/20140125/1390661539
* http://docs.celeryproject.org/en/latest/userguide/workers.html#worker-persistent-revokes
* https://www.freedesktop.org/software/systemd/man/systemd.service.html

## 検証

### 環境

Ubuntu 16.04

```
➤ cat Vagrantfile
Vagrant.configure("2") do |config|
  config.vm.box = "bento/ubuntu-16.04"
end
```

### python

特に指定がないので 3.5 にしておく。検証的にはvirtualenvはなくてもよいけどせっかくなので。broker はインストールや設定が簡単な redis を使用してる。

```shell
sudo apt update -y
sudo apt install -y python3 python3-pip python3-venv
sudo apt install -y redis-server
python3 -m venv v
. ./v/bin/activate
pip install -U "celery[redis]"
```

### celery

すこしだけ時間のかかるタスクを用意しておく。
```shell
(v) vagrant@vagrant:~$ cat tasks.py
import os
from celery import Celery

import time

app = Celery()
app.conf.broker_url = 'redis://localhost:6379/0'
app.conf.result_backend = 'redis://localhost:6379/0'

@app.task
def hello():
    time.sleep(5)
    return os.getpid()
```

### systemd
再起動設定はon-failureにしてる。それ以外は特に変わったところなし。
```shell
(v) vagrant@vagrant:~$ cat /etc/systemd/system/celery.service
[Unit]
Description=celery daemon

[Service]
Type=simple
User=vagrant
Group=vagrant
WorkingDirectory=/home/vagrant
ExecStart=/home/vagrant/v/bin/celery -A tasks worker --concurrency=1
Restart=on-failure

[Install]
WantedBy=multi-user.target
```
```shell
sudo systemctl daemon-reload
sudo systemctl start celery
```
## 検証

systemd 経由でcelery を起動した後別のシェルを立ち上げてタスクを投げる。タスク処理中にceleryのマスターとなるプロセスを TERM で止めた場合、タスクが正常終了後に celery のプロセスも止まる。

```Ashell
# celery -A tasks worker -c 1 --loglevel=info
```

```python
from tasks import hello
hello.apply_async().get()
```
```shell
ps aux | grep -v grep | grep celery | awk '{print $2}' | sort -n | head -n 1 | xargs kill -term # master process
```
