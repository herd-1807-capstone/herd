import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { addMessage } from '../reducers/chat';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  dense: {
    marginTop: 16,
  },
  menu: {
    width: 200,
  },
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
});

class ChatForm extends Component {
  state = {
    text: '',
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
      <form className={classes.container}>
        <TextField
          id="outlined-textarea"
          label="Multiline Placeholder"
          multiline
          className={classes.textField}
          onChange={this.handleChange}
          margin="normal"
          variant="outlined"
        />
        <Button
          size="small"
          className={classes.button}
          onClick={this.handleClick}
        >
          Send
        </Button>
      </form>
    );
  }
}

ChatForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({
  addNewMessage() {
    dispatch(addMessage());
  },
});

export default withStyles(styles)(
  connect(
    null,
    mapDispatch(ChatForm)
  )
);
