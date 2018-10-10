import firebase, {API_ROOT} from '../utils/api-config';
import axios from 'axios'

const db = firebase.database();

// INITIAL STATE
const defaultUser = {
    currentUser: {},
    isLoading: false,
    list:[],
    selectedUser:{},
    historicalData: null,
    showHeatMap: false
}



// ACTION TYPES
const SET_CURRENT_USER = 'SET_CURRENT_USER';
const CHANGE_LOADING_STATE = 'CHANGE_LOADING_STATE';
const SET_ALL_USERS = 'SET_ALL_USERS';
const SET_SELECTED_USER = 'SET_SELECTED_USER';
const SET_HISTORICAL_DATA = 'SET_HISTORICAL_DATA';
const TOGGLE_HEAT_MAP = 'TOGGLE_HEAT_MAP';
const CLEAR_USERS = 'CLEAR_USERS';


// ACTION CREATORS
export const toggleHeatMap = () => ({type: TOGGLE_HEAT_MAP});
export const setCurrentUser = user => ({type: SET_CURRENT_USER, user})
export const changeLoadingState = () => ({type: CHANGE_LOADING_STATE})
export const setAllUsers = users => ({type: SET_ALL_USERS, users})
export const setSelectedUser = user => ({type: SET_SELECTED_USER, user})
export const setHistoricalData = data => ({type: SET_HISTORICAL_DATA, data});
export const clearUsers = () => ({type: CLEAR_USERS});





// THUNK CREATORS

export const toggleHeatMapThunk = () => async(dispatch, getState) => {
  dispatch(toggleHeatMap());
  const user = getState().user;
  const tourId = user.currentUser.tour;
  const showHeatMap = user.showHeatMap;
  if (showHeatMap && tourId){
    db.ref('/users/')
      .orderByChild('tour')
      .equalTo(tourId)
      .off();
    dispatch(clearUsers());
    const maps = getState().googlemap.maps;
    const map = getState().googlemap.map;
    map.setMapTypeId('silver');
    const heatmapData = getState().user.historicalData;
    if (!heatmapData) return;

    window.heatmap = new maps.visualization.HeatmapLayer({
      data: Object.keys(heatmapData).map(pointId => {
        let point = heatmapData[pointId];
        return {
          location: new maps.LatLng(point.lat, point.lng),
          weight: point.weight || 1
        }
      }),
      radius: 50,
      opacity: 0.8
    })
    window.heatmap.setMap(map);
  } else {
    try {
      await dispatch(getAllUsers());
      if (window.heatmap) window.heatmap.setMap(null);
      } catch (error) {
        console.error(error);
      }
  }
}

export const getHistoricalData = () => async(dispatch, getState) => {
  try {
    const tourId = getState().user.currentUser.tour;
    if (getState().user.historicalData) return;
    const snap = await db.ref(`/tours/${tourId}/history`).once('value');
    const data = snap.val();
    dispatch(setHistoricalData(data));
  } catch (error) {
    console.error(error);
  }
}


export const getAllUsers = () => (dispatch, getState) => {
  try{
    const loggedInUser = getState().user.currentUser;

    const userPermission = loggedInUser.status;
    const tourId = loggedInUser.tour;
    const refUsers = db.ref('/users');
    if (!tourId) return;
    refUsers
      .orderByChild('tour')
      .equalTo(tourId)
      .on('value',
        snapshot => {
          let usersObj = snapshot.val();
          let users = Object.keys(usersObj)
            .filter(userId => {
              if (userPermission === 'admin'){
                return userId !== loggedInUser.uid;
              }
              //exclude self, include visible only
              return usersObj[userId].visible && userId !== loggedInUser.uid;
            })
            .map(userId => {
              return {...usersObj[userId], uid: userId, type:'user'};
            });
          dispatch(setAllUsers(users));
        },
        error => {
          console.log('ERROR:', error.code);
        }
      );
    }catch(err){
      console.log(err)
    }
}

export const addTourToUser = tourId => async (dispatch, getState) => {
  try{
    const loggedInUser = getState().user.currentUser;
    loggedInUser.tour = tourId;

    // update the tour's users list
    let idToken = await firebase.auth().currentUser.getIdToken();
    const tourData = await axios.get(`${API_ROOT}/tours/${tourId}?access_token=${idToken}`);
    const tour = tourData.data;
    const users = tour.users || [];
    if(loggedInUser && loggedInUser.id && users.indexOf(loggedInUser.uid) < 0){
      users.push(loggedInUser.uid);
    }

    idToken = await firebase.auth().currentUser.getIdToken();
    tour.users = users;
    await axios.put(`${API_ROOT}/tours/${tourId}?access_token=${idToken}`, tour);

    // update the logged-in user's tourId to the selected tourId
    idToken = await firebase.auth().currentUser.getIdToken();
    await axios.put(`${API_ROOT}/users/${loggedInUser.uid}?access_token=${idToken}`, loggedInUser);

    // get the updated user instance and set as a current user.
    idToken = await firebase.auth().currentUser.getIdToken();
    const {data} = await axios.get(`${API_ROOT}/users/${loggedInUser.uid}?access_token=${idToken}`);
    dispatch(setCurrentUser(data));
  }catch(err){
    console.log(err);
  }
}

// REDUCER
export default (state = defaultUser, action) => {

  switch (action.type) {
      case SET_CURRENT_USER:
          return {...state, currentUser: action.user}
      case CHANGE_LOADING_STATE:
          return {...state, isLoading: !state.isLoading}
      case SET_ALL_USERS:
          return {...state, list: action.users}
      case SET_SELECTED_USER:
          return {...state, selectedUser: action.user}
      case SET_HISTORICAL_DATA:
          return {...state, historicalData: action.data}
      case TOGGLE_HEAT_MAP:
        return {...state, showHeatMap: !state.showHeatMap}
      case CLEAR_USERS:
        return {...state, list: []}
      default:
          return state
  }
}
