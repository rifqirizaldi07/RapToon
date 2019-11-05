
const initialState = {
    user: [],
    error: null,
    isLoading: true,
  }
  
  const user = (state = initialState, action) => {
    switch (action.type) {
      case `GET_USER_PENDING`:
        return {
          ...state,
          isLoading: true,
        };
      case `GET_USER_FULFILLED`:
        return {
          ...state,
          user: action.payload.data,
          isLoading: false,
        };
      case `GET_USER_REJECTED`:
        return {
          ...state,
          error: true,
          user: [],
          isLoading: false,
        };
      default:
        return state;
    }
  }
  
  export default user