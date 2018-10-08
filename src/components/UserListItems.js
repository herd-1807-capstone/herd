import React, {Component} from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import RecordVoiceOver from '@material-ui/icons/RecordVoiceOver';
import PeopleIcon from '@material-ui/icons/People';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Announcement from '@material-ui/icons/Announcement';
import AddAlert from '@material-ui/icons/AddAlert';
import Divider from '@material-ui/core/Divider';
import { connect } from 'react-redux';
import MapIcon from '@material-ui/icons/Map';
import { setSelected } from '../reducers/spots'

class UserListItems extends Component {
  constructor(props){
    super(props);
    this.state = {
      tourPreview: false
    }
  }
  tourPreview = () =>{
    const {map, spots, menuToggle, reselect} = this.props
    menuToggle()();
    this.setState({tourPreview: true}, async() => {
      let selected;
      let i = 0;

      const loop = () => {
        this.timeOut = setTimeout(()=>{
          console.log('CURRENT SPOT!!!', selected);
          selected = spots[i];
          if (!this.state.tourPreview) {
            if (this.timeOut) clearTimeout(this.timeOut);
          };
          reselect(selected);
          if (selected.lat && selected.lng ){
            const {lat, lng} = selected;
            map.setZoom(15);
            map.panTo({lat, lng});
            window.infoWindow.setContent(selected && (selected.name || selected.uid));
            window.infoWindow.setPosition({lat, lng})
            window.infoWindow.open(map)
          }
          i++;
          if (this.state.tourPreview && (i < spots.length) ) loop();
          if (i === spots.length - 1) {
            this.stopPreview();
          }
        }, 3000)
      }
      loop();
    });
  }
  stopPreview= () =>{
    this.setState({tourPreview: false});
    clearInterval(this.previewId);
  }
  render(){
    const { handleInfoSpot, handleChatStart } = this.props;
    return (
      <div>
        <ListItem button>
          <ListItemIcon>
            <AddAlert />
          </ListItemIcon>
          <ListItemText primary="Emergency Signal" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Add a Spot" />
        </ListItem>
        {this.state.tourPreview ?
        <ListItem button onClick= {this.stopPreview}>
          <ListItemIcon>
            <MapIcon/>
          </ListItemIcon>
        <ListItemText primary="Stop preview" />
      </ListItem>
        : <ListItem button onClick= {this.tourPreview}>
          <ListItemIcon>
            <MapIcon/>
          </ListItemIcon>
          <ListItemText primary="Tour preview" />
        </ListItem> }
        <ListItem button>
          <ListItemIcon>
            <VisibilityOff />
          </ListItemIcon>
          <ListItemText primary="Visibility on Map" />
        </ListItem>
        <Divider />
        <ListItem button onClick={handleInfoSpot}>
          <ListItemIcon>
            <Announcement />
          </ListItemIcon>
          <ListItemText primary="Info on a Spot" />
        </ListItem>
        <ListItem button onClick={handleChatStart}>
          <ListItemIcon>
            <RecordVoiceOver />
          </ListItemIcon>
          <ListItemText primary="Start a Chat" />
        </ListItem>
      </div>
    );
  }
};

const mapState = ({googlemap, spots}) => ({
  map: googlemap.map,
  spots: spots.list
})

const mapDispatch = (dispatch) => ({
  reselect(spot){
    dispatch(setSelected(spot))
  }
})
export default connect(mapState, mapDispatch)(UserListItems);
