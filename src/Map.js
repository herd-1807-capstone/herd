import React, { Component} from 'react';
import GoogleMapReact from 'google-map-react';
import { connect } from 'react-redux';
import { addMarker, removeMarker } from './Redux/markers';
import GeolocationMarker from './GeolocationMarker';
const GOOGLE_API_KEY = '';
import firebase from './fire'

const db = firebase.database();

class SimpleMap extends Component {
  static defaultProps = {
    center: {
      lat: 28.4177,
      lng: -81.5812
    },
    zoom: 12
  };
  constructor(props){
    super(props);
    this.state = {
      currentPosition: {
        lat: 28.4177,
        lng: -81.5812
      },
      zoom: 12,
      center: {
        lat: 28.4177,
        lng: -81.5812
      }
    }
    this.onMapClick = this.onMapClick.bind(this);
    this.setCoords = this.setCoords.bind(this);
    this.watchPosition = this.watchPosition.bind(this);
    this.getCurrentPosition = this.getCurrentPosition.bind(this);
    this.centerToCurrentPosition = this.centerToCurrentPosition.bind(this);
  }
  componentDidMount(){
    this.watchPosition();
  }
  componentWillUnmount(){
    if ('geolocation' in navigator){
      navigator.geolocation.clearWatch(this.geoWatchId);
    }
    clearInterval(this.state.distMatrixIntervalId);
  }
  onMapClick(evt){
    this.props.addMarker(evt);
  }
  async setCoords({coords}){
    this.setState({
      currentPosition: {
        lat: coords.latitude,
        lng: coords.longitude
      }
    });
    await db.ref(`/users/${id}`)
    .update({
      lat: coords.latitude,
      lng: coords.longitude
    });
  }
  getCurrentPosition(){
    if ('geolocation' in navigator){
      navigator.geolocation.getCurrentPosition(this.setCoords);
    } else {
      console.log('geolocation is not available');
    }
  }
  watchPosition(){
    if ('geolocation' in navigator){
      this.geoWatchId = navigator.geolocation.watchPosition(this.setCoords);
    } else {
      console.log('geolocation is not available');
    }
  }
  centerToCurrentPosition(){
    this.setState({
      center: {
        lat: this.state.currentPosition.lat,
        lng: this.state.currentPosition.lng
      }
    }, ()=> { //reset center even user location didn't change
    this.setState({
      center: {}
    })
  })
}
  renderMarkers(){
    return this.props.markers.map((loc, i) => {
      return (
      <Marker
        key = {i}
        lat={loc.lat}
        lng={loc.lng} />)
    });
  }
render() {

    return (
      // Important! Always set the container height explicitly
        <div id = 'google-map' >
          <GoogleMapReact
            bootstrapURLKeys={{ key: GOOGLE_API_KEY}}
            defaultCenter={this.props.center}
            defaultZoom={this.props.zoom}
            onClick = {this.onMapClick}
            center={this.state.center}
            >
              <GeolocationMarker
                key = 'geolocationMarker'
                lat={this.state.currentPosition.lat}
                lng={this.state.currentPosition.lng} />
              {
                this.renderMarkers()
              }
          </GoogleMapReact>
        </div>
    );
  }
}

const mapState = ({markers, users}) => ({
  markers: markers.list,
  users: users.list
})

const mapDispatch = dispatch => ({
  addMarker({lat, lng}){
    let marker = {lat, lng};
    dispatch(addMarker(marker));
   },
   rmMarker(idx){
    //  console.log('DISPATCHING ACTION REMOVE MARKER');
     dispatch(removeMarker(idx));
   }
})

export default connect(mapState,mapDispatch)(SimpleMap);
