import React ,{useState}from 'react';
import Exhibit from '../components/LineHeight/Exhibit'
import {Cascader,Slider} from '../lib/design'
import {widthOptions,fontSizeOptions} from './CascaderList'
import './LineHeight.less'

const LineHeight = () => {
  const [width,setWidth] = useState()
  const [fontSize,setFontSize] = useState()

  const options = [
    {
      value: 'zhejiang',
      children: [
        {
          value: 'hangzhou',
          children: [
            {
              value: 'xihu',
            },
          ],
        },
      ],
    },
    {
      value: 'jiangsu',
      children: [
        {
          value: 'nanjing',
          children: [
            {
              value: 'zhonghuamen',
            },
          ],
        },
      ],
    },
  ];
  
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
        <div style={{height:'100px'}}>
          <Slider/>
        </div>
      </div>
    </section>
  );
};

export default LineHeight;