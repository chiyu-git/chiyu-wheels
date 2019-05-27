import React from 'react';

const Counter = (props) => {
  const {store,actions} = props
  const handleClick = () => {
    store.dispatch(actions.increment(1))
  }
  const handleAsync = () => {
    store.dispatch(actions.incrementAsync(1))
  }
  const handleNull = () => {
    store.dispatch({type:'undefined'})
  }
  return (
    <div>
      <button onClick={handleClick}>
        add
      </button>
      <button onClick={handleAsync}>
        add 1s after
      </button>
      <button onClick={handleNull}>
        add undefined
      </button>
    </div>
  );
};

export default Counter;