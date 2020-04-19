export const SET_SESSION = "SET_SESSION";
export const CLEAR_SESSION = "CLEAR_SESSION";
export const ADD_RECOMMENDATION = "ADD_RECOMMENDATION";
export const UPDATE_RECOMMENDATION_FORM = "UPDATE_RECOMMENDATION_FORM";

export const setSession = (session) => ({
  type: SET_SESSION,
  session: session,
});

export const clearSession = function () {
  return {
    type: CLEAR_SESSION,
  };
};

export const addRecommendation = (recommendation) => ({
  type: ADD_RECOMMENDATION,
  recommendation: recommendation,
});

export const updateRecommendationForm = (formContents) => ({
  type: UPDATE_RECOMMENDATION_FORM,
  formContents: formContents,
});
