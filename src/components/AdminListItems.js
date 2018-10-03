import React, { Component } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

import PeopleIcon from '@material-ui/icons/People';
import Room from '@material-ui/icons/Room';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AddAlert from '@material-ui/icons/AddAlert';

class AdminListItems extends Component {
  render() {
    return (
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
  }
}

export default AdminListItems;