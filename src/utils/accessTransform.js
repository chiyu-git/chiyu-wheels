/**
 * @param {DOM} node
 * @param {string} prop
 * @param {number} val
 * @return {string}
 */

export function accessTransform(node,prop,val){
  // 如果还没有transform对象，创建一个
  if(typeof node ==="object" && typeof node.transform ==="undefined" ){
    node.transform = {};
  }
  let text=''
  // val是否有值？有则是写操作，没有则是读操作
  // 不要使用隐式转换，万一val的值是0，就无法进入判断，无法修改了
  if(val!==undefined){
    // 写操作，修改prop
    node.transform[prop] = val
    // 遍历输出 transform text
    for (let [key, val] of Object.entries(node.transform)) {
      switch(key){
        case 'translateX':
        case 'translateY':
          text += `${key}(${val}px)`
          break
        case 'rotate':
          text += `${key}(${val}deg)`
          break
        case 'scale':
          text += `${key}(${val})`
          break
      }
    }
    // 赋值
    node.style.transform = node.style.webkitTransform = text
  }else{
    // 读操作
    val = node.transform[prop]
    // 判断 val 是否有值，如果没有值，返回属性的默认值
    if(!val){
      switch(prop){
        case 'translateX':
        case 'translateY':
        case 'rotate':
          val=0
          break
        case 'scale':
          val=1
          break
      }
    }
    return val
  }
}