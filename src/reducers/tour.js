import axios from 'axios';
import {API_ROOT} from '../api-config';
import firebase from '../fire';
const db = firebase.database();

// initial state
const defaultTour = {
  announcement: "",
  tours: [],
}

// action types
const SET_ANNOUNCEMENT = "SET_ANNOUNCEMENT"
const GET_ALL_TOURS = 'GET_ALL_TOURS'
const GET_CURRENT_TOUR = 'GET_CURRENT_TOUR'

// action creators
export const setAnnouncement = announcement => (
  {
    type: SET_ANNOUNCEMENT,
    announcement
  }
)

export const getAllTours = tours => ({
  type: GET_ALL_TOURS,
  tours
})

export const getCurrentTour = tour => {
  return {
  type: GET_CURRENT_TOUR,
  tour,
  }
}

// thunks
export const sendTourAnnouncement = (announcement) => async (dispatch, getState) => {
  try{
    const idToken = await firebase.auth().currentUser.getIdToken();
    // add an announcement to a tour(tourId) by finding a current tour of this logged-in user i.e., admin

    const loggedInUser = getState().user.currentUser;
    // only an admin of a tour is allowed to send out an announcement message.
    if(loggedInUser.status !== 'admin'){
      console.log("Not allowed to create an announcement message");
      return false;
    }

    const tourId = loggedInUser.tour;
    await axios.put(`${API_ROOT}/tours/${tourId}?access_token=${idToken}`, {announcement});

    dispatch(setAnnouncement(announcement))
    return true;
  }catch(err){
    console.log("error occurred while sending out a psa", err);
    return false;
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

export const fetchAllTours = () => async( dispatch, getState) => {
  try{
    const idToken = await firebase.auth().currentUser.getIdToken();
    const {data} = await axios.get(`${API_ROOT}/tours?access_token=${idToken}`);

    const tours = Object.keys(data).map(i => {
      const tour = data[i];
      tour.id = i;
      return tour;
    });

    dispatch(getAllTours(tours));
  }catch(err){
    console.log(err);
  }
}

export const fetchUserTour = () => async(dispatch, getState) => {
  try{
    const currentUser = await firebase.auth().currentUser;
    let idToken = await currentUser.getIdToken();
    const userData = await axios.get(`${API_ROOT}/users/${currentUser.uid}?access_token=${idToken}`);

    const user = userData.data;
    if(user.tour){
      idToken = await currentUser.getIdToken();
      const tourData = await axios.get(`${API_ROOT}/tours/${user.tour}?access_token=${idToken}`);
      dispatch(getCurrentTour(tourData.data));
    }
  }catch(err){
    console.log(err);
  }
}

export default(state = defaultTour, action) => {
  switch(action.type){
    case SET_ANNOUNCEMENT:
      return {...state, announcement: action.announcement};
    case GET_ALL_TOURS:
      return {...state, tours: action.tours};
    case GET_CURRENT_TOUR:
      return {...state, tour: action.tour};
    default:
      return state;
  }
}
