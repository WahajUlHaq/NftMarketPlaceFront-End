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

api.editAuctionId = function (body) {
  const url = `${process.env.REACT_APP_API_BASE_URL}/item/edit/auction/id`;

  return axios.patch(url, body);
};

api.bid = function (body) {
  const url = `${process.env.REACT_APP_API_BASE_URL}/item/bid`;

  return axios.post(url, body);
};

api.editbid = function (body) {
  const url = `${process.env.REACT_APP_API_BASE_URL}/item/bid`;

  return axios.patch(url, body);
};

api.highetsBid = function (body) {
  const url = `${process.env.REACT_APP_API_BASE_URL}/item/bid/highest`;

  return axios.get(url, body);
};

api.getMyBid = function (body) {
  const url = `${process.env.REACT_APP_API_BASE_URL}/item/bid/my`;

  return axios.get(url, body);
};

api.getHighestBidOfAll = function (body) {
  const url = `${process.env.REACT_APP_API_BASE_URL}/item/bid/highest/all`;

  return axios.get(url, body);
};

export default api;
