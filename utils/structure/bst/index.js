export default function BinarySearchTree() {
  const Node = function (key) { //{1} 
    this.val = this.key = key
    this.left = null
    this.right = null
    this.next = null
  }

  let root = null; //{2}
  let size = 0
  this.root = function(){
    return root
  }
  // insert() 方法
  this.insert = function (key) {
    const newNode = new Node(key); //{1} 
    if (root === null) { //{2} 
      root = newNode
    } else {
      root = insertNode(root, newNode) //{3} 
    }
    size++
    // 返回插入的节点
    return newNode
  }
  function insertNode(node, newNode) {
    if (node === null) {
      node = newNode
      return node
    }
    if (newNode.key < node.key) { //{4} 
      node.left = insertNode(node.left, newNode) //{7} 
      // 确认是否需要平衡 {1} 
      if ((heightNode(node.left) - heightNode(node.right)) > 1) {
        // 传入需要平衡的节点 
        if (newNode.key < node.left.key) node = rotationLL(node)
        else node = rotationLR(node)
      }
    } else {
      node.right = insertNode(node.right, newNode); //{10} 
      // 确认是否需要平衡 {2} 
      if ((heightNode(node.right) - heightNode(node.left)) > 1) {
        // 传入需要平衡的节点 
        if (newNode.key > node.right.key) node = rotationRR(node);
        else node = rotationRL(node);
      }
    }
    return node
  }
  function heightNode(node) {
    if (node === null) {
      return -1;
    } else {
      return Math.max(heightNode(node.left), heightNode(node.right)) + 1;
    }
  }
  function rotationRR(node) {
    const temp = node.right; // {1} temp = X , 保存X
    node.right = temp.left;  // {2} Y.right = Z , 断开X与Y，同时修正Z的位置
    temp.left = node;        // {3} X.left = Y , 修正Y的位置
    return temp;
  }
  function rotationLL(node) {
    var tmp = node.left;   // {1} temp = X , 保存X
    node.left = tmp.right; // {2} Y.left = Z , 断开X与Y，同时修正Z的位置
    tmp.right = node;      // {3} X.right = Y , 修正Y的位置
    return tmp;
  }
  function rotationLR(node) {
    node.left = rotationRR(node.left);
    return rotationLL(node);
  }
  function rotationRL(node) {
    node.right = rotationLL(node.right);
    return rotationRR(node);
  }
  //size
  this.size = function () {
    return size
  }
  // remove
  this.remove = function (key) {
    root = removeNode(root, key)
    size--
  }
  function removeNode(node, key) {
    if (node === null) return null
    
    if (key < node.key) { //{3} 
      node.left = removeNode(node.left, key); //{4} 
      return node; //{5} 

    } else if (key > node.key) { //{6} 
      node.right = removeNode(node.right, key); //{7} 
      return node; //{8} 

    } else { //键等于node.key 

      //第一种情况——一个叶节点 
      if (node.left === null && node.right === null) { //{9} 
        node = null; //{10} 
        return node; //{11} 
      }

      //第二种情况——一个只有一个子节点的节点 
      if (node.left === null) { //{12} 
        node = node.right; //{13} 
        return node; //{14} 

      } else if (node.right === null) { //{15} 
        node = node.left; //{16} 
        return node; //{17} 
      }

      //第三种情况——一个有两个子节点的节点 
      var aux = findMinNode(node.right); //{18} 
      node.key = aux.key; //{19} 
      node.right = removeNode(node.right, aux.key); //{20} 
      return node; //{21} 
    }
  }
  function findMinNode (node){ 
    while (node && node.left !== null) { 
      node = node.left; 
    } 
    return node; 
  }
  // 中序遍历
  this.inOrderTraverse = function (callback) {
    inOrderTraverseNode(root, callback); //{1} 
  }
  function inOrderTraverseNode(node, callback) {
    if (node !== null) { //{2} 
      inOrderTraverseNode(node.left, callback);  //{3} 
      callback(node.key);                        //{4} 
      inOrderTraverseNode(node.right, callback); //{5} 
    }
  }
  // 先序遍历
  this.preOrderTraverse = function (callback) {
    preOrderTraverseNode(root, callback)
  }
  function preOrderTraverseNode(node, callback) {
    if (node !== null) {
      callback(node.key)
      preOrderTraverseNode(node.left, callback)
      preOrderTraverseNode(node.right, callback)
    }
  }
  // 后序遍历
  this.postOrderTraverse = function (callback) {
    postOrderTraverseNode(root, callback)
  }
  function postOrderTraverseNode(node, callback) {
    if (node !== null) {
      postOrderTraverseNode(node.left, callback)
      postOrderTraverseNode(node.right, callback)
      callback(node.key)
    }
  }
  // 层次遍历、广度优先搜索
  this.levelOrder = function () {
    return bfs(root)
  }
  function bfs(node) {
    if (node === null) return
    const queue = []
    const level = []
    queue.push(node)
    while (queue.length !== 0) {
      const cur = queue.shift()
      level.push(cur.key)
      if (cur.left!==null) queue.push(cur.left)
      if (cur.right!==null) queue.push(cur.right)
    }
    return level;
  }
  // this.depth = maxDepth(root)
  this.depth = function(){
    return maxDepth(root)
  }
  function maxDepth(node){
    if(node===null) return 0
    leftDepth = maxDepth(node.left)
    rightDepth = maxDepth(node.right)
    return Math.max(leftDepth,rightDepth) + 1
  }
  // 本质：标记深度的 前中后序遍历
  this.print = function () {
    const level = []
    traverse(root, 0, level)
    return level
  }
  function traverse(node, depth, level) {
    // 新的一层，新建该层的数组
    if (depth > level.length-1) level.push([])

    if (node === null) {
      level[depth].push(node)
    } else {
      level[depth].push(node.key)
      traverse(node.left, depth + 1, level)
      traverse(node.right, depth + 1, level)
    }
  }
  // 最小值
  this.min = function () {
    return minNode(root) //{1} 
  }
  function minNode(node) {
    if (node !== null) {
      while (node !== null && node.left !== null) { //{2} 
        node = node.left;                //{3} 
      }
      // 跳出while循环，到底最底层、最左处的节点
      return node.key;
    }
    return null  //{4} 
  }
  // 最大值
  this.max = function () {
    return maxNode(root)
  }
  function maxNode(node) {
    if (node !== null) {
      while (node !== null && node.right !== null) {
        node = node.right
      }
      return node.key
    }
    return null
  }
  // search
  this.search = function (key) {
    return searchNode(root, key)
  }
  function searchNode(node, key) {
    if (node === null) return false

    if (key === node.key) return node
    if (key < node.key) return searchNode(node.left, key)
    if (key > node.key) return searchNode(node.right, key)
  }
  // floor
  this.floor = function (key) {
    return floorNode(root, key)
  }
  function floorNode(node, key) {
    if (node === null) return null
    if (key < node.key) {
      // floor值肯定在左子树
      return floorNode(node.left, key)
    } else if (key === node.key) {
      return node.key
    } else {
      // key>node.key
      // 有两种可能：floor值是当前结点或在右子树
      const floor = floorNode(node.right, key)
      if (floor === null) return node.key
      else return floor
    }
  }
  // ceiling
  this.ceiling = function (key) {
    return ceilingNode(root, key)
  }
  function ceilingNode(node, key) {
    if (node === null) return null
    if (key > node.key) {
      // ceiling值肯定在右子树
      return ceilingNode(node.right, key)
    } else if (key === node.key) {
      return node.key
    } else {
      // key<node.key
      // 有两种可能：ceiling值是当前节点或者是左子树
      const ceiling = ceilingNode(node.left, key)
      if (ceiling === null) return node.key
      else return ceiling
    }
  }

}

function isEqual(m,n){
  if(m === null && m === null) return true

  if(m.key === n.key){
    return isEqual(m.left,n.left) && isEqual(m.right,n.right)
  }
  return false
}

BinarySearchTree.isEqual = isEqual