import React, { Fragment, Component } from 'react';
import GOOGLE_API_KEY from './secrets';
import GoogleMapReact from 'google-map-react';
import firebase from './fire';

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

  }
  onApiLoaded(){

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

        </GoogleMapReact>
      </div>
    )
  }
}

export default HeatMap;
