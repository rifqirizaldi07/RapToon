

const initialState = {
  sketch: [],
  error: null,
  isLoading: true,
}

const sketch = (state = initialState, action) => {
  switch (action.type) {
    case `GET_ALL_SKETCH_PENDING`:
      return {
        ...state,
        isLoading: true,
      };
    case `GET_ALL_SKETCH_FULFILLED`:
      return {
        ...state,
        sketch: action.payload.data,
        isLoading: false,
      };
    case `GET_ALL_SKETCH_REJECTED`:
      return {
        ...state,
        error: true,
        isLoading: false,
      };
    default:
      return state;
  }
}

export default sketch