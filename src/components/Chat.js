import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ChatView from './ChatView';
import ChatForm from './ChatForm';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
});

const Chat = ({ classes }) => {
  return (
    <div>
      <Button variant="outlined" color="primary" className={classes.button}>
        Contact a member
      </Button>
      <ChatView />
      <ChatForm />
    </div>
  );
};

Button.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Chat);
