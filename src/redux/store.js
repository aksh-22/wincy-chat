import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducers/index";
const persistedState = localStorage.getItem("workspace")
  ? JSON.parse(localStorage.getItem("workspace"))
  : {};
const store = createStore(rootReducer, persistedState, composeWithDevTools());

store.subscribe(() => {
  localStorage.setItem("workspace", JSON.stringify(store.getState()));
});
export default store;
