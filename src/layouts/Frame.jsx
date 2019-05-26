import React from 'react';
import { Switch, Route, HashRouter } from 'react-router-dom'; 

import Nav from './Nav'; 
import LineHeight from '../containers/LineHeight'; 
import ReduxDemo from '../containers/ReduxDemo'; 

export let StoreContext = React.createContext(null)
const Frame = (props) => {
  
  return (
    <StoreContext.Provider value={props.store}>
      <HashRouter>
        <Switch>
          <Route exact path='/' component={Nav}></Route>
          <Route exact path='/line-height' component={LineHeight}></Route>
          <Route exact path='/redux-demo' component={ReduxDemo}></Route>
        </Switch>
      </HashRouter>
    </StoreContext.Provider>
  );
};

export default Frame;