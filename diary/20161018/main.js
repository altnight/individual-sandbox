var React = require('react');
var ReactDOM = require('react-dom');

// TODO: json
var data = require('./data.js').data; console.log(data);

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
    this.props.onAddComment({
      id: this.props.comments.length + 1,
      body: this.state.body,
      card_id: this.state.card_id
    });

    this.setState({
      id: null,
      body: '',
      card_id: this.props.card.id
    })
  },
  onValueChange(){
    this.setState({
      id: null,
      body: this.refs.Body.value,
      card_id: this.state.card_id
    });
  }, render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <span>comment form</span>
        <input type="text" value={this.state.body} ref='Body' onChange={this.onValueChange}/>
        <input type="submit" value='post comment'/>
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
    var commentNodes = this.props.comments.map(function (comment) {
      if (comment.card_id === this.props.card.id) {
        return (<Comment comment={comment}></Comment>);
      }
    }.bind(this));
    return (
      <li className='card' key={this.props.card.id}>
        <span>{this.props.card.title}</span>
        <div className='comments'>
          {commentNodes}
          <CommentForm card={this.props.card} comments={this.props.comments}
                       onAddComment={this.props.onAddComment}/>
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
    if (!this.state.title) {
      return;
    }
    this.props.onAddCard({
      id: this.props.cards.length + 1,
      title: this.state.title,
      list_id: this.props.list.id
    });
    this.setState({id: null, title: '', list_id: this.props.list.id})
  },
  onValueChange(){
    this.setState({id: null, title: this.refs.Title.value, card_id: this.props.list.id});
  }, render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <span>card form</span>
        <input type="text" value={this.state.title} ref='Title' onChange={this.onValueChange}/>
        <input type="submit" value='add card'/>
      </form>
    );
  }
});

var List = React.createClass({
  onDeleteList(){
    this.props.onDeleteList(this.props.list.id);
  },
  render() {
    var cardNodes = this.props.cards.map(function (card) {
      if (card.list_id === this.props.list.id) {
        return <Card card={card} comments={this.props.comments}
                     onAddComment={this.props.onAddComment}/>
      }
    }.bind(this));
    return (
      <div className='list' key={this.props.list.id}>
        <span>{this.props.list.title}</span>
        <ul>{cardNodes}</ul>
        <CardForm cards={this.props.cards} list={this.props.list}
                  onAddCard={this.props.onAddCard}/>
        <input type="button" onClick={this.onDeleteList} value="delete this list."/>
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
  handleSubmit(ev){ ev.preventDefault();
    if (!this.state.title) {
      return;
    }
    list_sequence++;
    this.props.onAddList({
      //id: this.props.lists.length + 1,
      id: list_sequence,
      title: this.state.title
    });
    this.setState({id: null, title: ''})
  },
  onValueChange(){
    this.setState({id: null, title: this.refs.Title.value});
  }, render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <span>list form</span>
        <input type="text" value={this.state.title} ref='Title' onChange={this.onValueChange}/>
        <input type="submit" value='add list'/>
      </form>
    );
  }
});

var Board = React.createClass({
  getInitialState(){
    return {data: this.props.data};
  },
  _pushState(target, obj) {
    this.state.data[target].push(obj);
    this.setState({data: this.state.data});
  },
  _popState(target, id){
    this.state.data[target] = this.state.data.lists.filter(function (item) {
      if (item.id !== id) {
        return item;
      }
    });
    this.setState({data: this.state.data});
  },
  onAddList(list) {
    this._pushState('lists', list)
  },
  onAddCard(card) {
    this._pushState('cards', card)
  },
  onAddComment(comment) {
    this._pushState('comments', comment)
  },
  onDeleteList(list_id) {
    this._popState('lists', list_id);
  },
  render() {
    var listNodes = this.state.data.lists.map(function (list) {
      return <List list={list} cards={this.state.data.cards}
                   comments={this.state.data.comments} onAddCard={this.onAddCard}
                   onAddComment={this.onAddComment} onDeleteList={this.onDeleteList} />
    }.bind(this));
    return (
      <div className='board'>
        {listNodes}
        <ListForm onAddList={this.onAddList} lists={this.state.data.lists}/>
      </div>
    );
  }
});

var list_sequence = data.lists.length;

ReactDOM.render(
  <Board data={data}/>,
  document.getElementById('content')
);
