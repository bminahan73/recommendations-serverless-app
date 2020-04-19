import { ADD_RECOMMENDATION } from "../actions";

const recommendations = (state = [], action) => {
  switch (action.type) {
    case ADD_RECOMMENDATION:
      return [...state, action.payload.recommendation];

    default:
      return state;
  }
};

export default recommendations;
