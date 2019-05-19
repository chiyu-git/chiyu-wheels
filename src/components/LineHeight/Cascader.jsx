import React,{useState,useRef} from 'react';
import Menu from './Menu'
import Transition from './Transition'

const defaultClass = 'slide-down'

const Cascader = (props) => {
  const {defaultValue,options,onChange} = props
  const [value,setValue] = useState("")
  const [showMenu,setShowMenu] = useState(false)
  const handleChange = (ev) => {
    const {value:_value} = ev.target
    setValue(_value)
    onChange(_value)
  }
  const toggleMenu = (ev) => {
    // 切换箭头的样式
    ev.target.classList.toggle('design_cascader_picker_arrow_active')
    // 切换菜单的显示和隐藏
    setShowMenu(!showMenu)
  }
  
  return (
    <span className='design_cascader_picker'>
      <input 
        type="text"
        value={value}
        placeholder={defaultValue}
        className='design'
        onChange={handleChange}
      />
      <i className='design_cascader_picker_arrow iconfont icon-arrow_down'
        onClick={toggleMenu}
      />
      <Transition in={showMenu} options={options}>
        {(status,childProps) => (
          <Menu
            className={` ${defaultClass} ${defaultClass}-${status}`}
            {...childProps}
            />
        )}
      </Transition>
    </span>

  );
};

export default Cascader;