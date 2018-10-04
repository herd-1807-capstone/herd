import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import RecordVoiceOver from '@material-ui/icons/RecordVoiceOver';
import PeopleIcon from '@material-ui/icons/People';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Announcement from '@material-ui/icons/Announcement';
import AddAlert from '@material-ui/icons/AddAlert';
import AllOut from '@material-ui/icons/AllOut';
import Divider from '@material-ui/core/Divider';

const UserListItems = props => {
  return (
    <div>
      <ListItem button onClick = {props.handleRecenter}>
        <ListItemIcon>
          <AllOut />
        </ListItemIcon>
        <ListItemText primary="Recenter" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <AddAlert />
        </ListItemIcon>
        <ListItemText primary="Emergency Signal" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Add a Spot" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <VisibilityOff />
        </ListItemIcon>
        <ListItemText primary="Visibility on Map" />
      </ListItem>
      <Divider />
      <ListItem button onClick={props.handleInfoSpot}>
        <ListItemIcon>
          <Announcement />
        </ListItemIcon>
        <ListItemText primary="Info on a Spot" />
      </ListItem>
      <ListItem button onClick={props.handleChatStart}>
        <ListItemIcon>
          <RecordVoiceOver />
        </ListItemIcon>
        <ListItemText primary="Start a Chat" />
      </ListItem>
    </div>
  );
};

export default UserListItems;
