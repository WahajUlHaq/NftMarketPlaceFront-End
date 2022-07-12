export const SET_USER = "SET_USER";

const action = {};

action.setUser = function (payload) {
  return {
    type: SET_USER,
    payload,
  };
};

export default action;
