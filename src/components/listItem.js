import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

import RecordVoiceOver from '@material-ui/icons/RecordVoiceOver';
import PeopleIcon from '@material-ui/icons/People';
import Room from '@material-ui/icons/Room';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Announcement from '@material-ui/icons/Announcement';
import AddAlert from '@material-ui/icons/AddAlert';
import Divider from '@material-ui/core/Divider';

export const userListItems = (
  <div>
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
    <ListItem button>
      <ListItemIcon>
        <Announcement />
      </ListItemIcon>
      <ListItemText primary="Info on a Spot" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <RecordVoiceOver />
      </ListItemIcon>
      <ListItemText primary="Start a Chat" />
    </ListItem>
  </div>
);

export const adminListItems = (
  <div>
    <ListSubheader inset>Tour guide functions</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Create a Tour" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Add/Update a Group" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <Room />
      </ListItemIcon>
      <ListItemText primary="Add/Update a Spot" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <Room />
      </ListItemIcon>
      <ListItemText primary="Define Boundaries" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AddAlert />
      </ListItemIcon>
      <ListItemText primary="Group Signal" />
    </ListItem>
  </div>
);
