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
      },
      zoom: 18,
      center: {
        lat: 28.4177,
        lng: -81.5812,
      },
      map: null,
      maps: null,
    };
    this.onMapClick = this.onMapClick.bind(this);
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.setCoords = this.setCoords.bind(this);
    this.watchCurrentPosition = this.watchCurrentPosition.bind(this);
    this.centerToPosition = this.centerToPosition.bind(this);
    this.writeCurrentPosition = this.writeCurrentPosition.bind(this);
  }
  async writeCurrentPosition(lat, lng) {
    const tourId = this.props.currentUser.tour;
    const userId = this.props.currentUser.uid;
    try {
      await axios.put(
        `http://localhost:8080/api/tours/${tourId}/users/${userId}`,
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
  async setCoords({ coords }) {
    this.setState({
      currentPosition: {
        lat: coords.latitude,
        lng: coords.longitude,
      },
    });
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
    // console.log(evt);
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
    return this.props.users.map(user => {
      if (user.status === 'admin') {
        if (user.name && user.lat && user.lng){
          return <Admin key={user.name} lat={user.lat} lng={user.lng} />;
        }
        return null
      }
      if (user.name && user.lat && user.lng){
        return <User key={user.name} lat={user.lat} lng={user.lng} />;
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
