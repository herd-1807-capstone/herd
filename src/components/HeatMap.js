import React, { Fragment, Component } from 'react';
import GoogleMapReact from 'google-map-react';
import GeolocationMarker from './GeolocationMarker';
import GOOGLE_API_KEY from '../utils/secrets';
import firebase from '../utils/api-config';
import { Spot } from './Marker';
import axios from 'axios'
import store, { getSpotsThunk, setSelected, findSelectedMarker, getAnnouncement } from '../store';
import { connect } from 'react-redux';
import {setCurrentUser, getHistoricalData} from '../reducers/user'
import {API_ROOT} from '../utils/api-config';
import Modal from '@material-ui/core/Modal';
import {SpotsListWindow} from './ListWindow';
import {setGoogleMap} from '../reducers/googlemap';

const db = firebase.database();


const createOptions = () => ({
  mapTypeControl: true,
  streetViewControl: true,
})
const db = firebase.database();

class HeatMap extends Component {
  static defaultProps = {
    center: {
      lat: 28.4177,
      lng: -81.5812,
    },
    zoom: 14,
  };
  constructor(props){
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
      spotsListWindow: false
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
  componentDidMount() {
    this.watchCurrentPosition();
    this.loadAfterAuthUser();
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
        this.centerToPosition(this.state.currentPosition.lat, this.state.currentPosition.lng);
      }
    }
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
  loadAfterAuthUser(){
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        // User is authenticated via firebase
        try {
          //get user's profile

          let snapshot = await db.ref(`/users/${user.uid}`).once('value');
          let userInfo = snapshot.val();
          this.props.setCurrentUser(userInfo);
          this.props.getSpots();
          this.props.getHistoricalData();
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
  onApiLoaded(){
    this.props.setMap(map, maps);
    this.renderAccuracyCircle(map, maps);
    window.infoWindow = new maps.InfoWindow();
    const {heatmapData } = this.props;
    // console.log ('HEAT MAP DATA!!!', heatmapData);
    let heatmap = new maps.visualization.HeatmapLayer({
      data: Object.keys(heatmapData).map(pointId => {
        let point = heatmapData[pointId];
        return new maps.LatLng(point.lat, point.lng)
      })
    })
    heatmap.setMap(map);
  }
  updateAccuracyCircle(){
    const {lat, lng, accuracy } = this.state.currentPosition
    this.circle.setCenter({lat, lng})
    this.circle.setRadius(accuracy);
  }
  componentWillUnmount(){
    if ('geolocation' in navigator){
      navigator.geolocation.clearWatch(this.geoWatchId);
    }
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
  render(){
    return(
      <div id = 'heat-map'>
        <GoogleMapReact
          bootstrapURLKeys={{ key: GOOGLE_API_KEY}}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          center={this.state.center}
          options ={createOptions}
          onClick = {this.onMapClick}
          onChildClick={this.onMarkerClick}
          onGoogleApiLoaded={this.onApiLoaded}
          yesIWantToUseGoogleMapApiInternals = {true}
          heatmapLibrary = {true}
          // heatmap = {{data: heatmapData}}
          >
            <GeolocationMarker
                  key = 'geolocationMarker'
                  lat={this.state.currentPosition.lat}
                  lng={this.state.currentPosition.lng} />
            {
                  this.renderSpots()
                }

        </GoogleMapReact>
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
    )
  }
}

const mapState = ({user, spots, googlemap})=>({
  users: user.list,
  spots: spots.list,
  currentUser: user.currentUser,
  selected: spots.selected,
  map: googlemap.map,
  maps: googlemap.maps,
  heatmapData: user.historicalData
})

const mapDispatch = (dispatch) => ({
  getSpots(){
    dispatch(getSpotsThunk());
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
  getHistoricalData(data){
    dispatch(getHistoricalData(data))
  }
})

export default HeatMap;
