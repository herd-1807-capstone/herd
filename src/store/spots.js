import firebase from '../fire';
const db = firebase.database();

// INITIAL STATE
const defaultSpots = {
    spots: []
}


// ACTION TYPE
const SET_SPOTS = 'SET_SPOTS'

// ACTION CREATORS
const setSpots = (spots) => ({type: SET_SPOTS, spots})

// THUNK CREATORS
export const getSpotsThunk = () => async (dispatch, getState) => {
    let { currentUser } = getState().user
    const refSpots = db.ref(`/tours/${currentUser.tourId}/spots`);
    dispatch(setSpots(refSpots))


    // refSpotIds.on('value', (snapshot)=> {
    //   let spotIds = snapshot.val();
    //   spotIds.forEach(spotId => {
    //     db.ref(`/spots/${spotId}`).on('value', (snapshot)=>{
    //       let spot = snapshot.val();
    //       console.log('SPOT CHANGING!!!', spot);
    //       this.setState({
    //         spots: {
    //           ...this.state.spots,
    //           [spotId]: spot
    //         }
    //       })
    //     })
    //   })
    // })
}

// REDUCER
export default function (state = defaultSpots, action) {

    switch (action.type) {
        case SET_SPOTS:
            return {...state, spots: action.spots}
        default:
            return state
    }
}