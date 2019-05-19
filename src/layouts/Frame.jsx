import React from 'react';
import { Switch, Route, HashRouter } from 'react-router-dom'; 

import Nav from './Nav'; 
import LineHeight from '../containers/LineHeight'; 

const Frame = () => {
  return (
    <HashRouter>
        <Switch>
          <Route exact path='/' component={Nav}></Route>
          <Route exact path='/line-height' component={LineHeight}></Route>
        </Switch>
    </HashRouter>
  );
};

export default Frame;