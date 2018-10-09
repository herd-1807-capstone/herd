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
import firebase from '../fire';
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


import {API_ROOT} from '../api-config';

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    subRoot:{
        display: 'flex',
        justifyContent: 'center',
    },
    paperBack: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    button: {
        margin: 2*theme.spacing.unit,
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
        width: '100%',
        [theme.breakpoints.up('sm')]: {
        width: 250,
        '&:focus': {
            width: 240,
            },
        },
        backgroundColor: '#EEEEEE',
    },
    addButton: {
        margin: theme.spacing.unit,
    },
    searchBar: {
        display: 'flex',
        flexDirection: 'row',
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
        value: 0,
        open: false,
        inputText: ""
      }

    this.handleSave = this.handleSave.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.handleInput = this.handleInput.bind(this)
    this.handleAddUser = this.handleAddUser.bind(this)
    this.handleRemoveUser = this.handleRemoveUser.bind(this)
  }

  async componentDidMount(){
    let access_token = await firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
    let resGroupys = await axios.get(`${API_ROOT}/users?access_token=${access_token}`)
    let groupys = resGroupys.data
    if(groupys && groupys.length > 0 && groupys[0].hasOwnProperty('tour') && groupys[0].tour === 'null'){
        groupys = []
    }
    this.setState({...this.state,
                    groupys,
                    access_token,
                })
  }

  handleRemoveUser = user => () => {
    console.log(user)
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
        let newUser = {...user, tour: 'null'}
        newChangeUser.push(newUser)
    }
    let newGroupys = this.state.groupys.filter((gUser)=>{
        return gUser.uid !== user.uid
    })
    this.setState({...this.state, groupys: newGroupys, changedUser: newChangeUser})
  }

  handleSave = async (evt) => {
    const { currentUser } = this.props
    const { access_token, changedUser } = this.state
    try {
        for(let i = 0; i < changedUser.length; i++){
            let user = changedUser[i]
            // update tour's users property
            console.log(user)
            if(user.hasOwnProperty('tour') && user.tour !== 'null'){
                let putTour = await axios.post(`${API_ROOT}/tours/${currentUser.tour}/users?access_token=${access_token}`, {userId: user.uid})
                console.log(`Put the tour!!!${putTour}`)
            } else {
                user.tour = 'null'
                await axios.delete(`${API_ROOT}/tours/${currentUser.tour}/users/${user.uid}?access_token=${access_token}`)
            }
            // update user's 'tour' property
            let putUser = await axios.put(`${API_ROOT}/users/${user.uid}?access_token=${access_token}`, {tour: user.tour})
            console.log("update user", putUser)
            console.log(currentUser.tour)
            console.log("Check!")
        }
        this.setState({...this.state, changedUser: []})

    } catch (error) {
        console.error(error)
    }
  }

  handleLeave = () =>{
    this.props.history.push('/admin')
  }

  handleBack = () => {
    console.log(this.state.changedUser.length)
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
            console.log(`Get the user!!!`)
            console.log(user)
            if(user){
                console.log("update local state")
                let newUser = {...user, tour: currentUser.tour}
                let isExist = false
                changedUser.forEach((cUser)=>{
                    if(cUser.uid === user.uid){
                        isExist = true
                    }
                })
                if(!isExist){
                    this.setState({...this.state, groupys: [...groupys, newUser], changedUser: [...changedUser, newUser], inputText: ''})
                }
            } else {
                this.setState({...this.state, inputText: 'User not exsit'})
            }
        }
    } catch (error) {
        this.setState({...this.state, inputText: error})
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
    const { classes } = this.props;
    const { groupys, freeBirds, cancelButtonText, value } = this.state;
    // console.log(this.state.groupys)
    // console.log(this.state.freeBirds)

    return (
      <div className={classes.subRoot}>
        <Paper className={classes.paperBack} elevation={3}>
        <div className={classes.root}>
        <AppBar position="static">
        <Tabs value={value} onChange={this.handleChange}>
            <Tab label="Group Members" />
            <Tab label="No Group Members" />
        </Tabs>
        </AppBar>
        <div className={classes.searchBar} >
            <Button variant="fab" mini color="secondary" aria-label="Add" onClick={this.handleAddUser} className={classes.addButton}>
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

        {value === 0 && <TabContainer>
            <List>
          {Object.values(groupys).map(user => (
            <div key={user.name}>
            <ListItem key={user.uid} dense button className={classes.listItem}>
                {(user.hasOwnProperty('imgUrl') && user.imgUrl !== 'null')
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
        </TabContainer>}
        {value === 1 && <TabContainer>
            <List>
          {Object.values(freeBirds).map(user => (
            <div key={user.uid}>
            <ListItem key={user.uid} dense button className={classes.listItem}>
            {(user.hasOwnProperty('imgUrl') && user.imgUrl !== 'null')
              ?
              <Avatar src={user.imgUrl} sizes={'30'} />
              :
              <Avatar className={classes.avatarBlue} ><AccountCircle/></Avatar>
              }
              <ListItemText primary={`${user.name}`} />
              <ListItemSecondaryAction>
                <Checkbox
                  onChange={this.handleToggle(user)}
                  checked={user.hasOwnProperty('tour') && (user.tour !== 'null')}
                />
              </ListItemSecondaryAction>
            </ListItem>
              <Divider />
            </div>
          ))}
        </List>
        </TabContainer>}
      </div>


        <Button variant="extendedFab" onClick={this.handleSave} color="primary" className={classes.button} >
            Save
        </Button>
        <Button variant="extendedFab" onClick={this.handleBack} color="primary" className={classes.button} >
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

const mapDispatch = (dispatch) => {

}

export default connect(mapState, mapDispatch)(withStyles(styles)(ManageGroup));
