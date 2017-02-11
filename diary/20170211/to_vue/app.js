window.addEventListener('DOMContentLoaded', function(){

  new Vue({
    el: '#app',
    data: function() {
      return {
        width: 100,
        height: 100,
        radius: 10,
        boxes: []
      }
    },
    methods: {
      addBox: function() {
        this.boxes.push({
          width: this.width,
          height: this.height,
          radius: this.radius,
        })
      }
    }
  })
})
