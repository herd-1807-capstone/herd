import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom'
import axios from 'axios'
import '../css/component.css'
import firebase, {API_ROOT} from '../utils/api-config';

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
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { setCurrentUser } from '../reducers/user'

const style = theme => ({
    button: {
        margin: 3*theme.spacing.unit,
        width: 150,
    },
    extendedIcon: {
        marginRight: theme.spacing.unit,
    },
    card: {
        maxWidth: 5245,
        height: 900,
        [theme.breakpoints.up('md')]: {
            marginTop: theme.spacing.unit * 5,
        },
    },
    media: {
        // height: 300,
        width: '100%',
        [theme.breakpoints.up('md')]: {
            // height: 340,
            width: '100%',
        },
    },
    tourDisplay: {
        // marginTop: 60,
        display: 'flex',
        justifyContent: 'center',
        width: '100%'
    },
    dialog: {
        display: 'flex',
        justifyContent: 'center',
    },
  })

class Admin extends Component{

    constructor(props){
        super(props)
        this.state = {
            tour: {
                name: "",
                imgUrl: "defaultGroup.png",
                description: 'This is a fake information for a unreal tour group!',
                creator: "",
            },
            open: false,
            deleteCount: 0,
            access_token: '',
        }

        this.handleDelete = this.handleDelete.bind(this)
    }

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    async handleDelete(evt){
        if(this.state.deleteCount === 3) {
            this.props.history.push('/')
        }

        let msg = document.getElementById('deleteTour').value

        const { access_token, deleteCount } = this.state
        const { currentUser, updateCurrentUser } = this.props
        if(msg !== '' && msg === this.state.tour.name){
            //delete the group, set group members' tour info all to null in users
            let resGroupMember = await axios.get(`${API_ROOT}/users?access_token=${access_token}`)
            let groupMember = resGroupMember.data
            axios.delete(`${API_ROOT}/tours/${currentUser.tour}?access_token=${access_token}`)
            let allDelete = []
            for(let i = 0; i < groupMember.length; i++){
                let deleteFromUser = axios.put(`${API_ROOT}/users/${groupMember[i].uid}?access_token=${access_token}`, {tour: null})
                allDelete.push(deleteFromUser)
            }
            Promise
            .all(allDelete)
            .then(([...userResult])=>{
                updateCurrentUser({...currentUser, tour: null})
            })

        } else {
            this.setState({ open: false, deleteCount: deleteCount+1 });
        }
    }

    async componentDidMount(){

        let access_token = await firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
        const { currentUser, updateCurrentUser } = this.props
        let tourInfo
        if(currentUser.tour){
            tourInfo = await axios.get(`${API_ROOT}/tours/${currentUser.tour}?access_token=${access_token}`)
            tourInfo = tourInfo.data
            if(!tourInfo){
                let newUser = {...currentUser}
                updateCurrentUser(newUser)
            }
            let { tour } = this.state
            this.setState({...this.state,
                tour:{
                    name: tourInfo.name || tour.name,
                    imgUrl: tourInfo.imgUrl || tour.imgUrl,
                    description: tourInfo.description || tour.description,
                    creator: tourInfo.guideUId || tour.creator,
                }, access_token })
        } else {
            this.setState({ access_token })
        }

    }

    render(){
        const { classes, currentUser } = this.props
        const { tour } = this.state
        if(currentUser && currentUser.hasOwnProperty('status') && currentUser.status !== 'admin'){
            this.props.history.push('/')
        }
        if(currentUser.tour){
            return(
                <div className={classes.tourDisplay}>
                    <Card className={classes.card}>
                    <CardActionArea component={Link} to='/admin/group'>
                        <CardMedia
                        component="img"
                        className={classes.media}
                        height="340"
                        image={tour.imgUrl}
                        title={tour.name}
                        />
                        <CardContent>
                        <Typography gutterBottom variant="headline" 
                                    component="h2">
                            {tour.name}
                        </Typography>
                        <Typography component="p" 
                                    align='left' >
                            {tour.description}
                        </Typography>
                        </CardContent>
                    </CardActionArea>

                <div>
                    <Button variant="extendedFab"
                            color="primary"
                            className={classes.button}
                            component={Link} 
                            to='/admin/group'
                            // onClick={this.handleClickOpen}
                    >Members</Button>

                    <Button variant="extendedFab"
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
                        <h4>Type in the group name <ins>{this.state.tour.name}</ins> to confirm delete.</h4>
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
        return(
            <div className={classes.tourDisplay}>
                <div>
                    <Button variant="contained"
                            color="primary"
                            className={classes.button}
                            component={Link}
                            to='/admin/group/create'
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

const mapDispatch = dispatch => {
    return {
        updateCurrentUser: (user) => dispatch(setCurrentUser(user)),
    }
}

Admin.propTypes = {
classes: PropTypes.object.isRequired,
}


export default withRouter(withStyles(style)(connect(mapState, mapDispatch)(Admin)))
