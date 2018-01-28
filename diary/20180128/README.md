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

## スクリプト

```javascript
const jsdom = require('jsdom')
const dom = new jsdom.JSDOM('<!DOCTYPE html><body></body></html>')
global.window = dom.window
global.document = dom.window.document

const Vue = require('vue/dist/vue.js')
const vm = new Vue({
  template: '<div>{{ msg }} (length: {{ length }})</div>',
  data: {
    msg: 'inject from vue',
  },
  computed: {
    length() {
      return this.msg.length
    }
  }
}).$mount()
console.log(vm.$el.textContent)

vm.msg = 'message2message2message2'
Vue.nextTick(() => {
  console.log(vm.$el.textContent)
})
```

## 実行結果

```
npm install
added 98 packages in 3.144s
npm start

> 20180128@1.0.0 start individual-sandbox/diary/20180128
> node index.js

inject from vue (length: 15)
You are running Vue in development mode.
Make sure to turn on production mode when deploying for production.
See more tips at https://vuejs.org/guide/deployment.html
message2message2message2 (length: 24)
```
