import React, { Fragment, Component } from 'react';
import GoogleMapReact from 'google-map-react';
import GeolocationMarker from './GeolocationMarker';
import GOOGLE_API_KEY from '../utils/secrets';
import firebase from '../utils/api-config';
import { Spot, Admin, User, OfflineUser, OfflineAdmin } from './Marker';
import axios from 'axios'
import store, { getAllUsers, getSpotsThunk, addSpotThunk, setSelected, findSelectedMarker, getAnnouncement } from '../store';
import { connect } from 'react-redux';
import {setCurrentUser, getHistoricalData} from '../reducers/user'
import {API_ROOT} from '../utils/api-config';
import Modal from '@material-ui/core/Modal';
import {SpotsListWindow, UsersListWindow} from './ListWindow';
import {setGoogleMap} from '../reducers/googlemap';
import {retro, silver} from './MapStyles';

const db = firebase.database();

const createOptions = () => ({
  mapTypeControl: true,
  streetViewControl: true,
  mapTypeControlOptions: {
    mapTypeIds: ['retro', 'silver']
  },
  styles: retro
});

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
        lastSeen: null
      },
      // zoom: 18,
      center: {
        lat: 28.4177,
        lng: -81.5812,
      },
      addMarkerWindow: false,
      addMarkerLat: null,
      addMarkerLng: null,
    };

    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.setCoords = this.setCoords.bind(this);
    this.watchCurrentPosition = this.watchCurrentPosition.bind(this);

    this.writeCurrentPosition = this.writeCurrentPosition.bind(this);
    this.renderAccuracyCircle = this.renderAccuracyCircle.bind(this);
    this.onApiLoaded = this.onApiLoaded.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  async writeCurrentPosition(lat, lng, lastSeen) {
    const tourId = this.props.currentUser.tour;
    const userId = this.props.currentUser.uid;
    try {
      const idToken = await firebase.auth().currentUser.getIdToken();
      await axios.put(
        `${API_ROOT}/tours/${tourId}/users/${userId}?access_token=${idToken}`,
        { lat, lng, lastSeen}
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
        accuracy: coords.accuracy,
        lastSeen: position.timestamp
      },
    }, () => {
      if (this.circle){
        this.updateAccuracyCircle();
      }
    });

  }
  componentDidUpdate(prevProps, prevState) {
    let changedLat =
      prevState.currentPosition.lat !== this.state.currentPosition.lat;
    let changedLng =
      prevState.currentPosition.lng !== this.state.currentPosition.lng;
    if (changedLat || changedLng ) {
      this.writeCurrentPosition(
        this.state.currentPosition.lat,
        this.state.currentPosition.lng,
        this.state.currentPosition.lastSeen
      );
    }

    if (prevProps.recenter !== this.props.recenter){
      if (this.props.recenter){
        this.props.map.panTo({lat: this.state.currentPosition.lat, lng:this.state.currentPosition.lng});
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

  handleClose=(type)=>()=>{
    this.setState({
      [type]: false
    })
  }

  onMarkerClick(...evt){
    const key = evt[0];
    const coords = evt[1];
    let marker = findSelectedMarker(key, this.props.spots, this.props.users);
    window.infoWindow.setContent((marker && marker.name) || key);
    window.infoWindow.setPosition(coords)
    this.props.selectSpot(marker);
    this.props.map.panTo(coords);
    window.infoWindow.open(this.props.map);
  }

  componentDidMount() {
    this.watchCurrentPosition();
    this.loadAfterAuthUser();
  }

  writeLocationHistory = async(currentUser) => {
      const tourId = currentUser.tour;

      //check user is admin;
      if (!tourId) return;
      if (currentUser.status !== 'admin') return;

      const tourRef = db.ref(`/tours/${tourId}`);
      let tourInfo;
      let snap;
      try {
        snap = await tourRef.once('value');
      } catch (error) {
        console.error(error);
      }

      tourInfo = snap.val();
      //check if tour has started yet, if not, exit;
      if (Date.now() < tourInfo.startDateTime || Date.now() > tourInfo.endDateTime) {
        return;
      }
      this.locationHistoryId = setInterval(async()=>{
      //if now is > end then clearInterval or if haven't started, clearInterval;
        if (Date.now() > tourInfo.endDateTime || Date.now() < tourInfo.startDateTime){
          clearInterval(this.locationHistoryId);
        }
      let allUsers = [...this.props.users, this.state.currentPosition];
      //read users location data
      const locationData = allUsers.reduce((usersUpdate, user) => {
          if (!user.lat || !user.lng) return usersUpdate;
          const key = tourRef.child('history').push().key;//generate key locally
          usersUpdate[key] = {lat:user.lat, lng:user.lng, lastSeen: user.lastSeen || Date.now(), weight: 1};//save
          return usersUpdate;
        }, {});
      try {
        const idToken = await firebase.auth().currentUser.getIdToken();
        await axios.post(`${API_ROOT}/tours/${tourId}/history?access_token=${idToken}`, {locationData});
      } catch (error) {
        console.error(error);
      }
    }, 60000) //
  }

  loadAfterAuthUser(){
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        // User is authenticated via firebase
        try {
          //get user's profile
          const snapshot = await db.ref(`/users/${user.uid}`).once('value');
          const userInfo = snapshot.val();
          const tourId = userInfo.tour;
          this.props.setCurrentUser(userInfo);
          this.props.getSpots();
          this.writeLocationHistory(userInfo);
          this.props.getUsers();
        } catch (error) {
          console.error(error);
        }

        try{
          // check if announcement has been added.
          store.dispatch(getAnnouncement());
          this.props.getAnnouncement();
        }catch(err){
          console.log(err.stack);
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
    clearInterval(this.locationHistoryId);
  }

  onApiLoaded({map, maps}){
    this.props.setMap(map, maps);
    this.renderAccuracyCircle(map, maps);

    window.infoWindow = new maps.InfoWindow();
    const retroMap = new maps.StyledMapType(retro, {name: 'Retro'});
    const silverMap = new maps.StyledMapType(silver, {name: 'Silver'});
    map.mapTypes.set('retro', retroMap);
    // map.mapTypes.setMapTypeId;
    map.mapTypes.set('silver', silverMap);
    // map.mapTypes.setMapTypeId;

    window.spotCrosshair = new maps.Marker({
      map,
      icon: {
        url: 'Crosshair.svg',
        anchor: new maps.Point(12, 12),
        // size: new maps.Size(40, 40),
      }
    });
  }

  updateCenter = ({center}) => {
    this.setState({center: {
      lat: center.lat,
      lng: center.lng
    }})
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
      if (loc.uid && loc.lat && loc.lng){
        return <Spot key={loc.uid} lat={loc.lat} lng={loc.lng} />;
      }
      return null;
    });
  }

  renderUsers() {
    return this.props.users.map((user, index)=> {
      if (user.status === 'admin') {
        if (user.uid && user.lat && user.lng && user.loggedIn){
          return <Admin key={user.uid} lat={user.lat} lng={user.lng} />;
        }
        if (user.uid && user.lat && user.lng && !user.loggedIn){
          return <OfflineAdmin  key={user.uid} lat={user.lat} lng={user.lng} />;
        }
        return null
      }
      if (user.uid && user.lat && user.lng && user.loggedIn){

        return(<User
                  key={user.uid}
                  lat={user.lat}
                  lng={user.lng}
                  imgUrl={user.imgUrl}
                  idx={index} />);
      }
      if (user.uid && user.lat && user.lng && !user.loggedIn){
        return (<OfflineUser
                  className = 'user-marker-offline'
                  key={user.uid}
                  lat={user.lat}
                  lng={user.lng}
                  imgUrl={user.imgUrl}
                  idx={index} />);
      }
      return null
    });
  }

  render() {
    const {usersListWindow, spotsListWindow, handleListClose, map, addSpotOnClick} = this.props;

    return (
      // Important! Always set the container height explicitly
        <Fragment>
          <div id = 'google-map' >
            <GoogleMapReact
              bootstrapURLKeys={{ key: GOOGLE_API_KEY}}
              defaultCenter={this.props.center}
              defaultZoom={this.props.zoom}

              options ={createOptions}

              onChildClick={this.onMarkerClick}
              onGoogleApiLoaded={this.onApiLoaded}
              yesIWantToUseGoogleMapApiInternals = {true}
              heatmapLibrary = {true}

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
            key='users-list-window'
            open={usersListWindow || false}
            onClose={handleListClose('usersListWindow') || null}
            >
            <UsersListWindow
              handleClose = {handleListClose || null}
              />
          </Modal>
          <Modal
            key='spots-list-window'
            open={spotsListWindow || false}
            onClose={handleListClose('spotsListWindow') || null}
            >
            <SpotsListWindow
              handleClose = {handleListClose || null}
              />
          </Modal>
          </div>
        </Fragment>
    );
  }
}

const mapState = ({user, spots, googlemap})=>({
  users: user.list,
  spots: spots.list,
  currentUser: user.currentUser,
  selected: spots.selected,
  map: googlemap.map,
  maps: googlemap.maps,
  heatmapData: user.historicalData,
  addSpotOnClick: spots.addSpotOnClick
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
  selectSpot(marker){
    dispatch(setSelected(marker));
  },
  setMap(map, maps){
    dispatch(setGoogleMap(map, maps));
  },
  setCurrentUser(user){
    dispatch(setCurrentUser(user))
  },
  getAnnouncement(){
    dispatch(getAnnouncement());
  },
  getHistoricalData(data){
    dispatch(getHistoricalData(data))
  }
})

export default connect(mapState, mapDispatch)(SimpleMap);
