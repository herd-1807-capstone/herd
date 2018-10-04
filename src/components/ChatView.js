import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 150,
  },
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
});

function ChatView(props) {
  const { classes } = props;

  return (
    <List className={classes.root}>
      <ul className={classes.ul}>
        {[0, 1, 2].map(item => (
          <ListItem key={`item-${sectionId}-${item}`}>
            <ListItemText primary={`Item ${item}`} />
          </ListItem>
        ))}
      </ul>
    </List>
  );
}

ChatView.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChatView);
