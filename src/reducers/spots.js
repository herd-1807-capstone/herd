import firebase from "../fire";
const db = firebase.database();

// INITIAL STATE
const defaultSpots = {
  list: [],
  selectedSpot: null,
  addSpotOnClick: true
};

// ACTION TYPE
const SET_SPOTS = "SET_SPOTS";
const ADD_SPOT = "ADD_SPOT";

// ACTION CREATORS
const setSpots = spots => ({
  type: SET_SPOTS,
  spots
});

const addSpot = spot => ({
  type: ADD_SPOT,
  spot
});

// THUNK CREATORS
export const addSpotThunk = spot => async dispatch => {
    //TODO: fire a POST request to backend to add spot.
    //
};

export const getSpotsThunk = () => async (dispatch, getState) => {
  const loggedInUser = getState().user.currentUser;
  console.log(loggedInUser);
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
    default:
      return state;
  }
};
