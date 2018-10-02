import React from 'react';

import { Paper } from '@material-ui/core';
import {withStyles} from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { findSelectedMarker} from './reducers/spots'

const styles = {
  root:{
    height: '35vh',
    position: 'fixed',
    overflowY: 'scroll',
    width: '100vw'
  },
  heading:{
    margin: 0
  }
}

class BottomSheet extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      open: true,
    };
  }

  toggle = () => {
    this.setState({
      open: !this.state.open,
    });
  };

  render() {

    const {classes, selected, defaultSelected} = this.props
    let type;

    if (!selected){
      return (
        <Paper className={classes.root}>
          <h1 className = {classes.heading}>{defaultSelected.name}</h1>
          <p>{defaultSelected.description}</p>
        </Paper>
      )
    }
    if (selected.spot) type = 'spot';
    if (selected.user) type = 'user';

    if (type === 'spot' && selected.spot && selected.spot.name){
    return (
        <Paper className={classes.root}>
          <h1 className = {classes.heading}>{selected.spot.name}</h1>
          <p>{selected.spot.description}</p>
        </Paper>
      )}
    if (type === 'user' && selected.user && selected.user.name){
      return (
        <Paper className={classes.root}>
          <h1 className = {classes.heading}>{selected.user.name}</h1>
          <p>{selected.user.status}</p>
          <p>{selected.user.email}</p>
        </Paper>
      )
    }
    return (
      <Paper className={classes.root}>
        <h1 className = {classes.heading}>{defaultSelected.name}</h1>
        <p>{defaultSelected.description}</p>
      </Paper>
    )
  }
}
BottomSheet.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapState = ({spots, user}) => ({
  selected: spots.selected && findSelectedMarker(spots.selected, spots.list, user.list),
  defaultSelected: spots.list[0] || {name: 'Spot 1', description: 'spot'}
})

export default withStyles(styles)(connect(mapState)(BottomSheet));
