import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import firebase from '../utils/api-config';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { setCurrentUser } from '../reducers/user'


import {API_ROOT} from '../utils/api-config';

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        height: 'fitContent',
        width: '100%',
        
    },
    subRoot:{
        display: 'flex',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
    },
    paperBack: {
        width: '100%',
        height: '100%',
        maxWidth: 414,
        backgroundColor: theme.palette.background.paper,
        marginTop: theme.spacing.unit * 20,
    },
    button: {
        margin: theme.spacing.unit * 5,
        width: 80,
    },
    extendedIcon: {
        marginRight: theme.spacing.unit,
    },
    avatarBlue: {

        backgroundColor: '#536DFE'
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
          backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          marginLeft: theme.spacing.unit,
          width: 'auto',
        },
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        marginTop: theme.spacing.unit,
        paddingTop: theme.spacing.unit * 2,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit,
        transition: theme.transitions.create('width'),
        width: '85%',
        [theme.breakpoints.up('sm')]: {
        width: 320,
        '&:focus': {
            width: 310,
            },
        },
        [theme.breakpoints.up('md')]: {
            width: 320,
            '&:focus': {
                width: 310,
                },
            },
        backgroundColor: '#EEEEEE',
    },
    addButton: {
        margin: theme.spacing.unit,
        width: 45,
        // height: 20,
        [theme.breakpoints.up('sm')]: {
            width: 40,
            },
    },
    searchBar: {
        display: 'flex',
        flexDirection: 'row',
    },
    cTitle: {
        display: 'flex',
        alignItem: 'center',
    },
    cLabel: {
        width: '100%'
    }
});
function TabContainer(props) {
    return (
      <Typography component="div" style={{ padding: 8 * 3 }}>
        {props.children}
      </Typography>
    );
  }

  TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
  };


class ManageGroup extends React.Component {

constructor(props){
    super(props)
    this.state = {
        groupys: [],
        access_token: "",
        changedUser:[],
        // value: 0,
        open: false,
        inputText: "",
        warning: "",
        includeMe: false,
      }

    this.handleSave = this.handleSave.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.handleInput = this.handleInput.bind(this)
    this.handleAddUser = this.handleAddUser.bind(this)
    this.handleRemoveUser = this.handleRemoveUser.bind(this)
  }

  async componentDidMount(){
    let access_token = await firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
    if(this.props.currentUser.tour){
        let resGroupys = await axios.get(`${API_ROOT}/users?access_token=${access_token}`)
        let groupys = resGroupys.data
        if(groupys && groupys.length > 0 && !groupys[0].hasOwnProperty('tour')){
            groupys = []
        }
        this.setState({...this.state,
                        groupys,
                        access_token,
                    })
    }
  }

  handleRemoveUser = user => () => {
    let hasChanged = false
    let newChangeUser = this.state.changedUser.filter((cUser)=>{
        if(cUser.uid === user.uid){
            hasChanged = true
            return false
        } else {
            return true
        }
    })
    if(!hasChanged){
        let newUser = {...user, tour: null}
        newChangeUser.push(newUser)
    }
    let newGroupys = this.state.groupys.filter((gUser)=>{
        return gUser.uid !== user.uid
    })
    let includeMe = this.state.includeMe
    if(user.uid === this.props.currentUser.uid){
        includeMe = true
    }
    this.setState({...this.state, groupys: newGroupys, changedUser: newChangeUser, includeMe})
  }

  handleSave = async (evt) => {
    const { currentUser, setCurrentUser } = this.props
    const { access_token, changedUser, includeMe } = this.state
    try {
        for(let i = 0; i < changedUser.length; i++){
            let user = changedUser[i]
            // update tour's users property
            if(user && user.tour){
                let putTour = await axios.post(`${API_ROOT}/tours/${currentUser.tour}/users?access_token=${access_token}`, {userId: user.uid})
            } else {
                user.tour = null
                await axios.delete(`${API_ROOT}/tours/${currentUser.tour}/users/${user.uid}?access_token=${access_token}`)
            }
            // update user's 'tour' property
            let putUser = await axios.put(`${API_ROOT}/users/${user.uid}?access_token=${access_token}`, {tour: user.tour})
        }

        this.setState({...this.state, changedUser: []})
        if(includeMe){
            setCurrentUser({...currentUser, tour: null})
        }
    } catch (error) {
        console.error(error)
    }
  }

  handleLeave = () =>{
    this.props.history.push('/admin')
  }

