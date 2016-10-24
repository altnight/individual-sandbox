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
    $(document).on('item.add', this.onItemAdd.bind(this));
  },

  onItemAdd: function(){
    console.log('onItemAdd: ns.data', this.data);
    this.render();
  },
  handleSubmit: function(ev){
    ev.preventDefault();

    var comment = $('#input_text').val();
    var checked = $('#checked').prop('checked');
    this.addItem(comment, checked);
  },
  addItem: function(comment, enabled){
    this.data["results"][0]["comments"].push({"comment": comment, "enabled": enabled});
    $(document).trigger('item.add');
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
