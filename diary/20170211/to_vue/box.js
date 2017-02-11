var maxWidth = window.innerWidth;
var maxHeight = window.innerHeight;
var boxLeft = 0;
var boxTop = 30;

Vue.component('Box', {
  template: '#box-template',
  mounted: function(){
    this.draw();
  },
  props: {
    width: {
      default: 100,
    },
    height: {
      default: 100,
    },
    radius: {
      default: 10,
    }
  },
  methods: {
    draw: function(){
      var el = this.$refs.box;
      el.style.width = parseInt(this.width) + 'px';
      el.style.height = parseInt(this.height) + 'px';
      el.style.borderRadius = parseInt(this.radius) + 'px ' + parseInt(this.radius) + 'px';
      var _randomColor = function(){
        var ar = [];
        for (i=0; i<6; i++) {
          ar.push(_.sample(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']));
        }
        return '#' + ar.join('')
      }
      el.style.backgroundColor = _randomColor();

      var init = function (vm, el){

        var pos = {x: boxLeft, y: boxTop}
        var tween1 = new TWEEN.Tween(pos)
            .to({ x: vm._maxWidth() / 2, y: vm._maxHeight() }, 3*1000)
            .easing(TWEEN.Easing.Quadratic.In)
            .onUpdate(function() {
              el.style.left = Math.round(this.x) + 'px';
              el.style.top = Math.round(this.y) + 'px';
            })

        var tween2 = new TWEEN.Tween(pos)
            .to({ x: vm._maxWidth(),  y: boxTop }, 2*1000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(function() {
              el.style.left = Math.round(this.x) + 'px';
              el.style.top = Math.round(this.y) + 'px';
            })

        var tween3 = new TWEEN.Tween(pos)
            .to({ x: boxLeft, y: boxTop }, 1*1000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(function() {
              el.style.left = Math.round(this.x) + 'px';
              el.style.top = Math.round(this.y) + 'px';
            })

          tween1.chain(tween2);
          tween2.chain(tween3);
          tween3.chain(tween1);
          tween1.start();
      }

      var animate = function(time) {
          requestAnimationFrame(animate);
          TWEEN.update(time);
      }
      init(this, el)
      animate()
    },
    _maxWidth: function(){
      return maxWidth - this.width;
    },
    _maxHeight: function(){
      return maxHeight - this.height;
    }
  }
})
