var NS = function(target, data){
  this.target = target || '#container';
  this.data = data;
};

NS.prototype = {
  initialize: function(){
    if (!this.data) this.toData();
    this.refresh();
  },
  refresh: function(){
    $(this.target).children().remove();
    this.toDOM();
    console.log('ns.data', this.data);
  },

  buildLi: function(d){
    var li = $('<li></li>')
    li.text(d.comment);
    if (d.enabled) { li.addClass('enabled')};
    return li;
  },
  buildUl: function(d){
    var ul = $('<ul></ul>');
    ul.addClass('comments');
    ul.append($('<span></span>').text(d.name))
    return ul;
  },
  parseLi: function(node){
    var comment = $(node).text();
    var enabled = $(node).hasClass('enabled');
    return {"comment": comment, "enabled": enabled};
  },
  parseUl: function(node){
    var name = $(node).children('span').text();
    return {"name": name, "comments": []};
  },

  toDOM: function(){
    this.data.forEach(function(ul_data){
      var ul = this.buildUl(ul_data);
      ul_data["comments"].forEach(function(li_data){
        var li = this.buildLi(li_data);
        ul.append(li);
      }.bind(this));
      $(this.target).append(ul);
    }.bind(this));
  },
  toData: function(){
    this.data = [];
    $(this.target).children().each(function(i, ul_node){
      var ul_data = this.parseUl(ul_node);
      $(ul_node).children('li').each(function(i, li_node){
        var li_data = this.parseLi(li_node);
        ul_data["comments"].push(li_data);
      }.bind(this));
      this.data.push(ul_data);
    }.bind(this));
  }

};
