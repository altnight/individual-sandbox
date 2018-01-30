# Web Extension を作る(Getting started)

Firefox 58(59beta) を使用している。Web Extension が使えるようになったということで、サンプルを動かす。内容は画面にボーダーを表示させるサンプルのまま。gif を取ろうと思ったけど、参考サイトに動画があるので取ってない。

ファイル類を作ったら URL に `about:debugging` を入れて拡張画面に遷移し、 `Load Temporary Add-on` を押す。manifest.json を読み込めば拡張機能が有効になる。

サンプルのままというのも味気ないので、サイトを静的に定義して色などを変えられるようにした。ポップアップ画面でデータ管理ができ、単純なborderで画面を圧迫せず positon: fixed あたりにすれば、いまどの環境に接続してるか識別しやすいブラウザ表示拡張ができる(ちなみにこのアイディア自体は自分のものではない)。ということで気が乗る限り進めてみる。

## 参考

* https://developer.mozilla.org/ja/Add-ons/WebExtensions/Your_first_WebExtension
