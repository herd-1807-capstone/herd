import firebase from '../fire';
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
  if (showHeatMap){
    db.ref('/users/')
      .orderByChild('tour')
      .equalTo(tourId)
      .off();
    dispatch(clearUsers());
    const maps = getState().googlemap.maps;
    const map = getState().googlemap.map;
    const heatmapData = getState().user.historicalData;

    window.heatmap = new maps.visualization.HeatmapLayer({
      data: Object.keys(heatmapData).map(pointId => {
        let point = heatmapData[pointId];
        return new maps.LatLng(point.lat, point.lng)
      })
    })
    window.heatmap.setMap(map);
  } else {
      if (window.heatmap) return window.heatmap.setMap(null);
      try {
        await dispatch(getAllUsers());
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
    const loggedInUser = getState().user.currentUser;

    const userPermission = loggedInUser.status;
    const tourId = loggedInUser.tour;
        const refUsers = db.ref('/users');
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
