import firebase from "../fire";
import axios from "axios";
import { API_ROOT } from "../api-config";
const db = firebase.database();

// INITIAL STATE
const defaultSpots = {
  list: [],
  selected: null,
  addSpotOnClick: true
};

//SELECTORS
export const findSelectedMarker = (key, spots, users) => {
    let spot = spots.find(spot => {
        return spot.name === key
    });
    let user = users.find(user => {
        return user.name === key
    })
    if (spot) {
        return {spot}
    } else if (user) {
        return {user}
    }
}

// ACTION TYPE
const SET_SPOTS = "SET_SPOTS";
const ADD_SPOT = "ADD_SPOT";
const SET_SELECTED = 'SET_SELECTED';

// ACTION CREATORS
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
      console.log(spot);
      const tourId = getState().user.currentUser.tour;
      console.log(tourId);
      const idToken = await firebase.auth().currentUser.getIdToken()
      await axios.post(`${API_ROOT}/tours/${tourId}/spots?access_token=${idToken}`, spot);

      dispatch(addSpot(spot));
    } catch (error) {
      console.error(error);
    }
};

export const getSpotsThunk = () => async (dispatch, getState) => {
  const loggedInUser = getState().user.currentUser;
  const refSpots = db.ref(`/tours/${loggedInUser.tour}/spots`);

  refSpots.orderByKey().on(
    "value",
    snapshot => {
      let spotsObj = snapshot.val() || [];
      let spots = Object.keys(spotsObj).map(spotId => {
        return spotsObj[spotId];
      });

      dispatch(setSpots(spots));
    },
    error => {
      console.log("ERROR:", error.code);
    }
  );
};

// REDUCER
export default (state = defaultSpots, action) => {
  switch (action.type) {
    case SET_SPOTS:
      return { ...state, list: action.spots };
    case ADD_SPOT:
      return {
          ...state,
          spots: [...state.list, action.spot]
      }
    case SET_SELECTED:
      return {
          ...state,
          selected: action.marker
      }
    default:
      return state;
  }
};
