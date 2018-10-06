import React, {Fragment} from 'react';

import { Paper } from '@material-ui/core';
import {withStyles} from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button'

const styles = {
  root:{
    // padding: 10,
    height: '35vh',
    position: 'fixed',
    overflowY: 'scroll',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  heading:{
    margin: 0
  },
  buttons:{
    display:'flex',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  content: {

    display: 'flex',
    flexDirection: 'column',
    flex:3
  },
  imageDiv:{
    flex: 1,
    paddingLeft: 10,
  },
  image:{
    objectFit: 'cover',
    height:'20vh'
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

  handleRemove = () =>{
    // this.props.removeSpot
  }

  handleEdit = () => {

  }
  render() {

    const {classes, selected, defaultSelected, currentUser} = this.props

    console.log(selected);
    if (!selected && defaultSelected){
      return (
        <Paper className={classes.root}>
          <div className = {classes.image}>
            <img src = {'#'} />
          </div>
          <div className = {classes.content}>
            <h2 className = {classes.heading}>{defaultSelected.name}</h2>
            <p>{defaultSelected.description}</p>
            {
             currentUser.status === 'admin' ?
            <div className = {classes.buttons}>
              <Button
                color='secondary'
                variant= "outlined"
                onClick={this.handleDelete}
                >
                Remove
              </Button>
              <Button
                color='primary'
                variant= "outlined"
                onClick={this.handleEdit}
                >
                Edit
              </Button>
            </div> : null}
          </div>
        </Paper>
      )
    }
    else if (selected && selected.name){
        return (
        <Paper className={classes.root}>
          <div className = {classes.imageDiv}>
            <img className = {classes.image}
            src = {selected.imgUrl || '#'} />
          </div>
           <div className = {classes.content}>
             <h2 className = {classes.heading}>{selected.name || selected.uid}</h2>
           {selected && selected.type === 'spot' ?
           (<Fragment>
              <p>{selected.description}</p>
           </Fragment>) :
            (<Fragment>
              <p>{selected.status}</p>
              <p>{selected.email}</p>
            </Fragment>)}
            {
             currentUser.status === 'admin' ?
            <div className = {classes.buttons}>
              <Button
                color='secondary'
                variant= "outlined"
                onClick={this.handleDelete}
                >
                Remove
              </Button>
              <Button
                color='primary'
                variant= "outlined"
                onClick={this.handleEdit}
                >
                Edit
              </Button>
            </div> : null}
           </div>
        </Paper>)
    }
    return (
      <Paper className={classes.root}>
        <p>Nothing to see here.</p>
      </Paper>
    )
  }
}
BottomSheet.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapState = ({spots, user}) => ({
  selected: spots.selected,
  defaultSelected: spots.list[0],
  currentUser: user.currentUser,
  spots: spots.list
})

export default withStyles(styles)(connect(mapState)(BottomSheet));
