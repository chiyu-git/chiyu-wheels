import React from 'react';

import './Exhibit.less'
import imgMiddle from './img/img2-middle.jpg'
const Exhibit = (props) => {
  const {width} = props
  
  return (
    <div className='exhibit_area'>
    <h2>line-height&vertical-align</h2>
    <div className='exhibit_container'>
      <span className='exhibit_strut'>lx</span>&thinsp;
      <span className='exhibit_text'>txt</span>&thinsp;
      <img src={imgMiddle} alt="you" title='you'/>&thinsp;
      <span className='exhibit_square'></span>&thinsp;
      <span className='exhibit_square'>x</span>&thinsp;
    </div>
    </div>
  );
};

export default Exhibit;