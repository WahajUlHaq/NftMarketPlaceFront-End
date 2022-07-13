import axios from "../helpers/axios";

const api = {};

api.registerUser = function (body) {
  const url = `${process.env.REACT_APP_API_BASE_URL}/user/register`;

  return axios.post(url, body);
};

api.addItem = function (body) {
  const url = `${process.env.REACT_APP_API_BASE_URL}/item/add`;

  return axios.post(url, body);
};

api.getItems = function (body) {
  const url = `${process.env.REACT_APP_API_BASE_URL}/item/get/all`;

  return axios.get(url, body);
};

api.getItemsForSale = function (body) {
  const url = `${process.env.REACT_APP_API_BASE_URL}/item/sell/get/all`;

  return axios.get(url, body);
};

api.getMyItem = function (body) {
  const url = `${process.env.REACT_APP_API_BASE_URL}/item/my/get/all`;

  return axios.get(url, body);
};


api.editItem = function (body) {
  const url = `${process.env.REACT_APP_API_BASE_URL}/item/edit`;

  return axios.patch(url, body);
};


export default api;
