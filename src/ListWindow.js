import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { connect } from 'react-redux';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close'
import StarIcon from '@material-ui/icons/Star'
import {setSelected} from './reducers/spots';
import InvisibleIcon from '@material-ui/icons/VisibilityOffOutlined';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = theme => ({
  root: {
    position: 'absolute',
    width: '70vw',
    maxWidth: 360,
    overflowY: 'scroll',
    maxHeight: '60vh',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
  closeButton:{
    // justifySelf:'flex-end'
  },
  title:{
    display:'flex',
    justifyContent: 'space-between'
  }
});

class ListWindow extends React.Component {

  panToSelected = (selected, type) => () => {
    const {handleClose, setSelected, map} = this.props
    setSelected(selected);
    if (selected.lat && selected.lng ){
      handleClose(type)();
      const {lat, lng} = selected;
      map.panTo({lat, lng});
      window.infoWindow.setContent(selected && (selected.name || selected.uid));
      window.infoWindow.setPosition({lat, lng})
      window.infoWindow.open(map)
    }
  }
  render() {
    const { classes, handleClose, list, type} = this.props;

    return (
      <div style = {getModalStyle()} className={classes.root}>
        <div className={classes.title}>
        {type === 'usersListWindow' ? <h2>
          Find other members
        </h2> : <h2>
          Find places
        </h2>}
          <IconButton className={classes.closeButton}
            onClick = {handleClose(type)}>
            <CloseIcon />
          </IconButton>
        </div>
        <List>
          {list.map(item=> (
            <ListItem
              key={item.uid}
              dense
              button
              onClick = {this.panToSelected(item, type)}
            className={classes.listItem}>
              <Avatar alt={item.name} src={item.imgUrl || '#'} />
          {type === 'usersListWindow' &&
            item.status === 'admin' ?
          <div className={classes.title}>
            <ListItemText primary={item.name} />
            <StarIcon />
          </div>
            : <ListItemText primary={item.name} />
          }
            {
              type === 'usersListWindow' && (!item.visible || !item.lat || !item.lng)? <InvisibleIcon /> : null
            }
            {
              type === 'usersListWindow' && item.loggedIn ? <div className= 'online'></div> : null
            }
            </ListItem>

          ))}
        </List>
      </div>
    );
  }
}

ListWindow.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateUsers = ({user, googlemap}) => ({
  list: user.list,
  type:'usersListWindow',
  map: googlemap.map,
})

const mapStateSpots = ({spots, googlemap}) => ({
  list: spots.list,
  type:'spotsListWindow',
  map: googlemap.map
})

const mapDispatch = dispatch => ({
  setSelected(selected){
    dispatch(setSelected(selected))
  }
})

export const UsersListWindow =withStyles(styles)(connect(mapStateUsers, mapDispatch)(ListWindow));
export const SpotsListWindow =withStyles(styles)(connect(mapStateSpots, mapDispatch)(ListWindow));
