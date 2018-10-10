import firebase from '../utils/api-config';
import axios from 'axios';
import { API_ROOT } from '../utils/api-config';
const db = firebase.database();

// Actions
const GET_CONVERSATION = 'GET_CONVERSATION';
const ADD_MESSAGE = 'ADD_MESSAGE';
const CLEAR_CONVERSATION = 'CLEAR_CONVERSATION';

// Action Creators

export const setConversation = conversation => ({
  type: GET_CONVERSATION,
  conversation,
});

export const addMessage = newMessage => ({
  type: ADD_MESSAGE,
  newMessage,
});

export const clearConversation = () => ({
  type: CLEAR_CONVERSATION,
});

// Thunk creators

export const getConversation = toId => async (dispatch, getState) => {
  try {
    const fromId = getState().user.currentUser.uid;
    const tourId = getState().user.currentUser.tour || 'disney_tour'; //fallback value

    const conversationSnapshot = await db
      .ref(`/users/${fromId}/conversations`)
      .orderByValue()
      .equalTo(toId)
      .once('value');
    const conversationObj = conversationSnapshot.val();

    // if (!conversationObj && 3) return;

    const conversationKey = Object.keys(conversationObj)[0];
    db.ref(`/tours/${tourId}/conversations/${conversationKey}`).on(
      'value',
      function(snapshot) {
        dispatch(setConversation(Object.values(snapshot.val()).reverse()));
      }
    );
  } catch (error) {
    console.error(error);
  }
};

export const addNewMessage = (userId, text) => async (dispatch, getState) => {
  const fromId = getState().user.currentUser.uid;
  const tourId = getState().user.currentUser.tour || 'disney_tour'; //fallback value
  const idToken = await firebase.auth().currentUser.getIdToken();
  const fromSnapshot = await db.ref(`/users/${fromId}`).once('value');
  const fromName = fromSnapshot.val().name;
  const toSnapshot = await db.ref(`/users/${userId}`).once('value');
  const toName = toSnapshot.val().name;

  try {
    await axios.post(`${API_ROOT}/chat/${userId}?access_token=${idToken}`, {
      fromId,
      text,
      tourId,
    });
    const newMessage = { text, toId: userId, fromId, fromName, toName };
    dispatch(addMessage(newMessage));
  } catch (error) {
    console.error(error);
  }
};

// Reducer for Chat

const initialState = {
  conversation: [],
  newMessage: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_CONVERSATION:
      return { conversation: action.conversation };

    case ADD_MESSAGE:
      return {
        ...state,
        newMessage: action.newMessage,
      };

    case CLEAR_CONVERSATION:
      return { conversation: [] };

    default:
      return state;
  }
};
