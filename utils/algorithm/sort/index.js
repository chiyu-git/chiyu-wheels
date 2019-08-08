var swap = function(array, index1, index2){ 
  /*     var aux = array[index1]; 
    array[index1] = array[index2]; 
    array[index2] = aux;  */
    [array[index1], array[index2]] = [array[index2], array[index1]]; 
} 
Array.prototype.bubbleSort = function(){
  const array = this 
  const len = array.length; 
  let flag = false
  for (let i=0; i<len; i++){ 
    flag = true // 初始化标识
    for (let j=0; j<len-1-i; j++ ){ //{1} 
      if (array[j] > array[j+1]){ 
        swap(array,j, j+1); 
        flag = false // 发生了交换，更改标识
      } 
    } 
    // 本轮没有进行过交换，说明数组已经有序
    if(flag) return
  } 
}
Array.prototype.selectionSort = function(){ 
  const array = this
  const len = array.length          
  let minIndex 
  for (let i=0; i<len-1; i++){       
    minIndex = i
    // 前面的已经有序，内循环从i开始                      
    for (let j=i; j<len; j++){ 
      // 找到 第i小的值 的索引   
      if(array[minIndex]>array[j]) minIndex = j
    }
    // 如果该最小值和原最小值不同，交换，成为第n小的值 
    if (i !== minIndex) swap(array,i, minIndex)
  }
} 
Array.prototype.insertionSort = function(){ 
  const array = this
  const len = array.length            
  for (let i=1; i<len; i++){         
    let j = i;
    // 待插入的值                           
    let temp = array[i];                  
    // 和已排序的比较，寻找插入的位置 
    while (j>0 && array[j-1] > temp){
      // 较大的值，往后挪位 
      array[j] = array[j-1]       
      j-- 
    }
    // 插入
    array[j] = temp                  
  } 
}
Array.prototype.mergeSort = function(){
  let array = this 
  const result = mergeSortRec(array)
  array.splice(0,array.length)
  array.push(...result)
  // mergeSortRect函数将一个大数组转化为多个小数组直到只有一个项
  function mergeSortRec (array){ 
    const len = array.length
    // 递归的停止条件 
    if(len === 1) return array  // {1}
    // 长度大于1，分割为小数组
    const mid = len>>>1,     
          left = array.slice(0, mid),      
          right = array.slice(mid, len)
    return merge(mergeSortRec(left), mergeSortRec(right)) // {2}
  }
  // merge函数接受两个数组作为参数，并将它们归并至一个大数组
  function merge(left,right){
    const result = []  // {7}
    let il = 0,  
        ir = 0 
    while(il < left.length && ir < right.length) { // {8} 
      if(left[il] < right[ir]) { 
        result.push(left[il++]);  // {9} 
      } else{ 
        result.push(right[ir++]); // {10} 
      } 
    } 
    // 将剩余项push进入result中
    while (il < left.length){     // {11} 
      result.push(left[il++]) 
    } 
    while (ir < right.length){    // {12} 
      result.push(right[ir++]) 
    } 
  
    return result; // {13} 
  }
}
Array.prototype.quickSort = function(){
  const array = this 
  quick(array,  0, array.length - 1)

  function quick(array, left, right){ 
    let index //{1} 
    if (array.length > 1) { //{2}
      // 划分函数将数组分为两部分，左侧的数组比主元小，右侧的数组比主元大 
      index = partition(array, left, right) //{3} 
      if (left < index - 1) quick(array, left, index - 1)    //{5} 
      if (index < right) quick(array, index, right)        //{7} 
    } 
  } 
  function partition(array,left,right){
    // 选择中间项作为主元
    const pivot = array[(right+left)>>>1] //{8} 
    let i = left,                                      //{9} 
        j = right                                     //{10} 
 
    while (i <= j) {                 //{11} 
      while (array[i] < pivot) i++   //{12}
      while (array[j] > pivot) j--   //{13}
      if (i <= j) { //{14} 
        swap(array, i, j) //{15} 
        i++ 
        j-- 
      } 
    } 
    return i //{16} 
  } 
}
// 堆排序
Array.prototype.maxHeapSort = function(){
  const array = this
  let heapSize = array.length
  buildHeap(array) //{1} 
 
  while (heapSize > 1) { 
    // 减小堆的长度，相当于是把最大的元素排除了，即是：已排序
    heapSize--
    // 此时堆顶的堆中最大值，交换堆顶和堆尾的元素
    swap(array, 0, heapSize); //{2} 
    // 重新构建最大堆
    heapify(array, heapSize, 0); //{3} 
  }
  function buildHeap(array){ 
    const heapSize = array.length; 
    for (let i = (heapSize>>>1)-1; i >= 0; i--) { 
      heapify(array, heapSize, i); 
    } 
  }
  // array是为了尾递归优化，真正的参数只有heapSize和i，这个函数就是要检查i的两个子节点是否都比小，否则就令他们之中最大的与i交换
  function heapify(array, heapSize, i){ 
    let left = i * 2 + 1, 
        right = i * 2 + 2, 
        largest = i 
   
    if (left < heapSize && array[left] > array[largest]) { 
      largest = left 
    } 
   
    if (right < heapSize && array[right] > array[largest]) { 
      largest = right 
    } 
   
    if (largest !== i) { 
      swap(array, i, largest); 
      heapify(array, heapSize, largest); // 保证交换之后仍符合最大堆
    } 
  }
}  
Array.prototype.bucketSort=function(bucketSize=5){
  const array = this
  const len = array.length
  if(len===0) return array
  // 初始化桶
  const min = Math.min(...array)
  const max = Math.max(...array)
  const bucketCount = Math.floor((max-min)/bucketSize) // zero base
  const buckets = new Array(bucketCount+1)
  for (let i = 0; i < buckets.length; i++) {
    buckets[i] = []
  }
  // 利用映射函数将元素分配到各个桶中
  for (let i = 0; i < len; i++) {
    const bucket = Math.floor((array[i] - min)/bucketSize)
    buckets[bucket].push(array[i])
  }
  // 清空原数组
  array.splice(0,len)
  // 对每个桶进行排序
  buckets.forEach((bucket) => {
    bucket.insertionSort()
    array.push(...bucket)
  })
}

// 构建最小堆
function minHeap(array){
  buildHeap(array) 

  function buildHeap(array){ 
    const heapSize = array.length; 
    for (let i = (heapSize>>>1)-1; i >= 0; i--) { 
      minHeapify(array, heapSize, i); 
    } 
  }
  this.heapPop = function(){
    const array = this
    const heapSize = array.length
    // 弹出堆顶的元素
    swap(array,0,heapSize-1)
    // 重新构建最小堆
    minHeapify(array, heapSize-1, 0) 
    // 弹出数组最后一个元素，即原堆顶
    array.pop()
  }
  return array
} 
function minHeapify(array, heapSize, i){ 
  let left = i * 2 + 1, 
      right = i * 2 + 2, 
      smallest = i 
 
  if (left < heapSize && array[left] < array[smallest]) { 
    smallest = left 
  } 
 
  if (right < heapSize && array[right] < array[smallest]) { 
    smallest = right 
  } 
 
  if (smallest !== i) { 
    swap(array, i, smallest); 
    minHeapify(array, heapSize, smallest); // 保证交换之后仍符合最大堆
  } 
}