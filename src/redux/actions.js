/*
action对象的type常量名称模块
*/
export const INCREMENT = 'increment'
export const INCREMENT_ASYNC = 'increment_async'
export const DECREMENT = 'decrement'

export const increment = number => ({type: INCREMENT, data:number})
export const incrementAsync = number => (dispatch) => {
  setTimeout(() => {
    dispatch(increment(number))
  }, 1000)
}
export const decrement = number => ({type: DECREMENT, data:number})