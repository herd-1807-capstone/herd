import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link, Redirect } from 'react-router-dom'

import firebase from '../fire';
// import './component.css'

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

import ManageGroup from './ManageGroup'

const LinkToCreateGroup = () => <Link to='/admin/group' />


const style = theme => ({
    button: {
      margin: theme.spacing.unit,
      },
      extendedIcon: {
        marginRight: theme.spacing.unit,
      },
      card: {
        maxWidth: 745,
      },
      media: {
        height: 240,
      },
      tourDisplay: {
        margin: 60,
        display: 'flex',
        justifyContent: 'center',
      }
  })

class Admin extends Component{
    

    imgUrl = 'defaultGroup.png'
    tourName = 'Disney Land!'
    tourDescription = 'This is a fake information for a unreal tour group!'
    creator = this.props.currentUser

    handleRedirect(){
        <Redirect to='/admin/group' />
    }

    render(){
        console.log("In the admin")
        const { classes, currentUser } = this.props
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
                        image={this.imgUrl}
                        title={this.tourName}
                        />
                        <CardContent>
                        <Typography gutterBottom variant="headline" component="h2">
                            {currentUser.tour}
                        </Typography>
                        <Typography component="p">
                            {this.tourDescription}
                        </Typography>
                        </CardContent>
                    </CardActionArea>
                    </Card>
                </div>
            )
        }
        // console.log(currentUser.hasOwnProperty('tour'))
        return(
            <div>
                <Button variant="contained" color="primary"  className={classes.button} component={Link} to='/admin/group'>Create Group</Button>
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