import firebase from '../fire';
const db = firebase.database();

// INITIAL STATE
const defaultUser = {
    currentUser: {},
    isLoading: false,
    users:[],
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
export const getAllUsers = (user) => async dispatch => {
    let tourId
    let users
    const refUser = await db.ref('/users')
                        .orderByChild('email')
                        .equalTo(user.email)
                        .once('value')
    if(refUser){
        tourId = refUser.val().tour
        users = await db.ref('/users')
                        .orderByChild('tour')
                        .equalTo(tourId)
                        .once('value')
        if(users.length > 0) {
            dispatch(setAllUsers(users))
        }
    }
}



// REDUCER
export default function (state = defaultUser, action) {

    switch (action.type) {
        case SET_CURRENT_USER:
            return {...state, currentUser: action.user}
        case CHANGE_LOADING_STATE:
            return {...state, isLoading: !state.isLoading}
        case SET_ALL_USERS:
            return {...state, users: action.users}
        case SET_SELECTED_USER:
            return {...state, selectedUser: action.user}
        default:
            return state
    }
}