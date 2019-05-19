import React,{useState}from 'react';

const MenuList = (props) => {
  const {selected,setSelected,listIndex} = props
  // 这一次要渲染的MenuList
  const options = selected[listIndex]
  
  const handleSelect = (ev) => {
    const index = ev.currentTarget.dataset.index

    if(options[index].children===undefined){
      // 已经是最后一级了，将value渲染到input中

    }else{
      // 展开下一级，options[index].children 就是下一个要渲染的MenuList
      // 确认listIndex，提取出前面的
      setSelected([...selected.slice(0,listIndex+1),options[index].children])
    }
  }
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