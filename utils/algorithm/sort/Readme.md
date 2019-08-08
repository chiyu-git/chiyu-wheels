# 排序算法

- ```js
  function ArrayList(){ 
   
    var array = []; //{1} 
   
    this.insert = function(item){ //{2} 
      array.push(item); 
    }; 
   
    this.toString= function(){ //{3} 
      return array.join(); 
    }; 
  } 
  ```

- 注意ArrayList类并没有任何方法来移除数据或插入数据到特定位置。我们刻意保持简单是为了能够专注于排序和搜索算法。所有的排序和搜索算法会添加至这个类中。 

## 冒泡排序

### 基本实现

- 比较**相邻**的元素。如果第一个比第二个大，就交换他们两个。元素项向上移动至正确的顺序，就好像气泡升至表面一样，冒泡排序因此得名。 

  ```js
  this.bubbleSort = function(){ 
    var length = array.length;           //{1} 
    for (var i=0; i<length; i++){        //{2} 
      for (var j=0; j<length-1; j++ ){ //{3} 
        if (array[j] > array[j+1]){  //{4} 
          swap(array, j, j+1);      //{5} 
        } 
      } 
    } 
  };
  ```

- 外循环（行{2}）会从数组的第一位迭代至最后一位，它控制了在数组中经过多少轮排序（应该是数组中每项都经过一轮，轮数和数组长度一致）。

- 然后，内循环将从第一位迭代至倒数第二位，内循环实际上进行当前项和下一项的比较（行{4}）。如果这两项顺序不对（当前项比下一项大），则交换它们（行{5}），意思是位置为j+1的值将会被换置到位置j处

- 现在我们得声明swap函数（一个私有函数，只能用在ArrayList类的内部代码中）： 

  ```js
  var swap = function(array, index1, index2){ 
    var aux = array[index1]; 
    array[index1] = array[index2]; 
    array[index2] = aux; 
  }; 
  ```

- 我们使用下列代码来测试

  ```js
  function createNonSortedArray(size){ //{6} 
    var array = new ArrayList(); 
    for (var i = size; i> 0; i--){ 
      array.insert(i); 
    } 
    return array; 
  } 
  
  var array = createNonSortedArray(5); //{7} 
  console.log(array.toString());       //{8} 
  array.bubbleSort();                  //{9} 
  console.log(array.toString());       //{10} 
  ```



- 该示意图中每一小段表示外循环的一轮（行{2}），而相邻两项的比较则是在内循环中进行的（行{3}）。 

- **注意：**当算法执行外循环的第二轮的时候，数字4和5已经是正确排序的了。尽管如此，在后续比较中，它们还一直在进行着比较，即使这是不必要的。因此，我们可以稍稍改进一下冒泡排序算法。

### 优化实现

- 如果从内循环减去外循环中已跑过的轮数，就可以避免内循环中所有不必要的比较（行{1}）。 

  > 第一轮执行后，最大的数一定到达正确的位置，且不再改变
  >
  > 第二轮执行后，第二大的数一定到达正确的位置，且不再改变

  ```js
  this.modifiedBubbleSort = function(){ 
    var length = array.length; 
    for (var i=0; i<length; i++){ 
      for (var j=0; j<length-1-i; j++ ){ //{1} 
        if (array[j] > array[j+1]){ 
          swap(j, j+1); 
        } 
      } 
    } 
  }; 
  ```



  > 注意已经在正确位置上的数字没有被比较。即便我们做了这个小改变，改进了一下冒泡排序算法，但我们还是不推荐该算法，它的复杂度是O(n^2)。 

- 进一步优化，如果在一轮内循环中，没有发生过交换，说明数组已经是有序的，就可以直接退出了

  ```js
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
  ```

### 复杂度分析

- 最好情形：正序，仅需 n - 1 次比较
- 最坏情形：反序，需要平方级的比较和平方级的交换
- https://blog.csdn.net/hansionz/article/details/80822494

## 选择排序

- 选择排序算法是一种**原址比较排序**算法。选择排序大致的思路是找到数据结构中的最小值并将其放置在第一位，接着找到第二小的值并将其放在第二位，以此类推。 
- 基本思路：不断从剩余数组中选出最小的数，然后移到前面

