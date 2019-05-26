import {createStore} from '../lib/redux'
import {counter} from './reducers'

// 根据counter函数创建store对象
const store = createStore(counter)

export default store