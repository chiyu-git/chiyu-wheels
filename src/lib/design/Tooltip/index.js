import React,{useEffect,useRef,useState} from 'react';
import Transition from '../Transition'

import './index.less'

const Tooltip = (props) => {
  const defaultClass = 'collapse'
  const {node} = props
  const tooltip = useRef(null)
  const [show,setShow] = useState(false)
  const [offset,setOffset] = useState(
    {
      left:'auto',
      top:'auto',
    }
  )

  useEffect(() => {
    node.current.onmouseover = function(){
      setShow(true)
    }
    node.current.onmouseout = function(){
      setShow(false)
    }
    const {x,y} = node.current.getBoundingClientRect()
    setOffset({left:x,top:y-tooltip.current.offsetHeight})
  },[])
  
  return (
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
            <div className='design_tooltip_text'>{props.text||'text'}</div>
          </div>
        </div>
        )
      }}
    </Transition>
  );
};

export default Tooltip;