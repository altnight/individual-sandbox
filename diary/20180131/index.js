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
