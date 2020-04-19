import {
  SET_SESSION,
  CLEAR_SESSION,
  ADD_RECOMMENDATION,
  UPDATE_RECOMMENDATION_FORM,
} from "./actions";

import { signOutCognitoSession } from "../lib/cognitoUtils";

const initialState = {
  isLoggedIn: false,
  session: null,
  recommendationFormContents: {},
  recommendations: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SESSION:
      return Object.assign({}, state, {
        session: action.session,
        isLoggedIn: true,
      });

    case CLEAR_SESSION:
      signOutCognitoSession();
      return Object.assign({}, state, {
        session: null,
        isLoggedIn: false,
      });

    case ADD_RECOMMENDATION:
      let newRecommendations = state.recommendations;
      newRecommendations.push(action.recommendation);
      return Object.assign({}, state, { recommendations: newRecommendations });

    case UPDATE_RECOMMENDATION_FORM:
      return Object.assign({}, state, {
        recommendationFormContents: action.formContents,
      });

    default:
      return state;
  }
};

export default reducer;