### 基本实现

- ```js
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
  ```



- 数组底部的箭头指示出当前迭代轮寻找最小值的**数组范围**（内循环{4}），示意图中的每一步则表示外循环。 

### 复杂度分析

- O(n^2)。需要约 N^2 / 2 次比较，与最多 N - 1 次交换
- 运行时间与输入无关，给定 N 的情况下，无论何种输入所需时间均相等
- 数据交换量最小

## 插入排序

- 插入排序**每次排一个数组项**，以此方式构建最后的排序数组。

- 假定第一项已经排序了，接着，它和第二项进行比较，第二项是应该待在原位还是插到第一项之前呢？这样，头两项就已正确排序，接着和第三项比较（它是该插入到第一、第二还是第三的位置呢？），以此类推。 

  ```js
  Array.prototype.insertionSort = function(){ 
    const array = this
    const len = array.length
    // 从1而不是0开始的,我们认为第一项已排序了
    for (let i=1; i<len; i++){         
      let j = i                       
      let temp = array[i] // 待插入的值                 
      // 和已排序的比较，寻找插入的位置 
      while (j>0 && array[j-1] > temp){
        // 较大的值，往后挪位 
        array[j] = array[j-1]       
        j-- 
      }
      // 插入到正确的位置
      array[j] = temp                  
    } 
  }
  ```

