# Vue のライフサイクルフックを一通り動かす

vm インスタンスが作成/破棄されたときなどのフックを一通り動かす。どういうフックがあるのかの詳細はドキュメントにある。

errorCaptured は 2.5 から追加されたらしい。子コンポーネントで発生した例外を親コンポーネントが拾って処理できる。例だと Child2 が破棄されたときに `throw new Error()` を投げるようにした。

activated/deactivated は子コンポーネントが入れ替わるタイミングで動く。keep-alive が有効だと counter の数値が保持され、特に指定がないと counter の数値がリセットされている。

## 参考

* https://jp.vuejs.org/v2/api/index.html
* https://jp.vuejs.org/v2/guide/instance.html
* https://jp.vuejs.org/v2/guide/components.html#keep-alive

## 環境

```
node --version
v8.6.0
npm --version
5.3.0
```

## スクリプト

```javascript
const { JSDOM } = require('jsdom')
const { window } = new JSDOM('<!DOCTYPE html><body></body></html>')
global.window = window
global.document = window.document

const Vue = require('vue/dist/vue.js')
const Child1 = Vue.component('child1', {
  template: `<div>child1 component displayed</div>`,
  data() {
    return {
      count: 0,
    }
  },
  activated() {
    console.log('child1: activated')
  },
  deactivated() {
    console.log('child1: deactivated')
  },
})
const Child2 = Vue.component('child2', {
  template: `<div>child2 component displayed</div>`,
  data() {
    return {
      count: 0,
    }
  },
  activated() {
    console.log('child2: activated')
  },
  deactivated() {
    console.log('child2: deactivated')
    throw new Error()
  }
})

const Mixin = {
  data() {
    return {
      currentView: Child1,
    }
  },
  methods: {
    fn() {
      console.log(this.$el.textContent)

      this.currentView = Child1
      this.$children[0].count++
      console.log(this.$children[0].count)

      this.$nextTick(() => {

        console.log(this.$el.textContent)
        this.currentView = Child2
        this.$children[0].count++
        console.log(this.$children[0].count)

        this.$nextTick(() => {

          console.log(this.$el.textContent)
          this.currentView = Child1
          this.$children[0].count++
          console.log(this.$children[0].count)

          this.$nextTick(() => {
            window.setTimeout(() => {
              this.$destroy()
            }, 0.5 * 1000)
          })
        })
      })
    }
  },
  beforeCreate() {
    console.log('parent: beforeCreate')
  },
  created() {
    console.log('parent: created')
  },
  beforeMount() {
    console.log('parent: beforeMount')
  },
  mounted() {
    console.log('parent: mounted')
    this.fn()
  },
  beforeUpdate() {
    console.log('parent: beforeUpdate')
  },
  updated() {
    console.log('parent: updated')
  },
  destroyed() {
    console.log('parent: destroyed')
  },
  beforeDestroy() {
    console.log('parent: beforeDestroy')
  },
  errorCaptured() {
    console.log('parent: errorCaptured')
  },
}

function timeout(ms) {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      resolve()
    }, ms)
  })
}

async function templateWithNotKeepAlive() {
  await timeout(0.2 * 1000)
  console.log('====== templateWithNotKeepAlive ========')
  new Vue({
    mixins: [Mixin],
    template: `
      <div>
        <component :is="currentView"></component>
      </div>
    `,
  }).$mount()
}

async function templateWithKeepAlive() {
  await timeout(0.8 * 1000)
  console.log('====== templateWithKeepAlive ========')
  new Vue({
    mixins: [Mixin],
    template: `
      <div>
        <keep-alive>
          <component :is="currentView"></component>
        </keep-alive>
      </div>
    `,
  }).$mount()
}

templateWithNotKeepAlive()
templateWithKeepAlive()
```

## 実行結果

```
npm install
npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN 20180131@1.0.0 No repository field.

added 98 packages in 5.126s
npm start

> 20180131@1.0.0 start /Users/altnight/w/individual-sandbox/diary/20180131
> node index.js

You are running Vue in development mode.
Make sure to turn on production mode when deploying for production.
See more tips at https://vuejs.org/guide/deployment.html
====== templateWithNotKeepAlive ========
parent: beforeCreate
parent: created
parent: beforeMount
parent: mounted
child1 component displayed
1
child1 component displayed
2
parent: beforeUpdate
parent: updated
child2 component displayed
1
parent: beforeUpdate
parent: updated
parent: beforeDestroy
parent: destroyed
====== templateWithKeepAlive ========
parent: beforeCreate
parent: created
parent: beforeMount
child1: activated
parent: mounted
child1 component displayed
1
child1 component displayed
2
parent: beforeUpdate
child1: deactivated
child2: activated
parent: updated
child2 component displayed
3
parent: beforeUpdate
child2: deactivated
parent: errorCaptured
[Vue warn]: Error in deactivated hook: "Error"

found in

---> <Child2>
       <Root>
Error
    at VueComponent.deactivated (/Users/altnight/w/individual-sandbox/diary/20180131/index.js:33:11)
    at callHook (/Users/altnight/w/individual-sandbox/diary/20180131/node_modules/vue/dist/vue.js:2895:21)
    at deactivateChildComponent (/Users/altnight/w/individual-sandbox/diary/20180131/node_modules/vue/dist/vue.js:2886:5)
    at destroy (/Users/altnight/w/individual-sandbox/diary/20180131/node_modules/vue/dist/vue.js:4106:9)
    at invokeDestroyHook (/Users/altnight/w/individual-sandbox/diary/20180131/node_modules/vue/dist/vue.js:5634:59)
    at removeVnodes (/Users/altnight/w/individual-sandbox/diary/20180131/node_modules/vue/dist/vue.js:5650:11)
    at VueComponent.patch [as __patch__] (/Users/altnight/w/individual-sandbox/diary/20180131/node_modules/vue/dist/vue.js:6063:11)
    at VueComponent.Vue._update (/Users/altnight/w/individual-sandbox/diary/20180131/node_modules/vue/dist/vue.js:2647:19)
    at VueComponent.updateComponent (/Users/altnight/w/individual-sandbox/diary/20180131/node_modules/vue/dist/vue.js:2765:10)
    at Watcher.get (/Users/altnight/w/individual-sandbox/diary/20180131/node_modules/vue/dist/vue.js:3113:25)
child1: activated
parent: updated
parent: beforeDestroy
child1: deactivated
parent: destroyed
```
