import {createStore,applyMiddleware} from '../lib/redux'
import combineCounter from './reducers'
import {logger,thunk} from './middlewares'

// 根据counter函数创建store对象
const store = createStore(combineCounter,applyMiddleware(logger,thunk))

export default store