import firebase from '../fire';
const db = firebase.database();

// INITIAL STATE
const defaultUser = {
    currentUser: {},
    isLoading: false,
    list:[],
    selectedUser:{},
}

// ACTION TYPES
const SET_CURRENT_USER = 'SET_CURRENT_USER'
const CHANGE_LOADING_STATE = 'CHANGE_LOADING_STATE'
const SET_ALL_USERS = 'SET_ALL_USERS'
const SET_SELECTED_USER = 'SET_SELECTED_USER'

// ACTION CREATORS
export const setCurrentUser = user => ({type: SET_CURRENT_USER, user})
export const changeLoadingState = () => ({type: CHANGE_LOADING_STATE})
const setAllUsers = users => ({type: SET_ALL_USERS, users})
export const setSelectedUser = user => ({type: SET_SELECTED_USER, user})

// THUNK CREATORS
export const getAllUsers = () => async (dispatch, getState) => {
    const loggedInUser = getState().user.currentUser;

    const userPermission = loggedInUser.status || 'member' //fallback value
    const tourId = loggedInUser.tour || 'disney_tour' //fallback value
    //non-admin user

    if (userPermission !== 'admin'){
        const refUsers = db.ref('/users');
          refUsers
            .orderByChild('tour')
            .equalTo(tourId)
            .on('value',
              snapshot => {
                let usersObj = snapshot.val() || [];
                let users = Object.keys(usersObj)
                  .filter(userId => {
                    //exclude self, include visible only
                    return usersObj[userId].visible && userId !== loggedInUser.uid;
                  })
                  .map(userId => {
                    return usersObj[userId];
                  });
                dispatch(setAllUsers(users));
              },
              error => {
                console.log('ERROR:', error.code);
              }
            );
    } else {
        //admin user
        const refUsers = db.ref('/users');
        refUsers
        .orderByChild('tour')
        .equalTo(tourId)
        .on(
          'value',
          snapshot => {
            let usersObj = snapshot.val() || [];
            let users = Object.keys(usersObj)
              .filter(userId => {
                return userId !== loggedInUser.uid; //exclude self
              })
              .map(userId => {
                return usersObj[userId];
              });
            dispatch(setAllUsers(users));
          },
          error => {
            console.log('ERROR:', error.code);
          }
        );
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
        default:
            return state
    }
}
