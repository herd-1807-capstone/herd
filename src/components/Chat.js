import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getConversation,
  addNewMessage,
  clearConversation,
} from '../reducers/chat';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ChatView from './ChatView';
import ChatForm from './ChatForm';
import ChatDialogUserList from './ChatDialogUserList';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    width: '80%',
    maxHeight: 435,
  },
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
});

class Chat extends Component {
  state = { value: '', selectedUid: '', text: '', open: false };

  handleClickOpen = () => {
    this.setState({ open: true }, () => this.props.clearList());
  };

  handleClose = (value, selectedUid) => {
    this.setState({ value, selectedUid, open: false }, () =>
      this.props.fetchConversation(this.state.selectedUid)
    );
  };

  handleChange = event => {
    event.preventDefault();
    this.setState({
      text: event.target.value,
    });
  };

  handleClick = () => {
    this.props.setNewMessage(this.state.selectedUid, this.state.text);
    this.setState({ text: '' }, () =>
      this.props.fetchConversation(this.state.selectedUid)
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Button
          variant="outlined"
          color="primary"
          className={classes.button}
          onClick={this.handleClickOpen}
        >
          Contact a member
        </Button>
        <ChatDialogUserList
          open={this.state.open}
          onClose={this.handleClose}
          value={this.state.value}
        />
        <ChatView conversation={this.props.conversation} />
        <ChatForm
          selectedName={this.state.value}
          handleChange={this.handleChange}
          handleClick={this.handleClick}
          textMessage={this.state.text}
        />
      </div>
    );
  }
}

Button.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapState = ({ chat, user }) => ({
  conversation: chat.conversation,
  currentUser: user.currentUser,
});

const mapDispatch = dispatch => ({
  fetchConversation(toId) {
    dispatch(getConversation(toId));
  },
  setNewMessage(toId, text) {
    dispatch(addNewMessage(toId, text));
  },
  clearList() {
    dispatch(clearConversation());
  },
});

export default withStyles(styles)(
  connect(
    mapState,
    mapDispatch
  )(Chat)
);