  handleBack = () => {
    if(this.state.changedUser.length === 0){
        this.handleLeave()
    } else {
        this.handleClickOpen()
    }
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleInput(evt){
      this.setState({...this.state, inputText: evt.target.value})
  }

  handleAddUser = async (evt) => {
    const { access_token, changedUser, inputText, groupys } = this.state
    const { currentUser } = this.props
    try {
        if(inputText !== ''){
            let resUser = await axios.get(`${API_ROOT}/users/email/${inputText}?access_token=${access_token}`)
            let user = resUser.data
            if(user){
                let newUser = {...user, tour: currentUser.tour}
                let isExist = false
                changedUser.forEach((cUser)=>{
                    if(cUser.uid === user.uid){
                        isExist = true
                    }
                })
                if(!isExist){
                    let includeMe = this.state.includeMe
                    if(user.uid === this.props.currentUser.uid){
                        includeMe = true
                    }
                    this.setState({...this.state, groupys: [...groupys, newUser], changedUser: [...changedUser, newUser], inputText: '', includeMe})
                }
            } else {
                this.setState({...this.state, warning: 'User not found or already in a tour.', inputText: ''})
            }
        }
    } catch (error) {
        this.setState({...this.state, warning: 'User not found or already in a tour.'})
        console.error(error)
    }
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, currentUser } = this.props;
    const { groupys, value } = this.state;
    if(!currentUser.tour){
        this.props.history.push('/admin')
    }

    return (
      <div className={classes.subRoot}>
        <Paper className={classes.paperBack} elevation={3}>
        <div className={classes.root}>
        <AppBar position="static" className={classes.cTitle}>
        {/* <Tabs value={value} onChange={this.handleChange}> */}
            <Tab label="Group Members" className={classes.cLabel} />

            {/* <Tab label="No Group Members" /> */}
        {/* </Tabs> */}
        </AppBar>
        <div className={classes.searchBar} >
            <Button variant="fab" mini color="secondary" 
                    aria-label="Add" onClick={this.handleAddUser} 
                    className={classes.addButton}>
            <AddIcon />
            </Button>
            <div className={classes.search}>
                <InputBase
                    placeholder="Search by Email…"
                    type='email'
                    classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                    }}
                    onChange={this.handleInput}
                    value = {this.state.inputText}
                />
            </div>
        </div>
        <label>
            <font color="red">
                {this.state.warning}
            </font>
        </label>
        <TabContainer>
            <List>
          {Object.values(groupys).map(user => (
            <div key={user.name}>
            <ListItem key={user.uid} dense button className={classes.listItem}>
                {(user.hasOwnProperty('imgUrl'))
                ?
                <Avatar src={user.imgUrl} />
                :
                <Avatar className={classes.avatarBlue} ><AccountCircle/></Avatar>}
                <ListItemText primary={`${user.name}`} />
                <ListItemSecondaryAction>
                <IconButton aria-label="Delete"
                            color="secondary"
                            className={classes.addButton}
                            onClick={this.handleRemoveUser(user)}
                >
                <DeleteIcon fontSize="small" />
                </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
              <Divider />
            </div>
          ))}
        </List>
        </TabContainer>
        {/* {value === 1 && <TabContainer>
            <List>
          {Object.values(freeBirds).map(user => (
            <div key={user.uid}>
            <ListItem key={user.uid} dense button className={classes.listItem}>
            {(user.hasOwnProperty('imgUrl'))
              ?
              <Avatar src={user.imgUrl} sizes={'30'} />
              :
              <Avatar className={classes.avatarBlue} ><AccountCircle/></Avatar>
              }
              <ListItemText primary={`${user.name}`} />
              <ListItemSecondaryAction>
                <Checkbox
                  onChange={this.handleToggle(user)}
                  checked={user.hasOwnProperty('tour')}
                />
              </ListItemSecondaryAction>
            </ListItem>
              <Divider />
            </div>
          ))}
        </List>
        </TabContainer>} */}
      </div>


        <Button variant="extendedFab" 
                onClick={this.handleSave} 
                color="primary" 
                className={classes.button} >
            Save
        </Button>
        <Button variant="extendedFab" 
                onClick={this.handleBack} 
                color="primary" 
                className={classes.button} >
            Back
        </Button>

        </Paper>

        <div>
            <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            >
            <DialogTitle id="alert-dialog-title">{"Leave Without Save?"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                Would you like to leave the page without saving the change?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={this.handleLeave} color="primary">
                Leave
                </Button>
                <Button onClick={this.handleClose} color="primary" autoFocus>
                Cancel
                </Button>
            </DialogActions>
            </Dialog>
        </div>
      </div>
    );
  }
}

ManageGroup.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapState = (state) => ({
    currentUser: state.user.currentUser,
})

const mapDispatch = (dispatch) => ({
    setCurrentUser: (user) => dispatch(setCurrentUser(user))
})

export default connect(mapState, mapDispatch)(withStyles(styles)(ManageGroup));
