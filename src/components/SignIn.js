import React, { Component } from 'react';
import firebase, {auth} from '../utils/api-config';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';

const provider = new firebase.auth.GoogleAuthProvider();

const style = theme => ({
  button: {
    margin: theme.spacing.unit,
    },
    extendedIcon: {
      marginRight: theme.spacing.unit,
    }
})
class SignIn extends Component{
  constructor(props){
    super(props)
    this.state = {
      user:null
    }
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }


  async login(){
    let { user } = await auth.signInWithRedirect(provider);
    this.setState({
      user
    });
  }

  async logout(){
    await auth.signOut();
    this.setState({
      user: null
    });
  }

  render(){
    const { classes } = this.props
    return(
    <div id = 'signin'>
      <Button variant="extendedFab" onClick={this.logout} color="primary" className={classes.button} >
        <AccountCircle />Logout
      </Button>
    </div>
    )
  }
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
}


export default withStyles(style)(SignIn)
