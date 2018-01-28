# vue を node (console) で動かす

single file で django が動かせるのだし、そういえば vue もできるのだろうかと見た。毎回 index.html を作り、その中で vue.js を読み込まないと検証できないというのもすこし面倒。

動かした限りだと、以下が必要なにんしき。

* full mode の vue(templateオプションを使うため)
* DOM(window, document を使う)

vue.js のテストを見ているかぎり、基本的には `new Vue({})` で初期化して `$mount()` すればいい。ただ、それだけだと document がなくて動かない。コンソール内で使うときは DOM が必要で、jsdom で代用した。node 内で使うときは global の window, document にいれておく必要があった。このあたりは jsdom-global の実装を参考にした。ただこのあたりもう少し別の方法あるんじゃないかな(よくわからない)。

`make all` で試せます(`npm install; npm start` してるだけです)。

## 参考

* https://jp.vuejs.org/v2/guide/installation.html
* https://github.com/vuejs/vue/tree/dev/test/unit
* https://github.com/jsdom/jsdom
* https://github.com/rstacruz/jsdom-global
