var vm = {};

vm.init = function(){
  new Vue({
    el: '#app',
    data: {
      'newComment': {
        'comment': '',
        'enabled': false,
        'list': 0,
      },
      "results": [
        {
          "name": "list1",
          "comments": [
            {"comment": "initial comment 1", "enabled": true},
            {"comment": "initial comment 2", "enabled": false}
          ]
        },
        {
          "name": "list2",
          "comments": [
            {"comment": "initial comment 3", "enabled": false},
            {"comment": "initial comment 4", "enabled": true}
          ]
        }
      ]
    },
    methods: {
      addItem: function(){
        var comment = this.newComment;
        this["results"][comment.list]["comments"].push(
            {"comment": comment.comment, "enabled": comment.enabled}
        );
      }
    }
  });
};
