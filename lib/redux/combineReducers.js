/**
 * 
 * @param {Object} reducers 
 */

export default function combineReducers(reducers) {
  //先获取传入reducers对象的所有key
  const reducerKeys = Object.keys(reducers)
  const finalReducers = {} // 最后真正有效的reducer存在这里
  
  //下面从reducers中筛选出有效的reducer
  for(let i = 0; i < reducerKeys.length; i++){
      const key  = reducerKeys[i]
      
      if(typeof reducers[key] === 'function') {
          finalReducers[key] = reducers[key] 
      }
  }
  const finalReducerKeys = Object.keys(finalReducers);
  
  
  //返回合并后的reducer
  return function combination(state= {}, action){
    //这里的逻辑是：
    //取得每个子reducer对应的state，与action一起作为参数给每个子reducer执行
    let hasChanged = false //标志state是否有变化
      let nextState = {}
      for(let i = 0; i < finalReducerKeys.length; i++) {
          //得到本次循环的子reducer
          const key = finalReducerKeys[i]
          const reducer = finalReducers[key]
          //得到该子reducer对应的旧状态
          const previousStateForKey = state[key]
          //调用子reducer得到新状态
          const nextStateForKey = reducer(previousStateForKey, action)
          //存到nextState中（总的状态）
          nextState[key] = nextStateForKey
          //到这里时有一个问题:
          //就是如果子reducer不能处理该action，那么会返回previousStateForKey
          //也就是旧状态，当所有状态都没改变时，我们直接返回之前的state就可以了。
          hasChanged = hasChanged || previousStateForKey !== nextStateForKey
      }
      return hasChanged ? nextState : state
  }
} 