import Stack from '../stack'
import Queue from '../queue'

export default function Graph(){
  const vertices = []; //{1} 
  const adjList = new Map(); //{2}
  this.addVertex = function(v){ 
    vertices.push(v) //{3} 
    adjList.set(v, []) //{4} 
  }
  // addEdge
  this.addEdge = function(v, w){
    // 添加从v到w的边 
    adjList.get(v).push(w) //{5} 
    // // 添加从w到v的边 
    // adjList.get(w).push(v) //{6} 
  }
  // 打印邻接表
  this.printNeighbors = function(){ 
    let s = ''
    for (let i=0; i<vertices.length; i++){ //{10} 
      s += vertices[i] + ' -> ' 
      // 遍历该顶点的邻接表
      const neighbors = adjList.get(vertices[i]) //{11} 
      for (let j=0; j<neighbors.length; j++){ //{12} 
        s += neighbors[j] + ' ' 
      } 
      s += '\n' //{13} 
    } 
    return s  
  }
  // 广度优先搜索
  this.bfs = function(v, callback){ 
    const color = initializeColor(),  //{2} 
          queue = new Queue()         //{3}
          // 入队作为遍历的起点 
          queue.enqueue(v)            //{4} 
    // 如果队列非空
    while (!queue.isEmpty()){       //{5}
      // 从队列弹出一个顶点
      let v = queue.dequeue()
      // 获取该顶点的邻接表
      neighbors = adjList.get(v)
      color[v] = 'grey'                      // {8} 
      // 将所有未被探索的邻居加入队列
      for (let i=0; i<neighbors.length; i++){ 
        let u = neighbors[i]
        if (color[u] === 'white'){
          color[u] = 'grey'
          queue.enqueue(u)
        } 
      } 
      color[v] = 'black' // {14} 
      if (callback) {     
        callback(v) 
      } 
    } 
  }
  // 初始化颜色
  function initializeColor(){ 
    const color = [] 
    for (let i=0; i<vertices.length; i++){ 
      color[vertices[i]] = 'white' //{1} 
    } 
    return color 
  }
  // 广度优先搜索路径
  this.bfs2Graph = function(v){  
    const color = initializeColor(), 
        queue = new Queue(), 
        d = {},    //{1} 
        pred = {}; //{2} 
    queue.enqueue(v); 
    for (let i=0; i<vertices.length; i++){
      // 初始化每个顶点到源点的距离为0
      const test = vertices[i]
      d[vertices[i]] = 0
      // 前溯点为null
      pred[vertices[i]] = null
    }
    while (!queue.isEmpty()){ 
      const v = queue.dequeue(), 
            neighbors = adjList.get(v) 
      color[v] = 'grey' 
      for (i=0; i<neighbors.length; i++){ 
        var w = neighbors[i] 
        if (color[w] === 'white'){ 
          color[w] = 'grey' 
          // 前溯点的距离+1
          pred[w] = v               //{6} 
          d[w] = d[v] + 1           //{7} 
          queue.enqueue(w) 
        } 
      } 
      color[v] = 'black' 
    }
    // 利用前溯点对象打印路径
    const start = v,
          path = new Stack()
    // 刨去起点
    const ends = [...vertices]
    ends.splice(ends.indexOf(start),1)
    for (let i = 0; i < ends.length; i++) {
      let end = ends[i]
      while(end!==start){
        path.push(end)
        // 变更为前溯点，回溯到start为止
        end = pred[end]
      }
      // 循环结束，栈中保存了该条路径，除了源顶点(A)外的顶点
      let s = start
      while(!path.isEmpty()){
        // 逐个出栈拼接路径
        s += ' - ' + path.pop()
      }
      console.log(s)
    }
    return { //{8} 
      distances: d, 
      predecessors: pred 
    }
  }
  // 深度优先搜索
  this.dfs = function(callback){ 
    const color = initializeColor() //{1} 
  
    for (let i=0; i<vertices.length; i++){ //{2} 
      if (color[vertices[i]] === 'white'){ //{3} 
        dfsVisit(vertices[i], color, callback); //{4} 
      } 
    }
    // 递归函数
    function dfsVisit (v, color, callback){ 
      color[v] = 'grey' //{5} 
      if (callback) callback(v) 
  
      const neighbors = adjList.get(v)         //{7} 
      for (let i=0; i<neighbors.length; i++){ //{8} 
        const u = neighbors[i]               //{9} 
        if (color[u] === 'white'){          //{10} 
          dfsVisit(u, color, callback)   //{11} 
        } 
      } 
      color[v] = 'black' //{12} 
    } 
  } 
  // 深度优先 探索时间
  let time = 0; //{1} 
  this.dfs2Time = function(){ 
    const color = initializeColor(), //{2} 
          d = {}, 
          f = {} 
  
    for (let i=0; i<vertices.length; i++){ //{3} 
      f[vertices[i]] = 0; 
      d[vertices[i]] = 0; 
    } 
    for (let i=0; i<vertices.length; i++){ 
      if (color[vertices[i]] === 'white'){ 
        DFSVisit(vertices[i], color, d, f) 
      } 
    } 
    return {           //{4} 
      discovery: d, 
      finished: f, 
    }
    // 递归函数
    function DFSVisit (v, color, d, f){ 
      console.log('discovered ' + v) 
      color[v] = 'grey'; 
      d[v] = ++time //{5} 
      const neighbors = adjList.get(v) 
      for (let i=0; i<neighbors.length; i++){ 
        const u = neighbors[i]; 
        if (color[u] === 'white'){ 
          DFSVisit(u,color, d, f) 
        } 
      } 
      color[v] = 'black' 
      f[v] = ++time;      //{7}  
      console.log('explored ' + v) 
    } 
  } 
  // 深度优先 拓扑排序
  let hasCycle = false
  this.topSort = function(){
    const color = initializeColor()
    const stack = new Stack()
    for (let i=0; i<vertices.length; i++){ 
      if (color[vertices[i]] === 'white'){ 
        dfsVisit(vertices[i], color, stack)
      } 
    }
    return !hasCycle && stack
    function dfsVisit (v, color, stack){ 
      // 成环，没必要继续递归了
      if(hasCycle) return
      color[v] = 'grey'

      const neighbors = adjList.get(v)         
      for (let i=0; i<neighbors.length; i++){
        const u = neighbors[i]              
        if (color[u] === 'white'){         
          dfsVisit(u, color, stack)
        }else if(color[u] === 'grey'){
          // An edge to a GRAY vertex represents a cycle
          hasCycle = true
        } 
      } 
      color[v] = 'black'
      // 完全就是深度优先遍历的代码，完成探索之后推入栈中
      stack.push(v)
    }  
  } 
}