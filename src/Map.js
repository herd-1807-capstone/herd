import React, { Fragment, Component } from 'react';
import GoogleMapReact from 'google-map-react';
import GeolocationMarker from './GeolocationMarker';
import GOOGLE_API_KEY from './secrets';
import firebase from './fire';
import { Spot, Admin, User } from './Marker';
import BottomDrawer from './BottomDrawer';
import axios from 'axios';

const db = firebase.database();

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
      spots: [],
      users: [],
      user: null,
      map: null,
      maps: null,
    };
    this.onMapClick = this.onMapClick.bind(this);
    this.setCoords = this.setCoords.bind(this);
    this.watchCurrentPosition = this.watchCurrentPosition.bind(this);
    this.centerToCurrentPosition = this.centerToCurrentPosition.bind(this);
    this.writeCurrentPosition = this.writeCurrentPosition.bind(this);
  }
  async writeCurrentPosition(lat, lng) {
    const tourId = (this.state.user && this.state.user.tour) || 'disney_tour';
    const userId = firebase.auth().currentUser.uid || 'user1';
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
    //hide from other users, but not admin, while GPS is active
  }
  onMapClick(evt) {
    //TODO: add marker to clicked location
  }
  centerToCurrentPosition() {
    this.setState(
      {
        center: {
          lat: this.state.currentPosition.lat,
          lng: this.state.currentPosition.lng,
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
  async componentDidMount() {
    this.watchCurrentPosition();
    // let loggedInUser = firebase.auth().currentUser;
    let loggedInUser = {};
    loggedInUser.uid = 'user1'; //temporary values
    let userInfo;
    let tourId;
    let userPermission;
    try {
      //check whether loggedInUser is authorized to access all users' location
      let snapshot = await db.ref(`/users/${loggedInUser.uid}`).once('value');
      userInfo = snapshot.val();
      tourId = userInfo.tour || 'disney_tour'; //fall back value temporarily
      userPermission = userInfo.status || 'member';
      this.setState({ user: userInfo });
    } catch (error) {
      console.error(error);
    }

    //show all 'spots' to everyone
    const refSpots = db.ref(`/tours/${tourId}/spots`);
    refSpots.orderByKey().on(
      'value',
      snapshot => {
        let spots = snapshot.val() || [];
        let spotsArr = Object.keys(spots).map(spotId => {
          return spots[spotId];
        });
        this.setState({
          spots: spotsArr,
        });
      },
      error => {
        console.log('ERROR:', error.code);
      }
    );

    if (userPermission !== 'admin') {
      //restrict view to only visible users and except for yourself
      const refUsers = db.ref('/users');
      refUsers
        .orderByChild('tour')
        .equalTo(tourId)
        .on(
          'value',
          snapshot => {
            let users = snapshot.val() || [];
            let usersArr = Object.keys(users)
              .filter(userId => {
                //exclude self, include visible only
                return users[userId].visible && userId !== loggedInUser.uid;
              })
              .map(userId => {
                return users[userId];
              });

            console.log('USERS ARR', usersArr);
            this.setState({
              users: usersArr,
            });
          },
          error => {
            console.log('ERROR:', error.code);
          }
        );
    } else {
      //admins can see all users in their tour
      const refUsers = db.ref('/users');
      refUsers
        .orderByChild('tour')
        .equalTo(tourId)
        .on(
          'value',
          snapshot => {
            let users = snapshot.val() || [];
            let usersArr = Object.keys(users)
              .filter(userId => {
                return userId !== loggedInUser.uid; //exclude self
              })
              .map(userId => {
                return users[userId];
              });
            this.setState({
              users: usersArr,
            });
          },
          error => {
            console.log('ERROR:', error.code);
          }
        );
    }
  }
  componentWillUnmount() {
    if ('geolocation' in navigator) {
      navigator.geolocation.clearWatch(this.geoWatchId);
    }
  }
  renderSpots() {
    return this.state.spots.map(loc => {
      return <Spot key={loc.name} lat={loc.lat} lng={loc.lng} />;
    });
  }
  renderUsers() {
    return this.state.users.map(user => {
      if (user.status === 'admin') {
        return <Admin key={user.name} lat={user.lat} lng={user.lng} />;
      }
      return <User key={user.name} lat={user.lat} lng={user.lng} />;
    });
  }
  render() {
    return (
      // Important! Always set the container height explicitly
      <Fragment>
        <div id="google-map">
          <GoogleMapReact
            bootstrapURLKeys={{ key: GOOGLE_API_KEY }}
            defaultCenter={this.props.center}
            defaultZoom={this.props.zoom}
            center={this.state.center}
          >
            <GeolocationMarker
              key="geolocationMarker"
              lat={this.state.currentPosition.lat}
              lng={this.state.currentPosition.lng}
            />
            {this.renderSpots()}
            {this.renderUsers()}
          </GoogleMapReact>
        </div>
        {/* <BottomDrawer id = 'bottom-drawer'/> */}
      </Fragment>
    );
  }
}

export default SimpleMap;
