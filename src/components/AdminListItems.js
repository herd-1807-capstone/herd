import React, { Component } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

import PeopleIcon from '@material-ui/icons/People';
import Room from '@material-ui/icons/Room';
import AddAlert from '@material-ui/icons/AddAlert';

class AdminListItems extends Component {
  constructor(props){
    super(props)

    this.handleToGroup = this.handleToGroup.bind(this)
  }
  handleToGroup(evt){
    console.log(this.props.props.history)
    this.props.props.history.push('/admin')
  }

  render() {
    return (
      <div>
        <ListSubheader inset>Tour guide functions</ListSubheader>
        {/* <ListItem button>
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="Create a Tour" />
        </ListItem> */}
        <ListItem button onClick={this.handleToGroup} >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Group Management" />
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
        <ListItem button onClick={this.props.showAnnouncementModal}>
          <ListItemIcon>
            <AddAlert />
          </ListItemIcon>
          <ListItemText primary="Announcement" />
        </ListItem>
      </div>
    );
  }
}

export default AdminListItems;
