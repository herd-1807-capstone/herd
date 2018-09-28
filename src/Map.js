import React, { Component} from 'react';
import GoogleMapReact from 'google-map-react';

import GeolocationMarker from './GeolocationMarker';
import GOOGLE_API_KEY from './secrets' ;
import firebase from './fire'
import {Spot, Admin, User} from './Marker';

const db = firebase.database();

class SimpleMap extends Component {
  static defaultProps = {
    center: {
      lat: 28.4177,
      lng: -81.5812
    },
    zoom: 18
  };
  constructor(props){
    super(props);
    this.state = {
      currentPosition: {
        lat: 28.4177,
        lng: -81.5812
      },
      zoom: 18,
      center: {
        lat: 28.4177,
        lng: -81.5812
      },
      spots: [],
      users: [],
      map: null,
      maps: null,
    }
  }
  componentDidMount(){
    const ref = db.ref('/tours/disney_tour/spots');
    ref.orderByKey().on('value', (snapshot)=>{
      let spots = snapshot.val();
      let spotsArr = Object.keys(spots).map(key => {
        return spots[key]
      })
      this.setState({
        spots: spotsArr
      })
    }, (error) => {
      console.log('ERROR:', error.code);
    })

    const refUsers = db.ref('/users');
    refUsers.orderByKey().on('value', (snapshot)=>{
      let users = snapshot.val();
      let usersArr = Object.keys(users).map(key => {
        return users[key]
      })
      this.setState({
        users: usersArr
      })
    }, (error) => {
      console.log('ERROR:', error.code);
    })

  }

  renderSpots(){
    return this.state.spots.map((loc) => {
      return (
      <Spot
        key = {loc.name}
        lat={loc.lat}
        lng={loc.lng} />)
    });
  }
  renderUsers(){
    return this.state.users.map((user) => {
      if (user.status === 'admin') {
        return (
          <Admin
            key = {user.name}
            lat= {user.lat}
            lng = {user.lng} />
        )
      }
      return (
      <User
        key = {user.name}
        lat={user.lat}
        lng={user.lng} />)
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
            center={this.state.center}
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
    );
  }
}



export default SimpleMap;
