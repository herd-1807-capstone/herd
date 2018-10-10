import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
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
  const { classes, conversation } = props;

  return (
    <List className={classes.root}>
      <ul className={classes.ul}>
        {conversation.map(item => (
          <ListItem key={item.text} divider>
            <Typography color="primary" variant="caption">
              {`${item.fromName} to  ${item.toName}`}
            </Typography>
            <ListItemText primary={`${item.text}`} />
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
