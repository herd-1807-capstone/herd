import React from 'react';
import { connect } from 'react-redux';
import firebase from '../fire';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';
import MenuIcon from '@material-ui/icons/Menu';

import UserListItems from './UserListItems';
import AdminListItems from './AdminListItems';
import Map from '../Map';
import Chat from './Chat';
import BottomSheet from '../BottomSheet';
import AnnouncementCreateModal from './AnnouncementCreateModal';
import { setCurrentUser, sendTourAnnouncement } from '../store/index';
import GpsFixed from '@material-ui/icons/GpsFixed';
import PeopleIcon from '@material-ui/icons/People';
import SpotsIcon from '@material-ui/icons/Place';



const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100vh',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  appBar: {
    position: 'absolute',
    marginLeft: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    // padding: theme.spacing.unit * 3,
  },
});

class MenuBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mobileOpen: false,
      showInfo: true,
      recenter: false,
      usersListWindow: false,
      spotsListWindow: false,
      showMsgModal: false,
      showPSA: 'block', // block or none
      announcementResult: '',
    };

    this.handleLogout = this.handleLogout.bind(this);
    this.handleChatStart = this.handleChatStart.bind(this);
    this.handleInfoSpot = this.handleInfoSpot.bind(this);
    this.handleRecenter = this.handleRecenter.bind(this);
    this.sendTourAnnouncement = this.sendTourAnnouncement.bind(this);
    this.hidePSABar = this.hidePSABar.bind(this);
  }

  modalOpen = (type) => () =>{
    this.setState({
      [type]: true,
      mobileOpen: false
    })
  }

  handleListClose = (type) => () => {
    this.setState({
      [type]: false
    })
  }

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  async handleLogout() {
    await firebase.auth().signOut();
    await firebase.database().ref(`/users/${this.props.currentUser.uid}`).update({loggedIn: false});
    this.props.logout();
  }

  handleChatStart() {
    this.setState({ showInfo: false, mobileOpen: false });
  }

  handleInfoSpot() {
    this.setState({ showInfo: true, mobileOpen: false });
  }

  handleRecenter(evt){
    this.setState({recenter: true}, ()=>{
      this.setState({recenter: false})
    })
  }

  showAnnouncementModal = () => {
    this.setState({showMsgModal: true});
  }

  hideAnnouncementModal = () => {
    this.setState({showMsgModal: false});
  }

  async sendTourAnnouncement(evt){
    try{
      const form = evt.target;
      evt.preventDefault();

      const message = evt.target.message.value;
      // before calling the send function, check if message is not empty.
      let messageSent = true;
      if(message && message.length > 0){
        messageSent = await this.props.sendTourAnnouncement(message);
      }

      if(messageSent){
        form.message.value = '';
        this.setState({
          announcementResult: 'The announcement message has been sent successfully.',
          showMsgModal:true,
        })
        setTimeout(this.hideAnnouncementModal, 2000);
      }else{
        // add an error message to the announcement submit modal
        const errorMsg = `Something went wrong. Please try again.`;
        this.setState({
          announcementResult: errorMsg,
          showMsgModal:true,
        })
      }
    } catch(err){
      console.log(err);
    }
  }

  hidePSABar(){
    this.setState({
      showPSA: 'none'
    })
  }

  render() {
    const { classes, theme, currentUser } = this.props;

    const drawer = (
      <div>
        <div className={classes.toolbar} />
        <Divider />
        <List>
          <UserListItems
            menuToggle = {this.modalOpen}
            handleChatStart={this.handleChatStart}
            handleInfoSpot={this.handleInfoSpot}
          />
        </List>
        <Divider />
        <List>
          {currentUser.hasOwnProperty('status') && currentUser.status === 'admin'
          ?
          <AdminListItems showAnnouncementModal={this.showAnnouncementModal} props={this.props} />
          :
          null
          }
        </List>
      </div>
    );

    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerToggle}
              className={classes.navIconHide}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" noWrap>
              Herd - Tour Groups Management
            </Typography>
            <IconButton onClick ={this.handleRecenter}>
              <GpsFixed />
            </IconButton>
            <IconButton onClick = {this.modalOpen('usersListWindow')}>
              <PeopleIcon />
            </IconButton>
            <IconButton onClick = {this.modalOpen('spotsListWindow')}>
              <SpotsIcon />
            </IconButton>
            {this.props.currentUser ? (
              <Button color="inherit" onClick={this.handleLogout}>
                Log out
              </Button>
            ) : null}
          </Toolbar>
          <Divider />
          {
            this.props.announcement?
            <div style={{backgroundColor: "#37BC9B", display: this.state.showPSA}}>
                <img style={{width:"24px", height:"24px", paddingRight:'5px'}} src="info_outline.png" />
              <span style={{verticalAlign:"top"}}>{`${this.props.announcement}`}</span>
              <span style={{float:"right", paddingRight:'10px'}}><a href="#" style={{textDecoration:'none', color: 'white'}} onClick={this.hidePSABar}>x</a></span>
            </div>
            :
            null
          }
        </AppBar>
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={this.state.mobileOpen}
            onClose={this.handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            variant="permanent"
            open
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Map
            recenter={this.state.recenter}
            usersListWindow={this.state.usersListWindow}
            spotsListWindow={this.state.spotsListWindow}
            handleListClose = {this.handleListClose}
            />
          {this.state.showInfo ? <BottomSheet /> : <Chat />}
        </main>

        <AnnouncementCreateModal show={this.state.showMsgModal} handleClose={this.hideAnnouncementModal}>
          <form onSubmit={this.sendTourAnnouncement}>
            <div>
              <label htmlFor="message">New PSA To Send:</label> <br />
              <input placeholder="Type here..." type="text" className="psa-input" name="message" type="text" />
            </div>
            <br />
              <Button variant="outlined" color="primary" size="small" type="submit">Send
              </Button>
              <Button color="primary" variant="outlined" size="small" aria-label="Add" onClick={this.hideAnnouncementModal} type="button">Cancel</Button>

              <p id="modal-msg">{this.state.announcementResult}</p>
          </form>
        </AnnouncementCreateModal>
      </div>
    );
  }
}

MenuBar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

const mapState = state => ({
  currentUser: state.user.currentUser,
  announcement: state.tour.announcement
});

const mapDispatch = dispatch => ({
  logout: () => dispatch(setCurrentUser({})),
  sendTourAnnouncement: (message) => dispatch(sendTourAnnouncement(message)),
});

export default withStyles(styles, { withTheme: true })(
  connect(
    mapState,
    mapDispatch
  )(MenuBar)
);
