import { combineReducers } from "redux";
import recommendations from "./recommendations";
import session from "./session";

export default combineReducers({
  recommendations,
  session,
});
