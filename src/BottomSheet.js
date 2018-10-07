import React, {Fragment} from 'react';

import { Paper } from '@material-ui/core';
import {withStyles} from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button'
import {removeSpotThunk, editSpotThunk, setSelected} from './reducers/spots'
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


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
      editFormOpen: false,
      removeDialogOpen: false,
      removeSuccess: false,
      editSuccess: false,
      name: '',
      description: '',
      imgUrl: '',
    };
  }
  handleOpen = (type) => () => {
    console.log(this.props);

    this.setState({
      [type]: true,
      editSuccess: false,
      removeSuccess: false,
      name: this.props.selected.name,
      description: this.props.selected.description
    })
  }

  handleClose= (type) => () => {
    this.setState({
      [type]: false,
    })
  }
  handleChange = (evt) => {
    this.setState({
      [evt.target.name]: evt.target.value
    })
  }

  handleRemove = async() =>{
    const spotId = this.props.selected.uid;
    try {
      let status = await this.props.removeSpot(spotId);
      if (status === 201){
        this.setState({
          removeSuccess: true
        })
        this.props.reselect(null);
      }
    } catch (error) {
      console.error(error)
    }
  }
  handleEdit = async() => {
    const spot = this.props.selected;
    const { name, description, imgUrl} = this.state;
    const updatedInfo = {
      ...spot,
      name,
      description,
      imgUrl
    }
    try {
      let status = await this.props.editSpot(updatedInfo);
      if (status === 201){
        this.setState({
          editSuccess: true
        })
        this.props.reselect(updatedInfo);
      }
    } catch (error) {
      console.error(error)
    }
  }

  render() {

    let {classes, selected, currentUser} = this.props

    if (selected && selected.name){
        return (
        <div>
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
              { selected && selected.type === 'spot' &&
               currentUser.status === 'admin' ?
              <div className = {classes.buttons}>
                <Button
                  color='secondary'
                  variant= "outlined"
                  onClick={this.handleOpen('removeDialogOpen')}
                  >
                  Remove
                </Button>
                <Button
                  color='primary'
                  variant= "outlined"
                  onClick={this.handleOpen('editFormOpen')}
                  >
                  Edit
                </Button>
              </div> : null}
             </div>
          </Paper>
          <Dialog
            open={this.state.editFormOpen || this.state.removeDialogOpen}
            onClose={this.handleClose((this.state.editFormOpen && 'editFormOpen')|| (this.state.removeDialogOpen && 'removeDialogOpen'))}
            aria-labelledby="form-dialog-title"
            >
            {this.state.editFormOpen ?
                (!this.state.editSuccess?
                  (<Fragment>
                    <DialogTitle id="form-dialog-title">Edit a spot</DialogTitle>
                    <DialogContent>
                      <TextField
                        required = {true}
                        autoFocus
                        margin="dense"
                        label="Name"
                        name = "name"
                        fullWidth
                        value={this.state.name}
                        onChange={this.handleChange}
                      />
                      <TextField
                        required = {true}
                        autoFocus
                        margin="dense"
                        label="Description"
                        name = "description"
                        fullWidth
                        value={this.state.description}
                        onChange = {this.handleChange}
                      />
                      <TextField
                        type = 'url'
                        autoFocus
                        margin="dense"
                        label="Image url"
                        name = "imgUrl"
                        fullWidth
                        value={this.state.imgurl}
                        onChange = {this.handleChange}
                      />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={this.handleClose('editFormOpen')} color="primary">
                      Cancel
                    </Button>
                    <Button onClick={this.handleEdit} color="primary">
                      Save
                    </Button>
                  </DialogActions>
                  </Fragment>)
                : <h1 className = 'success'>Spot edited!</h1> )
            : null
            }

            {
              this.state.removeDialogOpen ?
                (!this.state.removeSuccess ? (
                  (<Fragment>
                    <DialogTitle id="alert-dialog-title">{"Remove a spot?"}</DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          If you click OK, the spot you have selected will be removed.
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={this.handleClose('removeDialogOpen')} color="primary">
                          Cancel
                        </Button>
                        <Button onClick={this.handleRemove} color="primary" autoFocus>
                          OK
                        </Button>
                    </DialogActions>
                  </Fragment>)
                ) : <h1 className = 'success'>Spot removed!</h1>)
              : null
            }
        </Dialog>
        </div>
        )
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
  selected: spots.selected || spots.list[0],
  currentUser: user.currentUser,
  spots: spots.list
})

const mapDispatch = (dispatch) => ({
  async removeSpot(spotId){
    return await dispatch(removeSpotThunk(spotId))
  },
  async editSpot(updatedInfo){
    return await dispatch(editSpotThunk(updatedInfo))
  },
  reselect(selected){
    dispatch(setSelected(selected))
  }
})

export default withStyles(styles)(connect(mapState, mapDispatch)(BottomSheet));
