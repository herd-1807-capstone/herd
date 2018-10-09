import firebase from '../fire';
import {API_ROOT} from '../api-config';
import axios from 'axios'
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
export const getAllUsers = () => (dispatch, getState) => {
  try{
    const loggedInUser = getState().user.currentUser;

    const userPermission = loggedInUser.status
    const tourId = loggedInUser.tour
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
                    return {...usersObj[userId], uid: userId, type:'user'};
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
                return {...usersObj[userId], uid: userId, type:'user'}
              });
            dispatch(setAllUsers(users));
          },
          error => {
            console.log('ERROR:', error.code);
          }
        );
    }
  }catch(err){
    console.log(err);
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
    if(users.indexOf(loggedInUser.uid) < 0){
      users.push(loggedInUser.uid);
    }

    idToken = await firebase.auth().currentUser.getIdToken();
    await axios.put(`${API_ROOT}/tours/${tourId}?access_token=${idToken}`, {...tour, users});

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
      default:
          return state
  }
}
