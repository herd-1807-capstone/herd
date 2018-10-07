import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import purple from '@material-ui/core/colors/purple';

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
});

function LoadingState(props) {
  const { classes } = props;
  return (
    <div className='loadingState'>
      <CircularProgress className={classes.progress} color="secondary" size={150} thickness={7} />
    </div>
  );
}

LoadingState.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoadingState);