import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom'
import axios from 'axios'
import firebase from '../fire';
// import './component.css'

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';


// import ManageGroup from './ManageGroup'
import {API_ROOT} from '../api-config';

// const LinkToCreateGroup = () => <Link to='/admin/group' />

const style = theme => ({
    button: {
        margin: 3*theme.spacing.unit,
        width: 135,
    },
    extendedIcon: {
        marginRight: theme.spacing.unit,
    },
    card: {
        maxWidth: 5245,
    },
    media: {
        height: 240,
    },
    tourDisplay: {
        margin: 60,
        display: 'flex',
        justifyContent: 'center',
    },
    dialog: {
        display: 'flex',
        justifyContent: 'center',
    }
  })

class Admin extends Component{
    
    constructor(props){
        super(props)
        this.state = {
            tour: {
                name: "",
                imgUrl: "/defaultGroup.png",
                description: 'This is a fake information for a unreal tour group!',
                creator: "",
            },
            open: false,
        }
        this.handleDelete = this.handleDelete.bind(this)
    }

    handleClickOpen = () => {
        this.setState({ open: true });
    };
    
    handleClose = () => {
        this.setState({ open: false });
    };

    handleDelete(evt){
        let msg = document.getElementById('deleteTour').value
        console.log("delete")
        console.log(msg)
        if(msg !== '' && msg === this.state.tour.name){
            //delete the group, set group members' tour info all to 'null' in users
            console.log("OMG! You deleted a group!")
        } else {
            this.setState({ open: false });
        }
    }

    async componentDidMount(){
        let access_token = await firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
      // console.log(access_token)
        let tourInfo = await axios.get(`${API_ROOT}/tours/${this.props.currentUser.tour}?access_token=${access_token}`)
        tourInfo = tourInfo.data
        let { tour } = this.state
        console.log(tourInfo)
        this.setState({...this.state, 
            tour:{
                name: tourInfo.name || tour.name,
                imgUrl: tourInfo.imgUrl || tour.imgUrl,
                description: tourInfo.description || tour.description,
                creator: tourInfo.guideUId || tour.creator,
            }})
    }

    render(){
        console.log("In the admin")
        const { classes, currentUser } = this.props
        const { tour } = this.state
        if(currentUser.hasOwnProperty('tour')){
            console.log("has current user")
            return(
                <div className={classes.tourDisplay}>
                    <Card className={classes.card}>
                    <CardActionArea component={Link} to='/admin/group'>
                        <CardMedia
                        component="img"
                        className={classes.media}
                        height="140"
                        image={tour.imgUrl}
                        title={tour.name}
                        />
                        <CardContent>
                        <Typography gutterBottom variant="headline" component="h2">
                            {tour.name}
                        </Typography>
                        <Typography component="p">
                            {tour.description}
                        </Typography>
                        </CardContent>
                    </CardActionArea>

                <div>
                    <Button variant="contained" 
                            color="primary"  
                            className={classes.button} 
                            onClick={this.handleClickOpen}
                    >Delete</Button>

                    <Button variant="contained" 
                            color="primary"  
                            className={classes.button} 
                            component={Link} 
                            to='/'
                    >Back</Button>
                </div>
                    </Card>
                <div className={classes.dialog}>
                    <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                    >
                    <DialogTitle id="form-dialog-title"><h4>Delete this tour group?</h4></DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                        <h4>Once the tour group deleted, all the data of this group will lose.</h4>
                        <h4>The action CAN NOT be undone.</h4>
                        <h4>Type in the group name to confirm delete.</h4>
                        </DialogContentText>
                        <TextField
                        autoFocus
                        margin="dense"
                        id="deleteTour"
                        label="Type in Tour Name To Delete"
                        fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleDelete} color="primary">
                        Delete
                        </Button>
                        <Button onClick={this.handleClose} color="primary">
                        Cancel
                        </Button>
                    </DialogActions>
                    </Dialog>
                </div>
            </div>
            )
        }
        // console.log(currentUser.hasOwnProperty('tour'))
        return(
            <div className={classes.tourDisplay}>
                <div>
                    <Button variant="contained" 
                            color="primary"  
                            className={classes.button} 
                            component={Link} 
                            to='/admin/group'
                    >Create Group</Button>

                    <Button variant="contained" 
                            color="primary"  
                            className={classes.button} 
                            component={Link} 
                            to='/'
                    >Home</Button>
                </div>
            </div>
        )
    }
}



const mapState = (state) => ({
    currentUser: state.user.currentUser,
})

const mapDispatch = (dispatch) => {

}

Admin.propTypes = {
classes: PropTypes.object.isRequired,
}


export default withRouter(withStyles(style)(connect(mapState, null)(Admin)))