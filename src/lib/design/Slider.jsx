import React,{useState,useRef,useEffect}from 'react';
import {mouseDrag} from '../../utils/drag.js'
import {accessTransform} from '../../utils/accessTransform'

const Slider = () => {
  const container = useRef(null)
  const track = useRef(null)
  const handler = useRef(null)
  const [handlerY,setHandlerY] = useState(null)
  useEffect(() => {
    // 传递一个回调函数，同时修改 track 的height值
    mouseDrag(container.current,handler.current,{x:false})
  },[])
  useEffect(() => {
    // 只要 handler 产生了位移，track也要跟着handler
    console.log(accessTransform(handler.current));
    
  })

  return (
    <div className='design_slider_container' ref={container}>
      <div className="design_slider_rail"></div>
      <div className="design_slider_track" ref={track}></div>
      <div className="design_slider_handle" ref={handler}></div>
      <div className="design_slider_mark"></div>
    </div>
  );
};

export default Slider;