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

const styles = theme => ({
  root:{
    display: 'flex',
    justifyContent: 'center',
  },
  paperBack: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});

class ManageGroup extends React.Component {
    state = {
        checked: [1]
    };
constructor(props){
    super(props)
    this.state = {
        groupys: [],
        freeBirds: [],
      }
  }

  async componentDidMount(){
    let access_token = await firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
    let resGroupys = await axios.get(`http://localhost:8080/api/users?access_token=${access_token}`)
    let resFreeBirds = await axios.get(`http://localhost:8080/api/users/free?access_token=${access_token}`)
    let groupys = resGroupys.data
    let freeBirds = resFreeBirds.data
    // Promise.all([groupys, freeBirds])
    //         .then(function(values) {
    //             this.setState({groupys: values[0], freeBirds: values[1]})
    //         });
    this.setState({groupys, freeBirds})
  }

  handleToggle = value => () => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked,
    });
  };

  render() {
    const { classes } = this.props;
    console.log(this.state.groupys)
    console.log(this.state.freeBirds)
    return (
      <div className={classes.root}>
        <Paper className={classes.paperBack} elevation={3}>
        <List>
          {this.state.groupys.map(user => (
            <div key={user.uid}>
            <ListItem key={user.uid} dense button className={classes.listItem}>
              {/* <Avatar alt="Remy Sharp" src="/static/images/remy.jpg" /> */}
              <AccountCircle />
              <ListItemText primary={`${user.name}`} />
              <ListItemSecondaryAction>
                <Checkbox
                  onChange={this.handleToggle(user.uid)}
                />
              </ListItemSecondaryAction>
            </ListItem>
              <Divider />
            </div>
          ))}
        </List>


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
                />
              </ListItemSecondaryAction>
            </ListItem>
              <Divider />
            </div>
          ))}
        </List>
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