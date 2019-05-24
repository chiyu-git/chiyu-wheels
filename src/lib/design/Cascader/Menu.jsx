import React,{useState,useContext}from 'react';
import Slider from '../Slider'

import {ChildProps} from './index'

const MenuList = (props) => {
  const {selected,setSelected,listIndex} = props
  const childProps = useContext(ChildProps);
  // 这一次要渲染的MenuList
  const options = selected[listIndex]
  console.log(options);
  
  const handleSelect = (ev) => {
    const target = ev.currentTarget
    const index = target.dataset.index

    if(options[index].children===undefined){
      // 已经是最后一级了，将value 渲染到 input中
      childProps.setValue(options[index].value)
      // cascader 收缩
      childProps.setShowMenu(!childProps.showMenu)
      // 箭头归位
      childProps.arrow.current.classList.toggle('design_cascader_picker_arrow_active')
    }else{
      // 展开下一级，options[index].children 就是下一个要渲染的MenuList
      // 确认listIndex，提取出前面的
      setSelected([...selected.slice(0,listIndex+1),options[index].children])
    }
    // 无论是哪一级，都需要修改当前背景色
    // 还要清理同级的其他兄弟
    [...target.parentNode.children].forEach((child,i) => {
      child.classList.remove('active')
    })
    
    target.classList.toggle('active')
  }
  if(options.value !== 'slider'){
    // 渲染对应index
    return (
      <ul className='design_cascader_menu_list'>
        {options.map((option,index) => {
          let arrowRight = null
          if(option.children) arrowRight =  <i className='iconfont icon-arrow_right'></i>
          return (
            <li 
              key={option.value} 
              onClick={handleSelect}
              data-index={index}
              >
              <span>{option.value}</span>
              {arrowRight}
            </li>
          )
        })}
      </ul>
    )
  }else{
    // length类型，渲染一个Slider
    return (
      <span className='design_cascader_menu_list' style={{width:'150px'}}>
        <Slider points={options.points}/>
      </span>
    )
  }
}

const Menu = (props) => {
  const {options,className} = props
  const [selected,setSelected] = useState([options])
  /**
   * [
   *  [{value,children},{value,children}]
   *  [{value,children},{value,children}]
   *  [{value},{value}]
   * ]
   * 
   */
  // 行内盒，通过定位在input底下，多个ul行内排列
  // 全局只有一个Menu
  return (
    <div className={`design_cascader_menu_container ${className}`}>
      {selected.map((option,index) => {
        // 上一个options[index].children
        return (
          <MenuList
            selected={selected} 
            setSelected={setSelected}
            listIndex={index}
            key={index}
          />
        )
      })}
    </div>
  );
};

export default Menu;