import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

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

const ChatForm = ({
  classes,
  handleChange,
  handleClick,
  selectedName,
  textMessage,
}) => {
  return (
    <form className={classes.container}>
      <TextField
        id="outlined-textarea"
        label={`To: ${selectedName || ''}`}
        value={textMessage}
        multiline
        className={classes.textField}
        onChange={handleChange}
        margin="normal"
        variant="outlined"
      />
      <Button size="small" className={classes.button} onClick={handleClick}>
        Send
      </Button>
    </form>
  );
};

ChatForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChatForm);
