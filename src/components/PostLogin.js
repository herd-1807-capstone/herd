import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import firebase from '../utils/api-config';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { setCurrentUser, fetchAllTours, addTourToUser } from '../store/index';

const drawerWidth = 240;
const styles = theme => ({
  root: {
    height: '100vh',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  appBar: {
    position: 'absolute',
    marginLeft: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: '100%',
    },
  },
  toolbar: theme.mixins.toolbar,
  tourDisplay: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItem: 'space-between'
  },
  adminLink:{
    alignSelf: 'center',
  },
  media: {
    height: 240,
  },
  card: {
    margin: '10px 10px'
  }
});

class PostLogin extends Component{

  constructor(props){
    super(props);

    this.state = {
      tours: []
    }

    this.handleLogout = this.handleLogout.bind(this);
    this.addTourToUser = this.addTourToUser.bind(this);
  }

  async addTourToUser(tourId){
    try{
      await this.props.addTourToUser(tourId);
      this.props.history.push('/');
    }catch(err){
      console.log(err);
    }
  }

  async handleLogout() {
    await firebase.auth().signOut();
    await firebase.database().ref(`/users/${this.props.currentUser.uid}`).update({loggedIn: false});
    this.props.logout();
  }

  async componentDidMount(){
    try{
      await this.props.fetchAllTours();
      this.setState({
        tours: this.props.tours
      })
    }catch(err){
      console.log(err);
    }
  }

  render(){
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="title" color="inherit" noWrap>
              Herd - Tour Groups Management
            </Typography>
            <Button color="inherit" onClick={this.handleLogout}>
              Log out
            </Button>
          </Toolbar>
        </AppBar>
        <div className={classes.tourDisplay}>
          {
            (this.state.tours.length === 0)?
            null
            :
            (this.state.tours.map(tour =>
              <Card className={classes.card} key={tour.id} onClick={() => this.addTourToUser(tour.id)}>
                <CardActionArea component={Link} to='#'>
                  <CardMedia
                    component="img"
                    className={classes.media}
                    height="140"
                    width="140"
                    image={tour.imgUrl}
                    title={tour.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="headline" component="h2">{tour.name}</Typography>
                    <Typography component="p">{tour.description}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
              )
            )
          }
          {
            (
              this.props.currentUser.status === 'admin' ?
              <div className={classes.adminLink}>
                <Link to="/admin">
                  <Button
                    variant="outlined"
                    color="primary">
                    Create A New Tour
                  </Button>
                </Link>
              </div>
              :
              null
            )
          }
        </div>
      </div>
    )
  }
}

PostLogin.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

const mapState = state => ({
  currentUser: state.user.currentUser,
  tours: state.tour.tours,
});

const mapDispatch = dispatch => ({
  logout: () => dispatch(setCurrentUser({})),
  fetchAllTours: () => dispatch(fetchAllTours()),
  addTourToUser: (tourId) => dispatch(addTourToUser(tourId)),
});

export default withStyles(styles, { withTheme: true })(withRouter(connect(mapState, mapDispatch)(PostLogin)));
