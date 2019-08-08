import React,{useState,useRef,useEffect}from 'react';
import {mouseDrag} from '../../../utils'
import Tooltip from '../Tooltip'

import './index.less'

const Slider = (props) => {
  const container = useRef(null)
  const handler = useRef(null)
  const track = useRef(null)
  const [text,setText] = useState(0)
  useEffect(() => {
    const changeTrack = (track) => {
      return function (x){
        // 不知道为什么当快速滑动的时候，有时不会执行，进度条的高度无法改变
        // 因为取值是[7,-93]，正负值得变化会使得失效，修正为[0,100]
        // 取值是[-7,93]
        track.current.style.width = x+7+'px'
        setText(x+7)
      }
    }

    // 传递一个回调函数，同时修改 track 的height值
    mouseDrag(
      container.current,
      handler.current,
      {y:false},
      changeTrack(track)
    )

    return () => {
      // 如何消除闭包？防止内存泄漏，保存这callback变量的只有第4参数
    }
  },[])



  return(
    <div className='design_slider_container' ref={container}>
      <div className="design_slider_rail"></div>
      <div className="design_slider_track" ref={track}></div>
      <div className="design_slider_handle" ref={handler}></div>
      <div className="design_slider_step">
        {props.points.map((point,i) => {
          return <span 
            className="design_slider_dot" 
            style={{left:`${point}%`}}
            key={point}>
          </span>
        })}
      </div>
      <div className="design_slider_mark">
        {props.points.map((point,i) => {
            return <span 
              className="design_slider_mark_text" 
              style={{left:`${point}%`}}
              key={point}>
              &nbsp;&nbsp;{point}%</span>
          })}
      </div>
      <Tooltip node={handler} text={text}/>
    </div>
  );
};

export default Slider;