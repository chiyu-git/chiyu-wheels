import React from 'react';
import {NavLink} from 'react-router-dom'

const Nav = () => {
  return (
    <div>
      <NavLink to='/line-height'>LineHeight</NavLink><br/>
      <NavLink to='/redux-demo'>ReduxDemo</NavLink>
      
    </div>
  );
};

export default Nav;