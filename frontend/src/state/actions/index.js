export const SET_SESSION = "SET_SESSION";
export const CLEAR_SESSION = "CLEAR_SESSION";
export const ADD_RECOMMENDATION = "ADD_RECOMMENDATION";

export const setSession = (session) => ({
  type: SET_SESSION,
  payload: {
    session: session,
  },
});

export const clearSession = function () {
  return {
    type: CLEAR_SESSION,
  };
};

export const addRecommendation = (recommendation) => ({
  type: ADD_RECOMMENDATION,
  payload: {
    recommendation: recommendation,
  },
});
