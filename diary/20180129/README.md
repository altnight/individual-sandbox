# vue を node (console) で動かす: その2

![前回](https://github.com/altnight/individual-sandbox/tree/master/diary/20180128)は動かすだけだったので、他の属性を使う。

データ作成に faker を使った。

## 参考

* https://github.com/marak/Faker.js/

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
const vm = new Vue({
  template: `
    <div>
      <input type="text" v-model="firstName">
      <input type="text" v-model="lastName">
      <input type="number" v-model="age">
      <span>info: {{ fullName }}: {{ age }}</span>
      <button @click.prevent="submit" ref="submitButton"></button>
    </div>
  `,
  data: {
    firstName: '',
    lastName: '',
    age: '',
  },
  computed: {
    fullName() {
      return `${this.firstName} ${this.lastName}`
    }
  },
  methods: {
    submit() {
      if (! this.validateAge()) {
        console.log('not submitted')
        return
      }
      console.log('submitted')
      return
    },
    validateAge() {
      if (this.age <= 18) {
        return false
      }
      return true
    }
  },
}).$mount()

const faker = require('faker')

async function fn () {
  vm.firstName = faker.name.firstName()
  vm.lastName = faker.name.lastName()
  vm.age = faker.random.number(50)

  await vm.$nextTick()

  console.log(vm.$el.textContent)

  vm.$refs.submitButton.click()
}
const timer = window.setInterval(() => {
  fn()
}, 100)
window.setTimeout(() => {
  window.clearInterval(timer)
}, 0.5 * 1000)
```

## 実行結果

```
npm install
added 99 packages in 3.972s
npm start

> 20180129@1.0.0 start /Users/altnight/w/individual-sandbox/diary/20180129
> node index.js

You are running Vue in development mode.
Make sure to turn on production mode when deploying for production.
See more tips at https://vuejs.org/guide/deployment.html
   info: Damien Corwin: 36 
submitted
   info: Francisco Lockman: 36 
submitted
   info: Victor Kris: 25 
submitted
   info: Malinda Farrell: 9 
not submitted
```
