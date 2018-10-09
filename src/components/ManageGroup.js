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
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';

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
        freeBirds: [],
        access_token: "",
        changedUser:[],
        cacheGroupys:[],
        cacheFreeBirds: [],
        cancelButtonText: "Back"
      }

    this.handleSave = this.handleSave.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  async componentDidMount(){
    let access_token = await firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
    let resGroupys = axios.get(`${API_ROOT}/users?access_token=${access_token}`)
    let resFreeBirds = axios.get(`${API_ROOT}/users/free?access_token=${access_token}`)
    Promise.all([resGroupys, resFreeBirds])
            .then(([resGroupysdata, resFreeBirdsdata]) => {
        let groupys = resGroupysdata.data
        let freeBirds = resFreeBirdsdata.data
        if(groupys && groupys[0].hasOwnProperty('tour') && groupys.length !== 0 && groupys[0].tour === 'null'){
            groupys = []
        }
    this.setState({...this.state,
                    groupys,
                    freeBirds,
                    access_token,
                    cacheGroupys: [...groupys],
                    cacheFreeBirds: [...freeBirds]
        })
    });
  }

  handleToggle = user => async (evt) => {
    const { groupys, freeBirds, changedUser } = this.state;
    // const currentIndex = checked.indexOf(user);
    // const newChecked = [...checked];

    const { currentUser } = this.props
    let newGroupys = []
    let newfreeBirds = []
    if (evt.target.checked) {

        newfreeBirds = freeBirds.filter((fUser)=>{
            return fUser.uid !== user.uid
        })
        user.tour = currentUser.tour
        newGroupys = [...groupys, user]

    } else {
        // console.log("Uncheck!")
        newGroupys = groupys.filter((gUser)=>{
            return gUser.uid !== user.uid
        })
        user.tour = 'null'
        newfreeBirds = [...freeBirds, user]
    }
    let change = false
    // console.log(user)
    let newChanged = changedUser.filter((cUser)=>{
        if(cUser.uid !== user.uid){
            return true
        } else {
            change = true
            return false
        }
    })
    if(!change){
        newChanged.push(user)
    }
    this.setState({...this.state,
      groupys: newGroupys,
      freeBirds: newfreeBirds,
      changedUser: newChanged,
    });

  };

  handleSave = async (evt) => {
    const { currentUser } = this.props
    const { access_token, changedUser } = this.state
    try {
        for(let i = 0; i < changedUser.length; i++){
            let user = changedUser[i]
            if(user.hasOwnProperty('tour') && user.tour !== 'null'){
                let putTour = await axios.post(`${API_ROOT}/tours/${currentUser.tour}/users?access_token=${access_token}`, {userId: user.uid})
                console.log(`Put the tour!!!${putTour}`)
            } else {
                user.tour = 'null'
                await axios.delete(`${API_ROOT}/tours/${currentUser.tour}/users/${user.uid}?access_token=${access_token}`)
            }
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

  handleCancel = () => {
    console.log(this.state.changedUser.length)
    if(this.state.changedUser.length === 0){
        this.props.history.push('/admin')
    }
    let oldGroupys = this.state.cacheGroupys.map((user)=>{
        user.tour = this.props.currentUser.tour
        return user
    })
    let oldFreeBirds = this.state.cacheFreeBirds.map((user)=>{
        user.tour = 'null'
        return user
    })
    this.setState({...this.state,
                    groupys: oldGroupys,
                    freeBirds: oldFreeBirds,
                    changedUser: [],
                })
  }

  static getDerivedStateFromProps(props, state){
    const { cancelButtonText, changedUser } = state;
      if(changedUser.length > 0 && cancelButtonText === 'Back') {
        return ({...state, cancelButtonText: 'Cancel'})
    } else if (changedUser.length == 0 && cancelButtonText === 'Cancel') {
        return ({...state, cancelButtonText: 'Back'})
    }
  }

  render() {
    const { classes } = this.props;
    const { groupys, freeBirds, cancelButtonText } = this.state;
    // console.log(this.state.groupys)
    // console.log(this.state.freeBirds)

    return (
      <div className={classes.subRoot}>
        <Paper className={classes.paperBack} elevation={3}>
        <div className={classes.root}>
        <AppBar position="static">
            <Tab label="Group Members" />
        </AppBar>
        <TabContainer>
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
            </TabContainer>
            <AppBar position="static">
            <Tab label="No Group Members" />
            </AppBar>
        <TabContainer>
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
        </TabContainer>
      </div>


        <Button variant="extendedFab" onClick={this.handleSave} color="primary" className={classes.button} >
            Save
        </Button>
        <Button variant="extendedFab" onClick={this.handleCancel} color="primary" className={classes.button} >
            {cancelButtonText}
        </Button>

        </Paper>

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
