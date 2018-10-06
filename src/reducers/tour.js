import axios from 'axios';
import {API_ROOT} from '../api-config';
import firebase from '../fire';
const db = firebase.database();

// initial state
const defaultTour = {
  announcement:""
}

// action types
const SET_ANNOUNCEMENT = "SET_ANNOUNCEMENT"

// action creators
export const setAnnouncement = announcement => (
  {
    type: SET_ANNOUNCEMENT,
    announcement
  }
)

// thunks
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

    dispatch(setAnnouncement(announcement))
  }catch(err){
    console.log("Unable to get permission to notify.", err);
  }
};

export const getAnnouncement = () => async (dispatch, getState) => {
  try{
    const loggedInUser = getState().user.currentUser;
    db.ref(`/tours/${loggedInUser.tour}/announcement`).on('value', async (snapshot) => {
      const announcement = await snapshot.val();
      dispatch(setAnnouncement(announcement));
    });
  }catch(err){
    console.log(err);
  }
}

export default(state = defaultTour, action) => {
  switch(action.type){
    case SET_ANNOUNCEMENT:
      return {...state, announcement: action.announcement};
    default:
      return state;
  }
}
