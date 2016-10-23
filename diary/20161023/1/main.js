// 今回は object を引き回して固定のfuncを呼び出している
//   - 直接fn をひきまわしてもいい
//  prototype をつかった実装だと new で生成したときにthisを毎回生成しない
//   - パフォーマンスがいいらしい
//   - 関数部分は毎回生成する必要が無いから、別途定義してprototype にいれたらよいという話
//     - 例えば Array オブジェクトを作成するときに、メソッドは毎回生成する必要がない

function ObserverList (){
  this.handlers = [];
}

ObserverList.prototype = {
  add: function(obj){
    this.handlers.push(obj);
  },
  remove: function(obj){
    this.handlers.forEach(function(handler){
      if (handler === obj) {
        this.handlers.pop(handler);
        return true;
      }
    }.bind(this));
    return false;
  },
  notify: function(){
    var args = Array.prototype.slice.apply(arguments, [0]);
    this.handlers.forEach(function(handler){
      handler.update.apply(null, this);
    });
  }
}

function Subject (){
  var observerList = new ObserverList();

  this.addObserver = function (observer){
    observerList.add(observer);
  }
  this.removeObserver = function(observer){
    observerList.remove(observer);
  },
  this.fetchData = function(){
    var data = {
      apple: 'red',
      banana: 'yellow'
    }
    observerList.notify(data);
  }
}

var dataUpdated = {
  update: function(){
    console.log('dataUpdated')
  }
};
var dataPublished = {
  update: function(){
    console.log('dataPublished')
  }
};

var subject = new Subject();
subject.addObserver(dataUpdated);
subject.fetchData();

subject.addObserver(dataPublished);
subject.fetchData();

subject.removeObserver(dataUpdated);
subject.fetchData();
