# Vue のライフサイクルフックを一通り動かす

vm インスタンスが作成/破棄されたときなどのフックを一通り動かす。どういうフックがあるのかの詳細はドキュメントにある。

errorCaptured は 2.5 から追加されたらしい。子コンポーネントで発生した例外を親コンポーネントが拾って処理できる。例だと Child2 が破棄されたときに `throw new Error()` を投げるようにした。

activated/deactivated は子コンポーネントが入れ替わるタイミングで動く。keep-alive が有効だと counter の数値が保持され、特に指定がないと counter の数値がリセットされている。

## 参考

* https://jp.vuejs.org/v2/api/index.html
* https://jp.vuejs.org/v2/guide/instance.html
* https://jp.vuejs.org/v2/guide/components.html#keep-alive
