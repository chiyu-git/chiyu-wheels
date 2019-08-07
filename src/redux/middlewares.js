export const logger = store => next => action => {
  console.log('dispatching', action)
  // next 就是上一个middleware包装后的dispatch
  let result = next(action)
  console.log('next state', store.getState())
  return result
}

function createThunkMiddleware(...args) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState, ...args);
    }

    return next(action);
  };
}

export const thunk = createThunkMiddleware()

// export const thunk = ({dispatch,getState}) => next => action =>{
//   if (typeof action === 'function') {
//     return action(dispatch, getState);
//   }
//   return next(action);
// }