- 只要变量j比0大并且数组中前面的值比**待比较**的值大（行{5}），我们就把这个值移到当前位置上（行{6}）并减小j。最终，该项目能插入到正确的位置上 



  ![æå¥æåº](https://github.com/mqyqingfeng/Blog/raw/master/Images/sort/insertion.gif)

- 举个例子，假定待排序数组是[3, 5, 1, 4, 2]。这些值将被插入排序算法按照下面形容的步骤进行排序。 

- (1) 3已被排序，所以我们从数组第二个值5开始。3比5小，所以5待在原位（数组的第二位）。3和5排序完毕。 

- (2) 下一个待排序和插到正确位置上去的值是1（目前在数组的第三位）。5比1大，所以5被移至第三位去了。我们得分析1是否应该被插入到第二位——1比3大吗？不，所以3被移到第二位去了。接着，我们得证明1应该插入到数组的第一位上。因为0是第一个位置且没有负数位，所以1必须被插入到第一位。1、3、5三个数字已经排序。 

- (3)  4应该在当前位置（索引3）还是要移动到索引较低的位置上呢？4比5小，所以5移动到索引3位置上去。那么应该把4插到索引2的位置上去吗？4要比3大，所以4插入到数组的位置3上。 

- (4)  下一个待插入的数字是2（数组的位置4）。5比2大，所以5移动至索引4。4比2大，所以4也得移动（位置3）。3也比2大，所以3还得移动。1比2小，所以2插入到数组的第二位置上。至此，数组已排序完成。 

  > 此表中的问好，非常的关键，实际上表明了并没有真正的发生交换，而是仍在寻找合适的插入位置
  >
  > 3 ？5 4 2 → 3 5 5 4 2
  >
  > 从代码可知，之所以这么做，是因为temp的位置还未确定，此时交换就结果而言是多余的
  >
  > 这是 **插入排序** 插入二字的精髓，就好像打麻将一直用手拿着寻找合适的位置再插入

### 复杂度分析

- 排序小型数组时，此算法比选择排序和冒泡排序性能要好 

## 归并排序 

- 归并排序是第一个可以被实际使用的排序算法。你在本书中学到的前三个排序算法性能不好，但归并排序性能不错，其复杂度为O(nlog^n)。 

  > JavaScript的Array类定义了一个sort函数（Array.prototype.sort）用以排序JavaScript数组（我们不必自己实现这个算法）。ECMAScript没有定义用哪个排序算法，所以浏览器厂商可以自行去实现算法。例如，Mozilla  Firefox使用归并排序作为Array.prototype.sort的实现，而Chrome使用了一个快速排序（下面我们会学习的）的变体。 

- 归并排序是一种**分治算法**。其思想是将原始数组切分成较小的数组，直到每个小数组只有一个位置，接着将小数组归并成较大的数组，直到最后只有一个排序完毕的大数组。 

- 由于是分治法，归并排序也是递归的： 

  ```js
  Array.prototype.mergeSort = function(){
    const array = this 
    const result = mergeSortRec(array)
    array.splice(0,array.length)
    array.push(...result)
  } 
  ```

- 像之前的章节一样，每当要实现一个递归函数，我们都会实现一个实际被执行的辅助函数。对归并排序我们也会这么做。我们将声明mergeSort方法以供随后使用，而mergeSort方法将会调用mergeSortRec，该函数是一个递归函数：

  ```js
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
  ```

- 归并排序将一个大数组转化为多个小数组直到只有一个项。由于算法是递归的，我们需要一个停止条件，在这里此条件是判断数组的长度是否为1（行{1}）。如果是，则直接返回这个长度为1的**数组**，因为它已排序了。 

- 下面的步骤是调用merge函数（行{2}），它负责**合并和排序小数组来产生大数组**，直到回到原始数组并已排序完成。为了不断将原始数组分成小数组，我们得再次对left数组和right数组递归调用mergeSortRec，并同时作为参数传递给merge函数。 

  ```js
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
  ```

- 排序发生在归并过程中。首先，需要声明归并过程要创建的新数组以及用来迭代两个数组（left和right数组）所需的两个变量（行{7}）。

- 迭代两个数组的过程中（行{8}），我们比较来自left数组的项是否比来自right数组的项小。

  - 如果是，将该项从left数组添加至归并结果数组，并递增迭代数组的控制变量（行{9}）；
  - 否则，从right数组添加项并递增相应的迭代数组的控制变量（行{10}）。 

- 接下来，将left数组或者right数组所有剩余的项添加到归并数组中（行{11}和行{12}）。最后，将归并数组作为结果返回（行{13}）。 

  > 如果left和right的长度不一致，或者left全部都比right小，只会有一个数组仍有剩余，所以把剩余的推入即可
  >
  > 第一个while循环结束后，仍有剩余的数组的最小项都会比合并数组的最大项大



- 可以看到，算法首先将原始数组分割直至只有一个元素的子数组，然后开始归并。归并过程也会完成排序，直至原始数组完全合并并完成排序。 

## 快速排序

- 快速排序也许是最常用的排序算法了。它的复杂度为O(nlog^n^)，且它的性能通常比其他的复杂度为O(nlog^n^)的排序算法要好。和归并排序一样，快速排序也使用**分治的方法**，将原始数组分为较小的数组（但它没有像归并排序那样将它们分割开）。 

- 以下是递归算法的原理：

  1. 首先，从数组中选择中间一项作为**主元**。 
  2. 创建两个指针，左边一个指向数组第一个项，右边一个指向数组最后一个项。移动左指针直到我们找到一个比主元大的元素，接着，移动右指针直到找到一个比主元小的元素，然后交换它们，重复这个过程，直到**左指针超过了右指针**。这个过程将使得比主元小的值都排在主元之前，而比主元大的值都排在主元之后。这一步叫作**划分操作**。 
  3. 接着，算法对划分后的小数组（较主元小的值组成的子数组，以及较主元大的值组成的子数组）重复之前的两个步骤，直至数组已完全排序。 

- 让我们开始快速排序的实现吧： 

  ```js
  Array.prototype.quickSort = function(){
    const array = this 
    quick(array,  0, array.length - 1)
  } 
  ```

- 就像归并算法那样，开始我们声明一个主方法来调用递归函数，传递待排序数组，以及索引0及其最末的位置作为参数。 

  ```js
  function quick(array, left, right){ 
    let index //{1} 
    if (array.length > 1) { //{2}
      // 划分函数将数组分为两部分，左侧的数组比主元小，右侧的数组比主元大 
      index = partition(array, left, right) //{3} 
      if (left < index - 1) quick(array, left, index - 1)    //{5} 
      if (index < right) quick(array, index, right)        //{7} 
    } 
  } 
  ```

- 首先声明index（行{1}），该变量能帮助我们将子数组分离为较小值数组和较大值数组，这样，我们就能再次递归的调用quick函数了。partition函数返回值将赋值给index（行{3}）。 

  > 得到的index，即是主元的索引

- 如果数组的长度比1大（因为只有一个元素的数组必然是已排序了的（行{2}），我们将对给定子数组执行partition操作（第一次调用是针对整个数组）以得到index（行{3}）。

- 如果子数组存在较小值的元素（行{4}），则对该数组重复这个过程（行{5}）。同理，对存在较大值得子数组也是如此，如果存在子数组存在较大值，我们也将重复快速排序过程（行{7}）。 

### 划分过程 

- 第一件要做的事情是选择主元（pivot），有好几种方式。最简单的一种是选择数组的第一项（最左项）。然而，研究表明对于几乎已排序的数组，这不是一个好的选择，它将导致该算法的最差表现。另外一种方式是随机选择一个数组项或是选择中间项。 

- 现在，让我们看看划分过程： 

  ```js
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
  ```

- 在本实现中，我们选择中间项作为主元（行{8}）。我们初始化两个指针：left（低——行{9}），初始化为数组第一个元素；right（高——行{10}），初始化为数组最后一个元素。

- 只要left和right指针没有相互交错（行{11}），就执行划分操作。

  - 首先，移动**left指针**直到找到一个元素比主元**大**（行{12}）。
  - 对**right指针**，我们做同样的事情，移动right指针直到我们找到一个元素比主元**小**。  

- 当左指针指向的元素比主元大且右指针指向的元素比主元小，并且此时左指针索引没有右指针索引大（行{14}），意思是左项比右项大（值比较）。我们交换它们，然后移动两个指针，并重复此过程（从行{11}再次开始）。 

- 在划分操作结束后，返回**左指针的索引**，用来在行{3}处创建子数组。 


- 优化:<http://www.blogjava.net/killme2008/archive/2010/09/08/331404.html> #

## 最大堆排序

- 堆排序也是一种很高效的算法，因其**把数组当作二叉树来排序**而得名。这个算法会根据以下信息，把数组当作二叉树来管理。 

  - 索引0是树的根节点； 
  - 除根节点外，任意节点N的父节点是(N-1)/2； 
  - 节点L的左子节点是2\*N+1
  - 节点R的右子节点是2\*N+2



- 堆排序算法实现如下： 

  ```js
  this.heapSort = function() { 
    var heapSize = array.length; 
    buildHeap(array); //{1} 
   
    while (heapSize > 1) { 
       // 减小堆的长度，相当于是把最大的元素排除了，即是：已排序
      heapSize--
      // 此时堆顶的堆中最大值，交换堆顶和堆尾的元素
      swap(array, 0, heapSize); //{2} 
      // 重新构建最大堆
      heapify(array, heapSize, 0); //{3} 
    }
  }; 
  ```

- 第一步，构造一个满足`array[parent(i)] ≥ array[i]`的堆结构（行{1}）。

- 第二步，交换堆里第一个元素（数组中较大的值）和最后一个元素的位置（行{2}）。这样，
  最大的值就会出现在它已排序的位置。 

- 第二步可能会丢掉堆的属性。因此，我们还需要执行一个heapify函数，再次将数组转换成
  堆，也就是说，它会找到当前堆的根节点（较小的值），重新放到树的底部。 

- buildHeap函数实现如下： 

  ```js
  function buildHeap(array){ 
    const heapSize = array.length; 
    for (let i = heapSize>>>1; i >= 0; i--) { 
      heapify(array, heapSize, i); 
    } 
  }
  ```

- 最后，heapify函数实现如下： 

  ```js
  // array是为了尾递归优化，真正的参数只有heapSize和i，这个函数就是要检查i的两个子节点是否都比小，否则就令他们之中最大的与i交换
  function heapify(array, heapSize, i){ 
    const left = i * 2 + 1, 
    right = i * 2 + 2, 
    largest = i; 
   
    if (left < heapSize && array[left] > array[largest]) { 
      largest = left; 
    } 
   
    if (right < heapSize && array[right] > array[largest]) { 
      largest = right; 
    } 
   
    if (largest !== i) { 
      swap(array, i, largest); 
      heapify(array, heapSize, largest); // 保证交换之后仍符合最大堆
    } 
  }; 
  ```


**完整代码**

- ```js
  this.heapSort = function(){
    let heapSize = array.length
    buildHeap(array); //{1} 
   
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
      largest = i; 
     
      if (left < heapSize && array[left] > array[largest]) { 
        largest = left; 
      } 
     
      if (right < heapSize && array[right] > array[largest]) { 
        largest = right; 
      } 
     
      if (largest !== i) { 
        swap(array, i, largest); 
        heapify(array, heapSize, largest); // 保证交换之后仍符合最大堆
      } 
    }
  }
  ```

### 复杂度分析

#### 建堆

- n个节点的堆，树高度是h=floor(log n)。对深度为于h-1层的节点，比较2次，交换1次，这一层最多有2^(h-1)个节点，总共操作次数最多为3*(1*2^(h-1))；对深度为h-2层的节点，总共有2^(h-2)个，每个节点最多比较4次，交换2次，所以操作次数最多为3*(2*2^(h-2))……

- 以此类推，从最后一个父节点到根结点进行堆调整的总共操作次数为：

  ```
  s=3*[2^(h-1) + 2*2^(h-2) + 3*2^(h-3) + … + h*2^0]       a
  2s=3*[2^h + 2*2^(h-1) + 3*2(h-2) + … + h*2^1]           b
  b-a，得到一个等比数列，根据等比数列求和公式
  s = 2s - s = 3*[2^h + 2^(h-1) + 2^(h-2) + … + 2 - h]=3*[2^(h+1)-  2 - h]≈3*n
  ```

- 所以建堆的时间复杂度是O(n)。

#### 堆调整

- 从堆调整的代码可以看到是当前节点与其子节点比较两次，交换一次。父节点与哪一个子节点进行交换，就对该子节点递归进行此操作，设对调整的时间复杂度为T(k)（k为该层节点到叶节点的距离），那么有
  T(k)=T(k-1)+3, k∈[2,h]
  T(1)=3
  迭代法计算结果为：
  T(h)=3*h=3*floor(log n)
  所以堆调整的时间复杂度是O(log n) 。

## 构建最小堆

### 最小堆排序

- ```js
  Array.prototype.minHeapSort = function(){
    const array = this
    let heapSize = array.length
    buildHeap(array) //{1} 
   
    while (heapSize > 1) { 
      // 减小堆的长度，相当于是把最小的元素排除了，即是：已排序
      heapSize--
      // 此时堆顶的堆中最小，交换堆顶和堆尾的元素
      swap(array, 0, heapSize); //{2} 
      // 从顶部开始重新构建最小堆
      heapify(array, heapSize, 0); //{3} 
    }
    function buildHeap(array){ 
      const heapSize = array.length; 
      for (let i = (heapSize>>>1)-1; i >= 0; i--) { 
        heapify(array, heapSize, i); 
      } 
    }
    function heapify(array, heapSize, i){ 
      let left = i * 2 + 1, 
          right = i * 2 + 2, 
          smallest = i 
     	// 与最大堆的不同之处，小于，smallest
      if (left < heapSize && array[left] < array[smallest]) { 
        smallest = left 
      } 
     
      if (right < heapSize && array[right] < array[smallest]) { 
        smallest = right 
      } 
     
      if (smallest !== i) { 
        swap(array, i, largsmallestest); 
        heapify(array, heapSize, smallest); // 保证交换之后仍符合最大堆
      } 
    }
  }
  ```

- 从大到小排序

### minHeap()

- 仅仅运行buildheap部分，即可构建一个结构，

- 然后调用用heapPop，即是弹出堆顶元素

  ```js
  function minHeap(array){
    buildHeap(array) 
  
    function buildHeap(array){ 
      const heapSize = array.length; 
      for (let i = (heapSize>>>1)-1; i >= 0; i--) { 
        minHeapify(array, heapSize, i); 
      } 
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
  ```

### heapPop()

- 不可以直接弹出堆顶的元素，而是应该先排除他，然后重新构建

- 排除的方法就是和堆尾的交换

  ```js
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
  ```

## 桶排序

## 乱序

### Math.random

- 一个经常会遇见的写法是使用 Math.random()：

  ```js
  var values = [1, 2, 3, 4, 5];
  
  values.sort(function(){
      return Math.random() - 0.5;
  });
  
  console.log(values)
  ```

- `Math.random() - 0.5` 随机得到一个正数、负数或是 0，如果是正数则降序排列，如果是负数则升序排列，如果是 0 就不变，然后不断的升序或者降序，最终得到一个乱序的数组。

- 看似很美好的一个方案，实际上，效果却不尽如人意。不信我们写个 demo 测试一下：

  ```js
  var times = [0, 0, 0, 0, 0];
  
  for (var i = 0; i < 100000; i++) {
      
      let arr = [1, 2, 3, 4, 5];
      
      arr.sort(() => Math.random() - 0.5);
      
      times[arr[4]-1]++;
  
  }
  
  console.log(times)
  ```

- 测试原理是：将 `[1, 2, 3, 4, 5]` 乱序 10 万次，计算乱序后的数组的最后一个元素是 1、2、3、4、5 的次数分别是多少。

- 一次随机的结果为：

  ```
  [30636, 30906, 20456, 11743, 6259]
  ```

- 该结果表示 10 万次中，数组乱序后的最后一个元素是 1 的情况共有 30636 次，是 2 的情况共有 30906 次，其他依此类推。

- 我们会发现，最后一个元素为 5 的次数远远低于为 1 的次数，所以这个方案是有问题的。

- 可是我明明感觉这个方法还不错呐？初见时还有点惊艳的感觉，为什么会有问题呢？

### 插入排序

- 如果要追究这个问题所在，就必须了解 sort 函数的原理，然而 ECMAScript 只规定了效果，没有规定实现的方式，所以不同浏览器实现的方式还不一样。
- 为了解决这个问题，我们以 v8 为例，v8 在处理 sort 方法时，当目标数组长度小于 10 时，使用插入排序；反之，使用快速排序和插入排序的混合排序。
- 所以我们来看看 v8 的源码，因为是用 JavaScript 写的，大家也是可以看懂的。
- 源码地址：<https://github.com/v8/v8/blob/master/src/js/array.js>
- 为了简化篇幅，我们对 `[1, 2, 3]` 这个数组进行分析，数组长度为 3，此时采用的是插入排序。
- 其原理在于将第一个元素视为有序序列，遍历数组，将之后的元素依次插入这个构建的有序序列中。

### 具体分析

- 明白了插入排序的原理，我们来具体分析下 [1, 2, 3] 这个数组乱序的结果。

- 演示代码为：

  ```js
  var values = [1, 2, 3];
  
  values.sort(function(){
      return Math.random() - 0.5;
  });
  ```

- 注意此时 sort 函数底层是使用插入排序实现

- 我们开始逐步分析乱序的过程：

- 因为插入排序视第一个元素为有序的，所以数组的外层循环从 `i = 1` 开始，`arr[i]` 值为 2，此时内层循环遍历，比较 `compare(1, 2)`：

  - 因为 `Math.random() - 0.5` 的结果有 50% 的概率小于 0 ，有 50% 的概率大于 0
  - 所以有 50% 的概率数组变成 [2, 1, 3]
  - 50% 的结果不变，数组依然为 [1, 2, 3]。

- 假设依然是 [1, 2, 3]，我们再进行一次分析，接着遍历，`i = 2`，`arr[i]` 的值为 3，此时内层循环遍历，比较 `compare(2, 3)`：

  - 有 50% 的概率数组不变，依然是 `[1, 2, 3]`，然后遍历结束。
  - 有 50% 的概率变成 [1, 3, 2]，因为还没有找到 3 正确的位置，所以还会进行遍历，所以在这 50% 的概率中又会进行一次比较：
    - `compare(1, 3)`，有 50% 的概率不变，数组为 [1, 3, 2]，此时遍历结束
    - 有 50% 的概率发生变化，数组变成 [3, 1, 2]。

- 综上，在 [1, 2, 3] 中，有 50% 的概率会变成 [1, 2, 3]，有 25% 的概率会变成 [1, 3, 2]，有 25% 的概率会变成 [3, 1, 2]。

- 另外一种情况 [2, 1, 3] 与之分析类似，我们将最终的结果汇总成一个表格：

  | 数组          | i = 1           | i = 2         | 总计          |
  | ------------- | --------------- | ------------- | ------------- |
  | [1, 2, 3]     | 50% [1, 2, 3]   | 50% [1, 2, 3] | 25% [1, 2, 3] |
  | 25% [1, 3, 2] | 12.5% [1, 3, 2] |               |               |
  | 25% [3, 1, 2] | 12.5% [3, 1, 2] |               |               |
  | 50% [2, 1, 3] | 50% [2, 1, 3]   | 25% [2, 1, 3] |               |
  | 25% [2, 3, 1] | 12.5% [2, 3, 1] |               |               |
  | 25% [3, 2, 1] | 12.5% [3, 2, 1] |               |               |

- 为了验证这个推算是否准确，我们写个 demo 测试一下：

  ```js
  var times = 100000;
  var res = {};
  
  for (var i = 0; i < times; i++) {
      
      var arr = [1, 2, 3];
      arr.sort(() => Math.random() - 0.5);
      
      var key = JSON.stringify(arr);
      res[key] ? res[key]++ :  res[key] = 1;
  }
  
  // 为了方便展示，转换成百分比
  for (var key in res) {
      res[key] = res[key] / times * 100 + '%'
  }
  
  console.log(res)
  ```

  这是一次随机的结果：

  [![Math random 效果演示](https://github.com/mqyqingfeng/Blog/raw/master/Images/shuffle/mathRandom.png)](https://github.com/mqyqingfeng/Blog/raw/master/Images/shuffle/mathRandom.png)

- 我们会发现，乱序后，`3` 还在原位置(即 [1, 2, 3] 和 [2, 1, 3]) 的概率有 50% 呢。

- 所以根本原因在于什么呢？其实就在于在插入排序的算法中，当待排序元素跟有序元素进行比较时，一旦确定了位置，就不会再跟位置前面的有序元素进行比较，所以就乱序的不彻底。

- 那么如何实现真正的乱序呢？而这就要提到经典的 Fisher–Yates 算法。

### Fisher–Yates

- 为什么叫 Fisher–Yates 呢？ 因为这个算法是由 Ronald Fisher 和 Frank Yates 首次提出的。

- 话不多说，我们直接看 JavaScript 的实现：

  ```js
  function shuffle(a) {
      var j, x, i;
      for (i = a.length; i; i--) {
          j = Math.floor(Math.random() * i);
          x = a[i - 1];
          a[i - 1] = a[j];
          a[j] = x;
      }
      return a;
  }
  ```

- 原理很简单，就是遍历数组元素，然后将当前元素与以后随机位置的元素进行交换，从代码中也可以看出，这样乱序的就会更加彻底。

- 如果利用 ES6，代码还可以简化成：

  ```js
  function shuffle(a) {
    const len = a.length
    for (let i = 0; i<len; i++) {
        let j = Math.floor(Math.random() * (len-i)+i);
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  ```

- 还是再写个 demo 测试一下吧：

  ```js
  var times = 100000;
  var res = {};
  
  for (var i = 0; i < times; i++) {
      var arr = shuffle([1, 2, 3]);
  
      var key = JSON.stringify(arr);
      res[key] ? res[key]++ :  res[key] = 1;
  }
  
  // 为了方便展示，转换成百分比
  for (var key in res) {
      res[key] = res[key] / times * 100 + '%'
  }
  
  console.log(res)
  ```

- 这是一次随机的结果：

  [![Fisher–Yates 效果演示](https://github.com/mqyqingfeng/Blog/raw/master/Images/shuffle/fisher-yates.png)](https://github.com/mqyqingfeng/Blog/raw/master/Images/shuffle/fisher-yates.png)

- 真正的实现了乱序的效果！

# 