import React,{useState,useRef} from 'react';
import Menu from './Menu'
import Transition from './Transition'

export let ChildProps = ChildProps = React.createContext(null)

const defaultClass = 'slide-down'

const Cascader = (props) => {
  const {propName,defaultValue,options,changeParent} = props
  const [value,setValue] = useState("")
  const [showMenu,setShowMenu] = useState(false)
  const arrow = useRef(null)
  const handleChange = (ev) => {
    const {value} = ev.target
    setValue(value)
    changeParent(value)
  }
  const toggleMenu = () => {
    // 切换箭头的样式
    arrow.current.classList.toggle('design_cascader_picker_arrow_active')
    // 切换菜单的显示和隐藏
    setShowMenu(!showMenu)
  }
  const childProps = {setValue,showMenu,setShowMenu,arrow}
  return (
    <label>{propName}:&nbsp;
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
          ref={arrow}
        />
        <ChildProps.Provider value={childProps}>
          <Transition in={showMenu} options={options}>
            {(status,childProps) => (
              <Menu
                className={` ${defaultClass} ${defaultClass}-${status}`}
                {...childProps}
                />
            )}
          </Transition>
        </ChildProps.Provider>
      </span>
    </label>
  );
};

export default Cascader;