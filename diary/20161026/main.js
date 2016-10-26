var NS = function(target, data){
  this.target = target || '#container';
  this.data = data;
};

NS.prototype = {
  init: function(){
    this.bindEvents();
    this.render();
  },
  bindEvents: function(){
    $('#submit_button').on('click', this.handleSubmit.bind(this));
    $(this.target).on('item.add', this.onItemAdd.bind(this));
  },

  onItemAdd: function(){
    console.log('onItemAdd: ns.data', this.data);
    this.render();
  },
  _parseUlIdx: function(ul_name){
    var uls = this.data["results"];
    for (var i=0; i < uls.length; i++) {
      if (ul_name == uls[i]["name"]) {
        return i;
      }
    }
    return false;
  },
  handleSubmit: function(ev) {
    ev.preventDefault();

    var comment = $('#input_text').val();
    var checked = $('#checked').prop('checked');
    var ul_idx = this._parseUlIdx($('#ul_name').val())
    if (ul_idx === false) return;
    this.addItem(ul_idx, comment, checked);
  },
  addItem: function(ul_idx, comment, enabled){
    // merge, extends のようなものを使ったほうが良いともう
    this.data["results"][ul_idx]["comments"].push({"comment": comment, "enabled": enabled});
    $(this.target).trigger('item.add');
  },

  render: function(){
    $(this.target).children().remove();

    var template = $('#template').html();
    Mustache.parse(template);
    var rendered = Mustache.render(template, this.data);
    $(this.target).html(rendered);

    console.log('rendered: ns.data', this.data);
  },

};
