# 队列

- 与栈类似，队列是另一种线性数据结构，以顺序方式存储元素。只允许在表的前端（front）进行删除操作，在表的后端（end）进行插入操作，和栈一样，队列是一种操作受限制的线性表。进行插入操作的端称为**队尾**，进行删除操作的端称为**队首**。
- 堆栈和队列之间唯一的显着区别是，队列不是使用 LIFO 方法，而是应用 FIFO 方法，这是 First in First Out（先入先出）的缩写。
- 队列的完美现实例子：一列人在售票亭等候。如果有新人来，他们是从末尾加入队列，而不是在开头——站在前面的人将先买到票然后离开队列。

## 队列的实现

### 普通队列

- 从数据存储的角度看，实现队列有两种方式，一种是以数组做基础，一种是以链表做基础，数组是最简单的实现方式，本文以基础的数组来实现队列。

- 我们定义以下几个队列的方法：

  - enqueue 从队尾添加一个元素（新来一个办业务的人，排在了队尾）
  - dequeue 从队首删除一个元素（队伍最前面的人，办完了业务，离开了）
  - head 返回队首的元素（后边的人好奇看一下，队伍最前面的人是谁）
  - tail 返回队尾的元素（前边的人好奇看一下，队伍最后面的人是谁）
  - size 返回队列的大小（营业员数一下队伍有多少人）
  - isEmpty 返回队列是否为空（营业员查看当前是不是有人在排队）
  - clear 清空队列（此窗口暂停营业，大家撤了吧）

- 然后我们利用es6的class的实现以上的方法

  ```js
  class Queue {
    constructor() {
      this.items = []; // 存储数据
    }
    enqueue(item) { // 向队尾添加一个元素
      this.items.push(item);
    }
    dequeue() { // 删除队首的一个元素
      return this.items.shift();
    }
    head() { // 返回队首的元素
      return this.items[0];
    }
    tail() { // 返回队尾的元素
      return this.items[this.items.length - 1];
    }
    size() { // 返回队列的元素
      return this.items.length;
    }
    isEmpty() { // 返回队列是否为空
      return this.items.length === 0;
    }
    clear() { // 清空队列
      this.items = [];
    }
  }
  ```

### 优先队列

- 优先队列。元素的添加和移除是基于优先级的。

  > 一个现实的例子就是机场登机的顺序。头等舱和商务舱乘客的优先级要高于经济舱乘客。在有些国家，老年人和孕妇（或带小孩的妇女）登机时也享有高于其他乘客的优先级。 

- 实现一个优先队列，有两种选项：

  - 设置优先级，然后在**正确的位置添加元素**，可以使用**默认的出列操作**
  - 或者用**默认的入列操作**添加元素，然后按照**优先级移除元素**。

- 我们在这里实现的优先队列称为最小优先队列，因为优先级的值较小的元素被放置在队列最前面（1代表更高的优先级）。最大优先队列则与之相反，把优先级的值较大的元素放置在队列最前面。 

  > 想想生活中排队取号，，优先级priority数值越小，排在前面，优先级高。

- ```js
  function PriorityQueue() { 
    let items = []; 
    // 新建优先级对象的工厂函数
    function QueueElement (element, priority){ // {1} 
      this.element = element; 
      this.priority = priority; 
    } 
   
    this.enqueue = function(element, priority){ 
      let queueElement = new QueueElement(element, priority); 
   
      let added = false; 
      for (let i=0; i<items.length; i++){ 
        
        if (queueElement.priority < items[i].priority){ // {2} 
          // 找到一个优先级比要添加的元素小的，排在他的后面
          items.splice(i,0,queueElement); // {3} 
          added = true; 
          break; // {4} 
        } 
      } 
      if (!added){ 
        // 循环之后 added仍为 false ，说明优先级是最低的，排在队尾
        items.push(queueElement); //{5} 
      } 
    }; 
   
    this.print = function(){ 
      for (let i=0; i<items.length; i++){ 
        console.log(`${items[i].element} - ${items[i].priority}`); 
      } 
    }; 
    //其他方法和默认的Queue实现相同 
  } 
  
  let priorityQueue = new PriorityQueue(); 
  priorityQueue.enqueue("John", 2); 
  priorityQueue.enqueue("Jack", 1); 
  priorityQueue.enqueue("Camila", 1); 
  priorityQueue.print(); 
  ```


### 循环队列

