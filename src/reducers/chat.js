import firebase from '../utils/api-config';
const db = firebase.database();

// Actions
const GET_CONVERSATION = 'GET_CONVERSATION';

// Action Creators

export const setConversation = conversation => ({
  type: GET_CONVERSATION,
  conversation,
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

    const snapshot = await db.ref(`/tours/${tourId}/messages/`).once('value');

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
