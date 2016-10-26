// https://nodejs.org/api/events.html#events_class_eventemitter

var EventEmitter = require('events');
var myEmitter =  new EventEmitter();

//myEmitter.once('myevent', function(a, b){
  //console.log('my event emitted');
//}.bind(this));
myEmitter.on('error', function(err){
  console.log(err);
});
myEmitter.emit('error', new Error('ho'));
myEmitter.getListeners('error');
