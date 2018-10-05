import firebase from '../fire';
import axios from 'axios';
import {API_ROOT} from '../api-config';

export const sendTourAnnouncement = (announcement, tourId) => async (dispatch, getState) => {
  try{
    const idToken = await firebase.auth().currentUser.getIdToken();
    // add an announcement to a tour(tourId) by finding a current tour of this logged-in user i.e., admin

    const loggedInUser = getState().user.currentUser;
    // only an admin of a tour is allowed to send out an announcement message.
    if(loggedInUser.status !== 'admin'){
      console.log("not allowed to create an announcement message");
    }else{
      const tourId = loggedInUser.tour;
      await axios.put(`${API_ROOT}/tours/${tourId}?access_token=${idToken}`, {announcement});
    }
  }catch(err){
    console.log("Unable to get permission to notify.", err);
  }
};

