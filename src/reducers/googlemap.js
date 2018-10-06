const initialState = {
  map: null,
  maps: null
};

const SET_GOOGLE_MAP = 'SET_GOOGLE_MAP';

export const setGoogleMap = (map, maps) => ({
  type: SET_GOOGLE_MAP,
  map,
  maps
})

const googlemap = (state =initialState, action) => {
  switch(action.type){
    case SET_GOOGLE_MAP:
      return {
        ...state,
        map: action.map,
        maps: action.maps
      }
    default:
      return state
  }
}

export default googlemap
