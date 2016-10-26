var Component = function(){
  this.handlers = Object.create(null);
}

Component.prototype = {
  _publishAll: function(){
    for (var k in this.handlers) {
      this.handlers[k]();
    }
  },
  publish: function(name){
    if (!name) {
      this._publishAll();
    }
    for (var k in this.handlers) {
      if (name === k) {
        this.handlers[k](arguments);
      }
    }
  },
  subscribe: function(name, fn){
    this.handlers[name] = fn;
  },
  unsubscribe: function(name){
    delete this.handlers[name];
  },
}

var item_add = function(arguments){
  console.log('item.add');
  if (!arguments) return

  var args = Array.prototype.slice.call(arguments, 1);
  var _ = 0;
  for (var arg in args) {
    _ = _ + parseInt(arg);
  }
  console.log(_);
};
var item_mul = function(arguments){
  console.log('item.mul');
  if (!arguments) return

  var args = Array.prototype.slice.call(arguments, 1);
  var _ = 1;
  // XXX: for (var arg in args)
  for (var i=0; i < args.length; i++) {
    _ = _ * args[i];
  }
  console.log(_);
};

component = new Component();
component.subscribe('item.add', item_add);
component.publish();

component.subscribe('item.mul', item_mul);
component.publish('item.add', 1, 2, 2, 3);
component.publish('item.mul', 1, 2, 4, 9);
component._publishAll();

component.unsubscribe('item.add');
component.publish();
