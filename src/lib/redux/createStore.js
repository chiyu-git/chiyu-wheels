/**
 * @param {Function} reducer 
 * @param {any} [preloadedState] 
 * @param {Function} [enhancer] 
 * @returns {Store}
 */
export default function createStore(reducer, preloadedState) {

  let currentReducer = reducer // 当前store中的reducer，是一个函数，聚合了所有子reducer
  let currentState = preloadedState // 当前store中存储的状态 ???
  let currentListeners = [] // 当前store中放置的监听函数
  let nextListeners = currentListeners // 下一次dispatch时的监听函数
  // 注意：当我们新添加一个监听函数时，只会在下一次dispatch的时候生效。

  // 获取state
  function getState() {
    return currentState
  }

/**
 * @param {function} listener 
 */
  function subscribe(listener) {
    // 添加到监听函数数组，
    // 注意：我们添加到了下一次dispatch时才会生效的数组
    nextListeners.push(listener)

    let isSubscribe = true //设置一个标志，标志该监听器已经订阅了
    // 返回取消订阅的函数，即从数组中删除该监听函数
    return function unsubscribe() {
      if (!isSubscribe) {
        return // 如果已经取消订阅过了，直接返回
      }

      isSubscribe = false
      // 从下一轮的监听函数数组（用于下一次dispatch）中删除这个监听器。
      const index = nextListeners.indexOf(listener)
      nextListeners.splice(index, 1)
    }
  }

  function dispatch(action) {
    //调用reducer，得到新state
    currentState = currentReducer(currentState, action);

    //更新监听数组
    currentListeners = nextListeners;
    //调用监听数组中的所有监听函数
    for (let i = 0; i < currentListeners.length; i++) {
      const listener = currentListeners[i];
      listener();
    }
  }

  // dispatch一个用于初始化的action，相当于调用一次reducer
  // 因为reducer的switch定义了default值，所以可以成功返回
  dispatch({ type: 'init' })

  return {
    dispatch,
    subscribe,
    getState,
    //下面两个是主要面向库开发者的方法，暂时先忽略
    //replaceReducer,
    //observable
  }
}