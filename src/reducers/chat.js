import axios from 'axios';
import firebase from '../fire';
import { API_ROOT } from '../api-config';

// Actions
const GET_CONVERSATION = 'GET_CONVERSATION';

// Action Creators

export const setConversation = conversation => ({
  type: GET_CONVERSATION,
  conversation,
});

// Thunk creators

export const getConversation = toId => async dispatch => {
  try {
    const idToken = await firebase.auth().currentUser.getIdToken();
    const response = await axios.get(
      `${API_ROOT}/chat/${toId}?access_token=${idToken}`
    );
    console.log('====================================');
    console.log(response);
    console.log(idToken);
    console.log('====================================');
    const conversation = response.data;
    dispatch(setConversation(conversation));
  } catch (error) {
    console.error(error);
  }
};

// Reducer for Chat

const initialState = { conversation: [] };

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_CONVERSATION:
      return { conversation: action.conversation };

    default:
      return state;
  }
};
