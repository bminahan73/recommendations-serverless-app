import { SET_SESSION, CLEAR_SESSION } from "../actions";
import { signOutCognitoSession } from "../../lib/cognitoUtils";

const initialState = {
  isLoggedIn: false,
  session: null,
};

const session = (state = initialState, action) => {
  switch (action.type) {
    case SET_SESSION:
      return {
        isLoggedIn: true,
        session: action.payload.session,
      };

    case CLEAR_SESSION:
      signOutCognitoSession();
      return initialState;

    default:
      return state;
  }
};

export default session;
