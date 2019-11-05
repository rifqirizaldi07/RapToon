
const initialState = {
  favorite: [],
  error: null,
  isLoading: true,
}

const favorite = (state = initialState, action) => {
  switch (action.type) {
    case `GET_FAVS_PENDING`:
      return {
        ...state,
        isLoading: true,
      };
    case `GET_FAVS_FULFILLED`:
      return {
        ...state,
        favorite: action.payload.data,
        isLoading: false,
      };
    case `GET_FAVS_REJECTED`:
      return {
        ...state,
        error: true,
        favorite: [],
        isLoading: false,
      };
    default:
      return state;
  }
}

export default favorite