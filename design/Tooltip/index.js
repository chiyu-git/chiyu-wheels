import React,{useEffect,useRef,useState} from 'react';
import ReactDOM from 'react-dom'
import Transition from '../Transition'

import './index.less'
import { isAbsolute } from 'path';

const Tooltip = (props) => {
  const defaultClass = 'collapse'
  const {node} = props
  const tooltip = useRef(null)
  const [show,setShow] = useState(false)
  const [offset,setOffset] = useState(
    {
      position:'fixed',
      left:'auto',
      top:'auto',
    }
  )
  const setToolTip = () => {
    setShow(true)
    const {x} = node.current.getBoundingClientRect()
    // 一半的tooltip，在加上半个箭头，因为是border，所以无法offsetWidth
    setOffset({left:x-tooltip.current.offsetWidth/2+5})
  }
  useEffect(() => {
    const {y} = node.current.getBoundingClientRect()
    setOffset({top:y-tooltip.current.offsetHeight})

    node.current.addEventListener('mouseover',function(){
      setToolTip()
    })

    node.current.addEventListener('mousedown',function(){
      const move = function(){
        setToolTip()
      }
      document.addEventListener('mousemove',move)

      document.addEventListener('mouseup',function(){
        setShow(false)
        document.removeEventListener('mousemove',move)
      },{once:true})
    })

    node.current.addEventListener('mouseout',function(){
      setShow(false)
    })

  },[])
  return ReactDOM.createPortal(
    (
      <Transition in={show}>
        {(state) => {
          return (
            <div 
            className={`
              design_tooltip_container
              ${defaultClass}
              ${defaultClass}-${state}
            ` }
            ref={tooltip}
            style={offset}
          > 
            <div className='design_tooltip_content'>
              <div className='design_tooltip_arrow'></div>
              <div className='design_tooltip_text'>{props.text||'0'}</div>
            </div>
          </div>
          )
        }}
      </Transition>
    ),
    document.body
  );

};

export default Tooltip;