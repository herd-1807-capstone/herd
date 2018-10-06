import axios from 'axios';
import firebase from '../fire';
import {API_ROOT} from '../api-config';

// initial state
const defaultTour = {
  announcement:""
}

// action_type
const GET_ANNOUNCEMENT = "GET_ANNOUNCEMENT";

// action creator
export const getAnnouncement = announcement => (
  {
    type: GET_ANNOUNCEMENT,
    announcement
  }
)

export const sendTourAnnouncement = (announcement, tourId) => async (dispatch, getState) => {
  try{
    const idToken = await firebase.auth().currentUser.getIdToken();
    // add an announcement to a tour(tourId) by finding a current tour of this logged-in user i.e., admin

    const loggedInUser = getState().user.currentUser;
    // only an admin of a tour is allowed to send out an announcement message.
    if(loggedInUser.status !== 'admin'){
      console.log("Not allowed to create an announcement message");
      return;
    }

    const tourId = loggedInUser.tour;
    await axios.put(`${API_ROOT}/tours/${tourId}?access_token=${idToken}`, {announcement});

    dispatch(getAnnouncement(announcement))
  }catch(err){
    console.log("Unable to get permission to notify.", err);
  }
};

export default(state = defaultTour, action) => {
  switch(action.type){
    case GET_ANNOUNCEMENT:
      return {...state, announcement: action.announcement};
    default:
      return state;
  }
}
