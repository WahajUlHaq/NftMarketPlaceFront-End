export const SET_ITEM = "SET_ITEM";

const action = {};

action.setItems = function (payload) {
  return {
    type: SET_ITEM,
    payload,
  };
};

export default action;
