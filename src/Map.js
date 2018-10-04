import React, { Fragment, Component } from 'react';
import GoogleMapReact from 'google-map-react';
import GeolocationMarker from './GeolocationMarker';
import GOOGLE_API_KEY from './secrets';
import firebase from './fire';
import { Spot, Admin, User } from './Marker';
import axios from 'axios'
import store, { getAllUsers, getSpotsThunk, addSpotThunk, setSelected } from './store';
import { connect } from 'react-redux';
import {setCurrentUser} from './reducers/user'
import {API_ROOT} from './api-config';
import Modal from '@material-ui/core/Modal';

import AddMarkerForm from './AddMarkerForm'
const db = firebase.database();


const options = {
  mapTypeControl: true,
  streetViewControl: true,
}

class SimpleMap extends Component {
  static defaultProps = {
    center: {
      lat: 28.4177,
      lng: -81.5812,
    },
    zoom: 18,
  };
  constructor(props) {
    super(props);
    this.state = {
      currentPosition: {
        lat: 28.4177,
        lng: -81.5812,
        accuracy: 0,
      },

      zoom: 18,
      center: {
        lat: 28.4177,
        lng: -81.5812,
      },
      map: null,
      maps: null,
      addMarkerWindow: false,
      addMarkerLat: null,
      addMarkerLng: null
    };
    this.onMapClick = this.onMapClick.bind(this);
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.setCoords = this.setCoords.bind(this);
    this.watchCurrentPosition = this.watchCurrentPosition.bind(this);
    this.centerToPosition = this.centerToPosition.bind(this);
    this.writeCurrentPosition = this.writeCurrentPosition.bind(this);
    this.renderAccuracyCircle = this.renderAccuracyCircle.bind(this);
    this.onApiLoaded = this.onApiLoaded.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  async writeCurrentPosition(lat, lng) {
    const tourId = this.props.currentUser.tour;
    const userId = this.props.currentUser.uid;
    try {
      const idToken = await firebase.auth().currentUser.getIdToken();
      await axios.put(
        `${API_ROOT}/tours/${tourId}/users/${userId}?access_token=${idToken}`,
        { lat, lng }
      );
    } catch (error) {
      console.error(error);
    }
  }

  watchCurrentPosition() {
    if ('geolocation' in navigator) {
      this.geoWatchId = navigator.geolocation.watchPosition(this.setCoords);
    } else {
      console.log('geolocation is not available');
    }
  }
  setCoords(position) {
    const {coords} = position;
    this.setState({
      currentPosition: {
        lat: coords.latitude,
        lng: coords.longitude,
        accuracy: coords.accuracy
      },
    });
    if (this.circle){
      this.updateAccuracyCircle();
    }
  }
  componentDidUpdate(prevProps, prevState) {
    let changedLat =
      prevState.currentPosition.lat !== this.state.currentPosition.lat;
    let changedLng =
      prevState.currentPosition.lng !== this.state.currentPosition.lng;
    if (changedLat || changedLng) {
      this.writeCurrentPosition(
        this.state.currentPosition.lat,
        this.state.currentPosition.lng
      );

    }
    if (prevProps.recenter !== this.props.recenter){
      if (this.props.recenter){
        this.centerToPosition(this.state.currentPosition.lat, this.state.currentPosition.lng);
      }
    }
  }
  clearWatchPosition() {
    //disable GPS monitoring
    if ('geolocation' in navigator) {
      navigator.geolocation.clearWatch(this.geoWatchId);
    }
  }
  hidePosition() {
    //TODO: hide from other users, but not admin
  }
  onMapClick(evt) {
    //TODO: add marker to clicked location
    console.log(evt);
    console.log(evt.lat, evt.lng);
    this.setState({
      addMarkerWindow: true,
      addMarkerLat: evt.lat,
      addMarkerLng: evt.lng,
    })
  }
  handleClose(){
    this.setState({
      addMarkerWindow: false
    })
  }
  onMarkerClick(...evt){
    const key = evt[0];
    const coords = evt[1];
    this.props.selectSpot(key, coords);
    this.centerToPosition(coords.lat, coords.lng)
  }
  centerToPosition(lat, lng) {
    this.setState(
      {
        center: {
          lat,
          lng
        },
      },
      () => {
        //reset center even user location didn't change
        this.setState({
          center: {},
        });
      }
    );
  }
  componentDidMount() {
    this.watchCurrentPosition();
    this.loadAfterAuthUser();
  }
  loadAfterAuthUser(){
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        // User is signed in.
        try {
          //get user's profile
          let snapshot = await db.ref(`/users/${user.uid}`).once('value');
          let userInfo = snapshot.val();
          store.dispatch(setCurrentUser(userInfo));
          this.props.getSpots();
          this.props.getUsers();
        } catch (error) {
          console.error(error);
        }
      } else {
        // No user is signed in.
      }
    });
  }
  componentWillUnmount(){
    if ('geolocation' in navigator){
      navigator.geolocation.clearWatch(this.geoWatchId);
    }
  }
  onApiLoaded({map, maps}){
    this.setState({map, maps})
    this.renderAccuracyCircle(map, maps);
  }
  renderAccuracyCircle(map, maps){
    const {lat, lng, accuracy } = this.state.currentPosition
    this.circle = new maps.Circle({
      center: {lat, lng},
      radius: accuracy,
      map: map,
      fillColor: 'blue',//color,
      fillOpacity: 0.1,//opacity from 0.0 to 1.0,
      strokeColor: 'blue',//stroke color,
      strokeOpacity: 0.1,//opacity from 0.0 to 1.0
     });
  }
  updateAccuracyCircle(){
    const {lat, lng, accuracy } = this.state.currentPosition
    this.circle.setCenter({lat, lng})
    this.circle.setRadius(accuracy);
  }
  renderSpots() {
    let spots = this.props.spots;
    return spots.map(loc => {
      if (loc.name && loc.lat && loc.lng){
        return <Spot key={loc.name} lat={loc.lat} lng={loc.lng} />;
      }
      return null;
    });
  }
  renderUsers() {
    return this.props.users.map((user, index)=> {
      if (user.status === 'admin') {
        if (user.name && user.lat && user.lng){
          return <Admin key={user.name} lat={user.lat} lng={user.lng} />;
        }
        return null
      }
      if (user.name && user.lat && user.lng){

        return(<User
                  key={user.name}
                  lat={user.lat}
                  lng={user.lng}
                  imgUrl={user.imgUrl}
                  idx={index} />);
      }
      return null
    });
  }
  render() {
    return (
      // Important! Always set the container height explicitly
        <Fragment>
          <div id = 'google-map' >
            <GoogleMapReact
              bootstrapURLKeys={{ key: GOOGLE_API_KEY}}
              defaultCenter={this.props.center}
              defaultZoom={this.props.zoom}
              center={this.state.center}
              options ={options}
              onClick = {this.onMapClick}
              onChildClick={this.onMarkerClick}
              onGoogleApiLoaded={this.onApiLoaded}
              yesIWantToUseGoogleMapApiInternals = {true}
              >
                <GeolocationMarker
                  key = 'geolocationMarker'
                  lat={this.state.currentPosition.lat}
                  lng={this.state.currentPosition.lng} />
                {
                  this.renderSpots()
                }
                {
                  this.renderUsers()
                }
            </GoogleMapReact>
          <Modal
            open={this.state.addMarkerWindow}
            // onBackdropClick={this.handleClose}
            onClose={this.handleClose}
            style={{alignItems:'center',justifyContent:'center'}}
            >
            {/* <div>
              some placeholder content
            </div> */}
            <AddMarkerForm

            lat={this.state.addMarkerLat}
            lng={this.state.addMarkerLng}
            />
          </Modal>
          </div>


        </Fragment>
    );
  }
}

const mapState = ({user, spots})=>({
  users: user.list,
  spots: spots.list,
  currentUser: user.currentUser
})

const mapDispatch = (dispatch) => ({
  getSpots(){
    dispatch(getSpotsThunk());
  },
  getUsers(){
    dispatch(getAllUsers());
  },
  addSpot(){
    dispatch(addSpotThunk());
  },
  selectSpot(key){
    dispatch(setSelected(key));
  }
})
export default connect(mapState, mapDispatch)(SimpleMap);
