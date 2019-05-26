import React from 'react';

const Counter = (props) => {
  const handleClick = () => {
    const {store,actions} = props
    store.dispatch(actions.increment(1))
  }
  return (
    <button onClick={handleClick}>
      add
    </button>
  );
};

export default Counter;