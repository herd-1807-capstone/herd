import axios from "axios";
import firebase, { API_ROOT } from "../utils/api-config";
const db = firebase.database();

// INITIAL STATE
const defaultSpots = {
  list: [],
  selected: null,
  addSpotOnClick: false
};

//SELECTORS
export const findSelectedMarker = (key, spots, users) => {
    let spot = spots.find(spot => {
        return spot.uid === key
    });
    let user = users.find(user => {
        return user.uid === key
    })
    if (spot) {
        return {...spot, type: 'spot'}
    } else if (user) {
        return {...user, type: 'user'}
    }
}

// ACTION TYPE
const SET_SPOTS = "SET_SPOTS";
const ADD_SPOT = "ADD_SPOT";
const SET_SELECTED = 'SET_SELECTED';
const REMOVE_SPOT = "REMOVE_SPOT";
const TOGGLE_ADD = 'TOGGLE_ADD';


// ACTION CREATORS

export const toggleAdd = () => ({
  type: TOGGLE_ADD
})

export const removeSpot = spotId => ({
  type: REMOVE_SPOT,
  spotId
})


const setSpots = spots => ({
  type: SET_SPOTS,
  spots
});

const addSpot = spot => ({
  type: ADD_SPOT,
  spot
});

export const setSelected = marker => ({
    type: SET_SELECTED,
    marker
})

// THUNK CREATORS
export const addSpotThunk = spot => async (dispatch, getState) => {
    try {

      const tourId = getState().user.currentUser.tour;

      const idToken = await firebase.auth().currentUser.getIdToken()
      const {data} = await axios.post(`${API_ROOT}/tours/${tourId}/spots?access_token=${idToken}`, spot);

      if (data.key){
        dispatch(addSpot(spot));
        return data.key;
      }
    } catch (error) {
      console.error(error);
    }
};

export const getSpotsThunk = () => (dispatch, getState) => {
  const loggedInUser = getState().user.currentUser;
  const refSpots = db.ref(`/tours/${loggedInUser.tour}/spots`);

  refSpots.orderByKey().on(
    "value",
    snapshot => {
      let spotsObj = snapshot.val() || [];
      let spots = Object.keys(spotsObj).map(spotId => {
        return {...spotsObj[spotId], uid: spotId, type: 'spot'};
      });

      dispatch(setSpots(spots));
    },
    error => {
      console.log("ERROR:", error.code);
    }
  );
};

export const removeSpotThunk = (spotId) => async (dispatch, getState) => {

  try {
    const idToken = await firebase.auth().currentUser.getIdToken();
    const tourId = getState().user.currentUser.tour;
    const {status} = await axios.delete(`${API_ROOT}/tours/${tourId}/spots/${spotId}?access_token=${idToken}`);
    if (status === 201){
      dispatch(removeSpot(spotId));
    }
    return status;
  } catch (error) {
    console.error(error);
  }
}

export const editSpotThunk = (spot) => async (dispatch, getState) => {
  try {
    const spotId = spot.uid;
    const idToken = await firebase.auth().currentUser.getIdToken();
    const tourId = getState().user.currentUser.tour;
    const {status} = await axios.put(`${API_ROOT}/tours/${tourId}/spots/${spotId}?access_token=${idToken}`, spot);
    if (status === 201){
      return status;
    }
  } catch (error) {
    console.error(error);
  }
}




// REDUCER
export default (state = defaultSpots, action) => {
  switch (action.type) {
    case SET_SPOTS:
      return { ...state, list: action.spots };
    case ADD_SPOT:
      return {
          ...state,
          list: [...state.list, action.spot]
      }
    case SET_SELECTED:
      return {
          ...state,
          selected: action.marker
      }
    case REMOVE_SPOT:
      return {
        ...state,
        list: state.list.filter(spot => {
          return spot.uid !== action.spotId
        })
      }
    case TOGGLE_ADD:
      return {
        ...state,
        addSpotOnClick: !state.addSpotOnClick
      }
    default:
      return state;
  }
};
