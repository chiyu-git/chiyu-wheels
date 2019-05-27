import React, { useContext } from 'react';
import Count from '../components/ReduxDemo/Count'
import Counter from '../components/ReduxDemo/Counter'
import { StoreContext } from '../layouts/Frame'
import * as actions from '../redux/actions.js'
const ReduxDemo = () => {

  const store = useContext(StoreContext)

  return (
    <div>
      <Count state={store.getState()}></Count>
      <Counter store={store} actions={actions} />
    </div>
  );
};

export default ReduxDemo;