- 循环队列的一个例子就是击鼓传花游戏（Hot Potato）。

  > 在这个游戏中，孩子们围成一个圆圈，把花尽快地传递给旁边的人。某一时刻传花停止，这个时候花在谁手里，谁就退出圆圈结束游戏。重复这个过程，直到只剩一个孩子（胜者）。 

- ```js
  function hotPotato (nameList, num){ 
   
    let queue = new Queue(); // {1} 
   
    for (let i=0; i<nameList.length; i++){ 
      queue.enqueue(nameList[i]); // {2} 
    } 
   
    let eliminated = ''; 
    while (queue.size() > 1){ 
      for (let i=0; i<num; i++){ 
        // 将队首的放入队尾，执行num次
        queue.enqueue(queue.dequeue()); // {3} 
      } 
      // 一轮之后(num次),此时在队尾的人被淘汰
      eliminated = queue.dequeue();// {4} 
      console.log(eliminated + '在击鼓传花游戏中被淘汰。'); 
    } 
    // 队伍的长度等于1，游戏结束
    return queue.dequeue();// {5} 
  } 
   
  let names = ['Jack','John','Camila','Ingrid','Carl'];
  let winner = hotPotato(names, 7);
  console.log('The winner is: ' + winner); 
  ```

## 队列的应用

### 约瑟夫环问题

- 有一个数组存放了100个数据0-99，要求每隔两个数删除一个数，到末尾时再循环至开头继续进行，求最后一个被删除的数字。

  > 比如说：有十个数字：0，1，2，3，4，5，6，7，8，9，每隔两个数删除一个数，就是2 5 8 删除，如果只是从0到99每两个数删除一个数，其实挺简单的，但是我们还得考虑到末尾的时候还有再重头开始，还得考虑删除掉的元素从数组中删除。那我们如果队列的话，就比较简单了

- 思路分析

  1. 先将这100个数据放入队列，用while循环，终止的条件是队列里只有一个元素。
  2. 定义index变量从0开始计数，从队列头部删除一个元素，index + 1
  3. 如果index%3 === 0 ,说明这个元素需要被移除队列，否则的话就把它添加到队列的尾部
  4. 经过while循环后，不断的有元素出队列，最后队伍中只会剩下一个被删除的元素

  ```js
  var arr = []; 
  // 准备0-99  100个数据
  for (var i = 0; i < 100; i++) {
    arr.push(i);
  }
  // 每隔两个数删除一个数
  function delRang(arr) {
    var queue = new Queue(); // 调用之前实现Queue类
    var len = arr.length;
    for (var i = 0; i < len; i++) {
      queue.enqueue(i); // 将数据存入队列
    }
    var index = 0;
    while (queue.size() !== 1) { // 循环判断队列里大小否为还剩下1个
      var item = queue.dequeue(); // 出队一个元素，根据当前的index来判断是否需要移除
      index += 1;
      if (index % 3 !== 0) {
        queue.enqueue(item); // 不是的话，则添加到队尾，继续循环
      }
    }
    console.log(queue.head()); // 90
    return queue.head(); // 返回最后一个元素
  }
  
  delRang(arr);
  ```

### 斐波那契数列

- > 什么是斐波那契数列： 斐波那契数列（Fibonacci sequence），又称黄金分割数列、因数学家列昂纳多·斐波那契（Leonardoda Fibonacci）以兔子繁殖为例子而引入，故又称为“兔子数列”，指的是这样一个数列：1、1、2、3、5、8、13、21、34、……这个数列从第3项开始，每一项都等于前两项之和。在数学上，斐波纳契数列以如下被以递归的方法定义：F(1)=1，F(2)=1, F(n)=F(n-1)+F(n-2)（n>=3，n∈N*）

- 递归版 代码实现

  ```js
  function Fibonacci (n) {
    if ( n <= 2 ) {return 1};
    return Fibonacci(n - 1) + Fibonacci(n - 2);
  }
  Fibonacci(10) // 55
  Fibonacci(100) // 堆栈溢出
  Fibonacci(500) // 堆栈溢出
  ```

- 由上可见，递归非常消耗内存，因为需要同时保存成千上百个调用帧，很容易发生“栈溢出”错误。但是也有解决的办法，采用尾递归优化。

- 函数调用自身，称为递归；如果尾调用自身，就称为尾递归。对于尾递归来说，由于只存在一个调用栈，所以永远不会发生“栈溢出”错误。

- 尾递归版 代码实现

  ```js
  function Fibonacci2 (n , ac1 = 1 , ac2 = 1) {
    if( n <= 2 ) {return ac2};
    return Fibonacci2 (n - 1, ac2, ac1 + ac2);
  }
  Fibonacci2(100) // 354224848179262000000
  Fibonacci2(1000) // 4.346655768693743e+208
  ```

