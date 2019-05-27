/*
根据老的state和指定action, 处理返回一个新的state
 */
import {combineReducers} from '../lib/redux'
import {INCREMENT, DECREMENT,} from './actions'

export function count(state = 0, action) {
  switch (action.type) {
    case INCREMENT:
      return state + action.data
    case DECREMENT:
      return state - action.data
    /* default:
      return state */
  }
}

export default combineReducers({
  count,

})