## jQuery

- 追加するULをテキスト入力する
- イベントは `this.target` 以下をみる

## EventEmiter

- 検証

## EventEmitter を一部実装

- [observer](../20161023/1) の話続き
  - 該当のコードは読まずに書く
  - 上の EventEmiter の実装をみてから書いた
  - 引数を渡すところは中途半端

- handler の登録
  - 1) 配列なら object をそのままうけとる
  - 2) object なら key:value にできる
    - Map は ES2015らしい

- handler をcallするところ
  - 1) object をとるなら、決め打ちのpropを使う
  - 2) fn を取るなら、その関数を使う

### 参考
- https://nodejs.org/api/events.html#events_class_eventemitter
- https://github.com/Olical/EventEmitter/blob/master/EventEmitter.js
