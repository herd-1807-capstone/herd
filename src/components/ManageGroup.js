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
import Avatar from '@material-ui/core/Avatar';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import firebase from '../fire';
import Admin from './Admin';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

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
        checked: [1],
        value: 0,
        access_token: "",
        changedUser:[]
      }
  }

  async componentDidMount(){
    let access_token = await firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
    let resGroupys = await axios.get(`${API_ROOT}/users?access_token=${access_token}`)
    let resFreeBirds = await axios.get(`${API_ROOT}/users/free?access_token=${access_token}`)
    let groupys = resGroupys.data
    let freeBirds = resFreeBirds.data
    // Promise.all([groupys, freeBirds])
    //         .then(function(values) {
    //             this.setState({groupys: values[0], freeBirds: values[1]})
    //         });
    this.setState({groupys, freeBirds, access_token})
  }

  handleToggle = value => async (evt) => {
    const { checked, access_token, groupys, freeBirds } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    const { currentUser } = this.props

    if (evt.target.checked) {
      newChecked.push(value);
      // add a member to a tour
      console.log(evt.target.checked)
      evt.persist()
      try {
          let putTour = await axios.post(`${API_ROOT}/tours/${currentUser.tour}/users?access_token=${access_token}`, {userId: value})
          console.log(`Put the tour!!!${putTour}`)
          let putUser = await axios.put(`${API_ROOT}/users/${value}?access_token=${access_token}`, {tour: currentUser.tour})
          console.log("update user", putUser)
          console.log(currentUser.tour)
          
      } catch (error) {
          console.error(error)
      }
    } else {
      newChecked.splice(currentIndex, 1);
      //remove a member from a tour
    }

    this.setState({
      checked: newChecked,
    });
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };


  render() {
    const { classes } = this.props;
    const { value } = this.state;
    console.log(this.state.groupys)
    console.log(this.state.freeBirds)

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
        {value === 0 && <TabContainer>
            <List>
          {this.state.groupys.map(user => (
            <div key={user.uid}>
            <ListItem key={user.uid} dense button className={classes.listItem}>
              {/* <Avatar alt="Remy Sharp" src="/static/images/remy.jpg" /> */}
              <AccountCircle />
              <ListItemText primary={`${user.uid}`} />
              <ListItemSecondaryAction>
                <Checkbox
                  onChange={this.handleToggle(user.name)}
                  checked={user.hasOwnProperty('tour') && (user.tour !== 'null')}
                />
              </ListItemSecondaryAction>
            </ListItem>
              <Divider />
            </div>
          ))}
        </List>
            </TabContainer>}
        {value === 1 && <TabContainer>
            <List>
          {this.state.freeBirds.map(user => (
            <div key={user.uid}>
            <ListItem key={user.uid} dense button className={classes.listItem}>
              {/* <Avatar alt="Remy Sharp" src="/static/images/remy.jpg" /> */}
              <AccountCircle />
              <ListItemText primary={`${user.name}`} />
              <ListItemSecondaryAction>
                <Checkbox
                  onChange={this.handleToggle(user.uid)}
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
