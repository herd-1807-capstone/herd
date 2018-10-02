import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'

import firebase from '../fire';

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const LinkToCreateGroup = () => <Link to='/admin/group' />


const style = theme => ({
    button: {
      margin: theme.spacing.unit,
      },
      extendedIcon: {
        marginRight: theme.spacing.unit,
      },
      card: {
        maxWidth: 345,
      },
      media: {
        height: 140,
      },
  })

class Admin extends Component{
    


    render(){
        if(!currentUser.hasOwnProperty(tour)){
            return(
                <div>
                    <Button color="primary" component={LinkToCreateGroup} >Create Group</Button>
                </div>
            )
        }

        return(
            <div>
                <Button color="primary" component={LinkToCreateGroup} >Create Group</Button>
            </div>
        )
    }
}



const mapState = (state) => ({
    currentUser: state.user.currentUser,
})

const mapDispatch = (dispatch) => {

}

SignIn.propTypes = {
classes: PropTypes.object.isRequired,
}


export default withStyles(style)(connect(mapState, mapDispatch)(Admin))