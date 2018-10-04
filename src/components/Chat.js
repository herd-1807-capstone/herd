import React, { Component } from 'react';
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
  state = { open: false, value: 'Dione' };

  handleClickOpen = () => {
    this.setState({ open: true });
  };
  handleClose = value => {
    this.setState({ value, open: false });
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
        <ChatView />
        <ChatForm />
      </div>
    );
  }
}

Button.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Chat);