- 用队列实现一遍，思路分析

  1. 需要先将两个1 添加到队列中
  2. 定义index来计数，采用while循环，判断条件是 index < n - 2(因为每次遍历我们只保留2个元素在队列中)
  3. 使用dequeue方法移除队列头部的元素，标记为 numDel;
  4. 使用head方法获取此时头部的元素，标记为 numHead;
  5. 使用enqueue方法将前两者的和从尾部放入队列中
  6. index + 1

- 当循环结束后，队列里面只有两个元素，用dequeue方法移除头部元素后，再用head方法获取的头部元素就是最终的结果，而且此方法不会产生“栈溢出”错误。

  ```js
  {
    function fibonacci(n) {
      if (n <= 2) return 1;
      var queue = new Queue();
      // 先存入序列的前两个值
      queue.enqueue(1);
      queue.enqueue(1);
      var index = 0;
      while (index < n - 2) {
        var delItem = queue.dequeue(); // 移除队列的头部元素
        var headItem = queue.head(); // 获取新的队列头部元素(因为上一步已经将头部元素移除)
        var resNum = delItem + headItem;
        queue.enqueue(resNum); // 将两者之和存入队列
        index += 1;
      }
      queue.dequeue();
      return queue.head();
    }
    console.log("fibonacci", fibonacci(10)); // 55
    console.log("fibonacci", fibonacci(100)); // 354224848179262000000
  }
  ```

- 下面是一个利用 Generator 函数和`for...of`循环，实现**斐波那契数列**的例子。

  ```javascript
  function* fibonacci() {
    let [prev, curr] = [0, 1];
    for (;;) {
      yield curr;
      [prev, curr] = [curr, prev + curr];
    }
  }
  
  for (let n of fibonacci()) {
    if (n > 1000) break;
    console.log(n);
  }
  ```

- 从上面代码可见，使用`for...of`语句时不需要使用`next`方法。

### 打印杨辉三角

- ![img](https://gss2.bdstatic.com/9fo3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike92%2C5%2C5%2C92%2C30/sign=b15f585fc3ea15ce55e3e85bd7695196/7e3e6709c93d70cf89a39cd7f2dcd100bba12b8a.jpg) 

- 思路分析

  1. 杨辉三角中的每一行，都依赖于上一行，假设现在队列里已经存储了第n-1行的数据，那么输出第n行时，只需要将队列里的数据依次出队列，进行计算得到下一行的数值并将计算所得存储到队列中
  2. 然后我们需要两层for循环，将n-1行和n行的数据分开打印；有上图可以得出规律，n行只有n个数，所以我们就可以使用for循环控制enqueue的次数，n次结束后，队列里存储的就是计算好的第n+1行的数据

  ```html
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <title>打印杨辉三角</title>
    </head>
    <body>
      <script src="./queue.js"></script>
      <script>
        // 杨辉三角
        {
          function yangHui(n) {
            var queue = new Queue();
            queue.enqueue(1); // 先在队列中存储第一行的数据
            for (var i = 1; i <= n; i++) { // 第一层循环控制层数
              var line = "";
              var pre = 0;
              for (var j = n; j > i; j--) { // 打印空格
                document.write("&nbsp;");
              }
              for (var j = 0; j < i; j++) { // 第二层控制当前层的数据
                var item = queue.dequeue();
                var value = item + pre; // 计算下一行的值
                pre = item;
                line += item + " ";
                queue.enqueue(value);
              }
              queue.enqueue(1); // 将每层的最后一个数值 1 存入队列中
              document.write(line + "<br />");
            }
          }
          yangHui(10);
        }
      </script>
    </body>
  </html>
  ```

### 常问的队列面试问题：

- 使用队列来实现堆栈
- 颠倒队列中前 k 个元素的顺序
- 使用队列生成从 1 到 n 的二进制数
- 使用队列的例子还有很多，比如逐层打印一颗树上的节点，还有消息通讯使用的socket，当大量客户端向服务端发起连接，而服务端拥挤时，就会形成队列，先来的先处理，后来的后处理，当队列满时，新来的请求直接抛弃掉。
- 数据结构在系统设计中的应用非常广泛，只是我们水平达不到那个级别，知道的太少，但如果能理解并掌握这些数据结构，那么就有机会在工作中使用它们并解决一些具体的问题，当我们手里除了锤子还有电锯时，那么我们的眼里就不只是钉子，解决问题的思路也会更加开阔。
