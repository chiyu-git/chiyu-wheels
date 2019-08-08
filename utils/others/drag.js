import {accessTransform} from './accessTransform'

/**
 * @param {node} container
 * @param {node} inner
 * @param {object} options
 * @return {boolean}
 */
export function touchDrag(
  container,
  inner,
  options,
  ){
  const defaults = {
    x:true, // 是否允许x轴拖拽
    y:true, // 是否允许y轴拖拽
    overflow:true,
  } 
  options = Object.assign(defaults,options)

  // 如何保证inner只在容器内滑动？首先把事件添加给容器，还要做超出限制
  let elementStart = {x:0,y:0} // inner 当前的位置,距离container的偏移
  let fingerStart = {x:0,y:0}    // 手指当前的位置,初始化为0
  let fingerOffset = {left:0,top:0} // 初始化手指偏移量L
  const maxOffset = {
    left:container.offsetWidth-inner.offsetWidth,
    top:container.offsetHeight-inner.offsetHeight,
  }
  // 给 container 添加事件监听
  container.addEventListener('touchstart',function(ev){
    // 清空过渡
    inner.style.transition =""
    ev = ev || window.ev
    const changedTouch = ev.changedTouches[0]

      elementStart.x = accessTransform(inner,"translateX")
      fingerStart.x = changedTouch.clientX

      elementStart.y = accessTransform(inner,"translateY")
      fingerStart.y = changedTouch.clientY
  })

  container.addEventListener('touchmove',function(ev){
    ev = ev || window.ev
    // 求出手指的偏移量
    const changedTouch = ev.changedTouches[0]

      fingerOffset.left = changedTouch.clientX - fingerStart.x
      // 修改元素的位置
      let translateX =  elementStart.x + fingerOffset.left
      if(!options.x) translateX = 0 
      accessTransform(inner,'translateX',translateX)

      fingerOffset.top = changedTouch.clientY - fingerStart.y
      let translateY =  elementStart.y + fingerOffset.top
      if(!options.y) translateY = 0
      accessTransform(inner,'translateY',translateY)
  })

  container.addEventListener('touchend',function(){
    // 容器内拖拽过程中，translateX是一个负数，[maxOffset,-0]
    let translateX = accessTransform(inner,'translateX')
    // 容器内拖拽过程中，translateY是一个正数，[0，maxOffset]
    let translateY = accessTransform(inner,'translateY')
    
    // 超出控制
    if(translateX>0){
      translateX = 0
      inner.style.transition ="1s transform"
      accessTransform(inner,'translateX',translateX)
    }
     // 不是连续的区间，不是连续的逻辑，不建议使用if else
    if(translateX<maxOffset.left){
      translateX = maxOffset.left
      inner.style.transition ="1s transform"
      accessTransform(inner,'translateX',translateX)
    }
    if(translateY>maxOffset.top){
      translateY = maxOffset.top
      inner.style.transition ="1s transform"
      accessTransform(inner,'translateY',translateY)
    }
    if(translateY<0){
      translateY = 0
      inner.style.transition = "1s transform"
      accessTransform(inner,'translateY',translateY)
    }
  })
}

/**
 * @param {node} container
 * @param {node} inner
 * @param {object} options
 * @param {function} function
 * @return {boolean}
 */

export function mouseDrag(
  container,
  inner,
  { // 参数默认值配合解构赋值使用
    x=true, // 是否允许x轴拖拽
    y=true, // 是否允许y轴拖拽
    // overflow=true,
  }={},
  callback=function(){},
){
  
  let elementStart = {x:0,y:0} // inner 当前的位置,距离container的偏移
  let mouseStart = {x:0,y:0}    // 鼠标当前的位置,初始化为0
  let mouseOffset = {left:0,top:0} // 初始化鼠标偏移量
  const maxOffset = {
    left:container.offsetWidth-inner.offsetWidth/2,
    top:container.offsetHeight-inner.offsetHeight/2,
  }
  
  container.onmousedown = function(ev){
    ev = ev || event

    elementStart.x = accessTransform(inner,'translateX')
    elementStart.y = accessTransform(inner,'translateY')

    mouseStart.x = ev.clientX
    mouseStart.y = ev.clientY

    document.onmousemove = function(ev){
      ev = ev  || event
      mouseOffset.left = ev.clientX - mouseStart.x 
      mouseOffset.top = ev.clientY - mouseStart.y

      let translateX = elementStart.x + mouseOffset.left
      let translateY = elementStart.y + mouseOffset.top
      
      // 超出控制，还需要根据方向再做调整
      if(translateX>maxOffset.left) translateX = maxOffset.left
      if(translateY<-maxOffset.top) translateY = -maxOffset.top
      if(translateX<-inner.offsetWidth/2) translateX = -inner.offsetWidth/2
      if(translateY>inner.offsetHeight/2) translateY = inner.offsetHeight/2

      if(!x) translateX = -inner.offsetWidth/2
      if(!y) translateY = 0
      
      accessTransform(inner,'translateX',translateX)
      accessTransform(inner,'translateY',translateY)
      
      if(typeof callback === 'function'){
        callback(translateX,translateY)
      }
    }

    document.onmouseup = function(){
      // 解除document的绑定，防止误触
      document.onmousemove = document.onmouseup =null;
    }
    // 阻止默认行为，防止移动的时候框选文本
    return false
  }
}