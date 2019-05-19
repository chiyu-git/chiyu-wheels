import React ,{useState}from 'react';
import Exhibit from '../components/LineHeight/Exhibit'
import Cascader from '../lib/design/Cascader'
import './LineHeight.less'

const LineHeight = () => {
  const [width,setWidth] = useState()

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
        <label>width
          <Cascader
            defaultValue={123}
            onChange={setWidth}
            options={options}
          />
        </label>
      </div>
    </section>
  );
};

export default LineHeight;