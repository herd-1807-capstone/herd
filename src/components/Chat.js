import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getConversation } from '../reducers/chat';

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
    this.setState({ open: true });
  };
  handleClose = (value, selectedUid) => {
    this.setState({ value, selectedUid, open: false }, () =>
      this.props.fetchConversation(this.state.selectedUid)
    );
    console.log('props after conversation', this.props);
  };

  handleChange = event => {
    this.setState({
      text: event.target.value,
    });
  };

  handleClick = () => {};

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
        <ChatForm selectedName={this.state.value} />
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
});

export default withStyles(styles)(
  connect(
    mapState,
    mapDispatch
  )(Chat)
);
