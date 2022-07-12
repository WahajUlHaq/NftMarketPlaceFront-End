import { combineReducers } from "redux";

import user from "./user/reducer";
import items from "./items/reducer";

const reducers = combineReducers({
  user,
  items,
});

export default reducers;
