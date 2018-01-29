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
