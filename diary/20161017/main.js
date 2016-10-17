var React = require('react');
var ReactDOM = require('react-dom');

// TODO: json
var data = require('./data.js').data;
console.log(data);

var CommentForm = React.createClass({
  getInitialState(){
    return {
      id: null,
      body: '',
      card_id: this.props.card.id,
    }
  },
  handleSubmit(ev){
    ev.preventDefault();
    this.props.onAddComment({id: this.props.comments.length + 1,
                             body: this.state.body,
                             card_id: this.state.card_id});

    this.setState({id: null,
                   body: '',
                   card_id: this.props.card.id})
    return;
  },
  onValueChange(){
    this.setState({id: null,
                   body: this.refs.Body.value,
                   card_id: this.state.card_id});
  }, render() { return (
      <form onSubmit={this.handleSubmit}>
        <span>comment form</span>
        <input type="text" value={this.state.body} ref='Body' onChange={this.onValueChange}/>
        <input type="submit" value='post comment' />
      </form>
    );
  }
});

var Comment = React.createClass({
  render() {
    return (
      <div className='comment' key={this.props.comment.id}>
        <p>{this.props.comment.body}</p>
      </div>
    );
  }
});

var Card = React.createClass({
  render() {
    var commentNodes = this.props.comments.map(function(comment){
      if (comment.card_id === this.props.card.id){
        return <Comment comment={comment}></Comment>;
      }
    }.bind(this));
    return (
      <li className='card' key={this.props.card.id}>
        <span>{this.props.card.title}</span>
        <div className='comments'>
          {commentNodes}
          <CommentForm card={this.props.card} comments={this.props.comments}
                       onAddComment={this.props.onAddComment}></CommentForm>
        </div>
      </li>
    );
  }
});

var CardForm = React.createClass({
  getInitialState(){
    return {
      id: null,
      title: '',
      list_id: this.props.list.id,
    }
  },
  handleSubmit(ev){
    ev.preventDefault();
    if (!this.state.title){
      return;
    }
    this.props.onAddCard({id: this.props.cards.length + 1,
                          title: this.state.title,
                          list_id: this.props.list.id});
    this.setState({id: null, title: '', list_id: this.props.list.id})
  },
  onValueChange(){
    this.setState({id: null, title: this.refs.Title.value, card_id: this.props.list.id});
  }, render() { return (
      <form onSubmit={this.handleSubmit}>
        <span>card form</span>
        <input type="text" value={this.state.title} ref='Title' onChange={this.onValueChange}/>
        <input type="submit" value='add card' />
      </form>
    );
  }
});

var List = React.createClass({
  render() {
    var cardNodes = this.props.cards.map(function(card){
      var rows = []
      if (card.list_id === this.props.list.id){
        return <Card card={card} comments={this.props.comments}
                     onAddComment={this.props.onAddComment}></Card>
      }
    }.bind(this));
    return (
      <div className='list' key={this.props.list.id}>
        <span>{this.props.list.title}</span>
        <ul>{cardNodes}</ul>
        <CardForm cards={this.props.cards} list={this.props.list}
                  onAddCard={this.props.onAddCard} />
      </div>
    );
  }
});

var ListForm = React.createClass({
  getInitialState(){
    return {
      title: '',
    }
  },
  handleSubmit(ev){
    ev.preventDefault();
    if (!this.state.title){
      return;
    }
    this.props.onAddList({id: this.props.lists.length + 1,
                          title: this.state.title});
    this.setState({id: null, title: ''})
  },
  onValueChange(){
    this.setState({id: null, title: this.refs.Title.value});
  }, render() { return (
      <form onSubmit={this.handleSubmit}>
        <span>list form</span>
        <input type="text" value={this.state.title} ref='Title' onChange={this.onValueChange}/>
        <input type="submit" value='add list' />
      </form>
    );
  }
});

var Board = React.createClass({
  getInitialState(){
    return {data: this.props.data};
  },
  onAddList(list) {
    var updatedListData = this.state.data;
    updatedListData.lists.push(list);
    this.setState({data: updatedListData});
  },
  onAddCard(card) {
    var updatedListData = this.state.data;
    updatedListData.cards.push(card);
    this.setState({data: updatedListData});
  },
  onAddComment(comment) {
    var updatedListData = this.state.data;
    updatedListData.comments.push(comment);
    this.setState({data: updatedListData});
  },
  render() {
    var listNodes = this.state.data.lists.map(function(list){
      return <List list={list} cards={this.state.data.cards}
                   comments={this.state.data.comments} onAddCard={this.onAddCard}
                   onAddComment={this.onAddComment}/>
    }.bind(this));
    return (
      <div className='board'>
        {listNodes}
        <ListForm onAddList={this.onAddList} lists={this.state.data.lists}/>
      </div>
    );
  }
});

ReactDOM.render(
  <Board data={data} />,
  document.getElementById('content')
)
