import firebase from '../fire';
import axios from 'axios';
import { API_ROOT } from '../api-config';
const db = firebase.database();

// Actions
const GET_CONVERSATION = 'GET_CONVERSATION';
const ADD_MESSAGE = 'ADD_MESSAGE';

// Action Creators

export const setConversation = conversation => ({
  type: GET_CONVERSATION,
  conversation,
});

export const addMessage = newMessage => ({
  type: ADD_MESSAGE,
  newMessage,
});

// Thunk creators

const transformObjWithNames = (obj, str1, str2, name1, name2) => {
  const list = Object.keys(obj);
  const newArray = list.map(item => {
    const { fromId, toId } = obj[item];
    const fromName = fromId === str1 ? name1 : name2;
    const toName = toId === str1 ? name1 : name2;
    return { key: item, ...obj[item], fromName, toName };
  });
  return newArray.filter(
    item =>
      (item.fromId === str1 && item.toId === str2) ||
      (item.fromId === str2 && item.toId === str1)
  );
};

export const getConversation = toId => async (dispatch, getState) => {
  try {
    const fromId = getState().user.currentUser.uid;
    const tourId = getState().user.currentUser.tour || 'disney_tour'; //fallback value

    const snapshot = await db.ref(`/tours/${tourId}/messages/`).on('value');

    const toUser = await db.ref(`/users/${toId}`).once('value');
    const toName = toUser.val().name;
    const fromUser = await db.ref(`/users/${fromId}`).once('value');
    const fromName = fromUser.val().name;

    const conversation = transformObjWithNames(
      snapshot.val(),
      fromId,
      toId,
      fromName,
      toName
    ).reverse();

    dispatch(setConversation(conversation));
  } catch (error) {
    console.error(error);
  }
};

const addNewMessage = (userId, text) => async (dispatch, getState) => {
  const fromId = getState().user.currentUser.uid;
  const tourId = getState().user.currentUser.tour || 'disney_tour'; //fallback value
  const idToken = await firebase.auth().currentUser.getIdToken();
  try {
    await axios.post(
      `${API_ROOT}/tours/${tourId}/${userId}?access_token=${idToken}`,
      text,
      tourId
    );
    const newMessage = { text, toId: userId, fromId, tourId };
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
      return { ...state, newMessage: action.newMessage };

    default:
      return state;
  }
};
