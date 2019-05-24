import React ,{useState,useRef}from 'react';
import Exhibit from '../components/LineHeight/Exhibit'
import {Cascader,Tooltip} from '../lib/design'
import {widthOptions,fontSizeOptions} from './CascaderList'
import './LineHeight.less'

const LineHeight = () => {
  const [width,setWidth] = useState()
  const [fontSize,setFontSize] = useState()
  const node = useRef(null)
  return (
    <section className='line-height_liquid'>
      <div className="line-height_solid">
        <Exhibit width={width}/>
        
         <Cascader
          changeParent={setWidth}
          {...widthOptions}
        />
        
        <Cascader
          changeParent={setFontSize}
          {...fontSizeOptions}
        />
        <div ref={node}>123456</div>
        <Tooltip node={node} text={'tooltip'}/>
      </div>
    </section>
  );
};

export default LineHeight;