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
