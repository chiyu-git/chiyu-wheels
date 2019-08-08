export default function LinkedList() { 

  let Node = function(val){ // {1} 
    this.val = val
    this.next = null
  }

  let length = 0 // {2} 利用闭包模拟私有变量
  let head = null // {3} 利用闭包模拟私有变量

  this.append = function(val){
    let node = new Node(val)
    let current
    if(head === null){
      // 链表中的第一个节点
      // 让head指向该节点
      head = node
    }else{
      // 向链表的末尾添加节点
      // 循环链表找到最后的节点
      current = head
      while(current.next){
        current = current.next
        // 最后的节点 next 为 null，跳出循环
      }
      // 跳出了while循环
      // 最后一项，将其 next 赋为 node，建立链接 
      current.next = node
    }
    length++ // 更新链表长度
  }
  this.insert = function(position, val){ 
    //检查越界值 
    if (position >= 0 && position <= length){ //{1} 
  
      let node = new Node(val), 
          current = head, 
          previous, 
          index = 0; 
  
      if (position === 0){ // 在第一个位置添加 
  
        node.next = current //{2} 
        head = node; 
  
      } else { 
        while (index++ < position){ //{3} 
          previous = current 
          current = current.next 
        } 
        node.next = current //{4} 
        previous.next = node //{5} 
      } 
  
      this.length++ // 更新列表的长度 
  
      return true 
  
    } else { 
      return false //{6} 
    } 
  } 
  this.removeAt = function(position){ 
    // 检查越界值 
    if (position > -1 && position < length){ // {1} 
      let current = head, // {2} 
          previous, // {3} 
          index = 0 // {4} 
      // 移除第一项 
      if (position === 0){ // {5} 
        head = current.next 
      } else { 
        // index++ < position
        while (index < position){ // {6} 
          previous = current     // {7} 
          current = current.next // {8} 
          index++
        } 
        // 跳出了循环，此时index==position
        // 将previous与current的下一项链接起来
        // 跳过current，等着被垃圾回收器清除，从而移除它 
        previous.next = current.next // {9} 
      } 
      length-- // {10} 
      return current.element 
    } else { 
      // 不是有效的位置，返回null
      return null // {11} 
    } 
  }
  this.remove = function(val){ 
    let index = this.indexOf(val) 
    // 即使返回-1，也会被remove的边界限制
    return this.removeAt(index) 
  } 
  this.indexOf = function(val){ 
 
    let current = head //{1} 
    let index = -1
   
    while (current) { //{2} 
      if (val === current.val) { 
        return index       //{3} 
      } 
      index++                //{4} 
      current = current.next //{5} 
    } 
   
    return -1 
  } 
  
  this.isEmpty = function() { 
    return length === 0 
  } 
  this.size = function() { 
    return length 
  } 
  this.getHead = function(){ 
    return head 
  } 
  this.toString = function(){ 
 
    let current = head, //{1} 
    string = '';    //{2} 
   
    while (current) {   //{3} 
      string +=current.data +(current.next ? '->' : '');//{4} 
      current = current.next;          //{5} 
    } 
    return string;              //{6} 
  } 
} 