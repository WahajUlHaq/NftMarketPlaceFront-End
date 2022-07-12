import { createStore } from "redux";

import rootReducer from "./rootReducer";

const store = createStore(rootReducer);

store.subscribe(() =>
  console.log("store =>", JSON.parse(JSON.stringify(store.getState())))
);

export default store;
