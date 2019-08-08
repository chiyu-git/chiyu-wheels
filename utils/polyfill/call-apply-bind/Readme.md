## call() apply() bind() @@@

### call()

- call() 方法在使用一个指定的 this 值和若干个指定的参数值的前提下调用某个函数或方法。

- 让某个函数临时成为指定的 this 的方法，并且进行调用

  ```js
  var foo = {
      value: 1
  };
  
  function bar() {
      console.log(this.value);
  }
  
  bar.call(foo); // 1
  ```

- call 改变了 this 的指向，指向到 foo

- 同时，bar 函数执行了

#### 模拟实现第一步

1. 将函数设为对象的属性
2. 执行该函数
3. 删除该函数

- 改造上面的例子

  ```js
  // 第一步
  foo.fn = bar
  // 第二步
  foo.fn()
  // 第三步
  delete foo.fn
  ```

- 完整版myCall函数

  ```js
  Function.prototype.myCall = function(context){
    // context是传统意义上的this，一个obj
    // 这里的this是要执行的函数
    // foo.fn = bar
    context.fn = this 
    context.fn()
    delete context.fn
  }
  
  const foo = {
    value:1,
  }
  
  function bar(){
    console.log(this.value)
  }
  
  bar.myCall(foo) // 1
  ```

#### 模拟实现第二步

- call 函数还能给定参数执行函数，但是，传入的参数并不确定，并且传入的参数要再传入到调用的函数中

- 两种错误的做法

  ```js
  // 将数组里的元素作为多个参数放进函数的形参里
  context.fn(args.join(','))
  // 相当于是传入了一个 join 好的字符串
  
  // 相当于是传入了一个类数组对象，只有第一个形参被赋予该值
  context.fn(arguments)
  ```

- 使用ES6的做法，使用扩展运算符即可解决

  ```js
  Function.prototype.myCall = function(context,...rest){
    context.fn = this
    // {value: 1, fn: },1,2,3
    // context.fn(...arguments)
    context.fn(..rest)
    delete context.fn
  }
  
  const foo = {
    value:1,
  }
  
  function bar(a,b){
    console.log(this.value)
    console.log(a,b) // this,1
  }
  
  bar.myCall(foo,1,2,3) // 1
  ```

- 不过 call 是 ES3 的方法，模拟实现就别用ES6了

**eval()**

- 截取arguments的参数部分

- ```js
  // 以上个例子为例，此时的arguments为：
  // arguments = {
  //      0: foo,
  //      1: 'kevin',
  //      2: 18,
  //      length: 3
  // }
  // 因为arguments是类数组对象，所以可以用for循环
  var args = [];
  for(var i = 1, len = arguments.length; i < len; i++) {
      args.push('arguments[' + i + ']');
  }
  
  // 执行后 args为 ["arguments[1]", "arguments[2]", "arguments[3]"]
  ```

- 通过eval还原参数

  ```js
  eval('context.fn(' + args +')')
  // context.fn(arguments[1],arguments[2],arguments[3])
  ```

```
  
- 这里 args 会自动调用 Array.toString() 这个方法，相当于`args.join(',')`

  > 既然最终要执行的是字符串那为什么不使用字符串拼接呢？因为参数之间有个逗号，使用数组可以不用考虑去掉尾逗号

- eval()版完整代码

  ```js
  Function.prototype.myCall = function(context){
    const args = []
    context.fn = this
    for (let i = 1; i < arguments.length; i++) {
      args.push('arguments['+i+']')
    }
    eval('context.fn('+args+')')
    delete context.fn
  }
  
  const foo = {
    value:1,
  }
  
  function bar(a,b){
    console.log(this.value)
    console.log(a,b) // this,1
  }
  
  bar.myCall(foo,1,{b:2}) // 1
```

#### 模拟实现第三步

**两个注意点**

- **this 参数可以传 null，当为 null 的时候，视为指向 window**

- **函数是可以有返回值的！**

- 最终版完整代码

  ```js
  // 第三版
  Function.prototype.call2 = function (context) {
      // null
      var context = context || window;
      context.fn = this;
  
      var args = [];
      for(var i = 1, len = arguments.length; i < len; i++) {
          args.push('arguments[' + i + ']');
      }
    
      var result = eval('context.fn(' + args +')');
  
      delete context.fn
      return result;
  }
  
  // 测试一下
  var value = 2;
  
  var obj = {
      value: 1
  }
  
  function bar(name, age) {
      console.log(this.value);
      return {
          value: this.value,
          name: name,
          age: age
      }
  }
  
  bar.call2(null); // 2
  
  console.log(bar.call2(obj, 'kevin', 18));
  // 1
  // Object {
  //    value: 1,
  //    name: 'kevin',
  //    age: 18
  // }
  ```

### apply()

- ```js
  Function.prototype.apply = function (context, arr) {
      var context = Object(context) || window;
      context.fn = this;
  
      var result;
      if (!arr) {
          result = context.fn();
      }
      else {
          var args = [];
          for (var i = 0, len = arr.length; i < len; i++) {
              args.push('arr[' + i + ']');
          }
          result = eval('context.fn(' + args + ')')
      }
  
      delete context.fn
      return result;
  }
  ```

### bind()

- bind() 方法会创建一个新函数。当这个新函数被调用时，bind() 的第一个参数将作为它运行时的 this，之后的一序列参数将会在传递的实参前传入作为它的参数。

#### 返回函数的实现

- 返回一个函数

- 可以指定this，关于this的指定，我们可以使用 call() 或者 apply() 方法实现

  ```js
  Function.prototype.bind2 = function (context) {
  	// self = bar
    var self = this;
    return function () {
      // bar.apply(foo)
      return self.apply(context); // 调用函数可能会有返回值，所以需要再return一个
    }
  
  }
  const foo = {
    value:1,
  }
  
  function bar(){
    console.log(this.value)
  }
  
  bar.bind2(foo)
  ```

#### 分段传参的实现

- ```js
  var foo = {
      value: 1
  };
  
  function bar(name, age) {
      console.log(this.value);
      console.log(name);
      console.log(age);
  
  }
  
  var bindFoo = bar.bind(foo, 'daisy');
  bindFoo('18');
  // 1
  // daisy
  // 18
  ```

- 函数需要传 name 和 age 两个参数，竟然还可以在 bind 的时候，只传一个 name，在执行返回的函数的时候，再传另一个参数 age!

- 我们用 arguments 进行处理：

  ```js
  // 第二版
  Function.prototype.bind2 = function (context) {
    var self = this;
    // 获取bind2函数从第二个参数到最后一个参数
    var args = Array.prototype.slice.call(arguments, 1);
    return function (...bindArgs) {
      return self.apply(context, args.concat(bindArgs));
    }
  }
  ```

- 其实就是一个简单的函数柯里化

#### 构造函数效果的实现

- 因为 bind 还有一个特点，就是

  > 一个绑定函数也能使用new操作符创建对象：这种行为就像把原函数当成构造器。提供的 this 值被忽略，同时调用时的参数被提供给模拟函数。

- 先来看一个例子

  ```js
  var value = 2;
  
  var foo = {
      value: 1
  };
  
  function bar(name, age) {
      this.habit = 'shopping';
      console.log(this.value);
      console.log(name);
      console.log(age);
  }
  
  bar.prototype.friend = 'kevin';
  
  var bindFoo = bar.bind(foo, 'daisy');
  
  var obj = new bindFoo('18');
  // undefined
  // daisy
  // 18
  console.log(obj.habit); // shopping
  console.log(obj.friend); // kevin
  
  ```

- **注意：**尽管在全局和 foo 中都声明了 value 值，最后依然返回了 undefind，说明绑定的 this 失效了，如果大家了解 new 的模拟实现，就会知道这个时候的 this 已经指向了 obj。

- 我们可以通过修改返回的函数的原型来实现，让我们写一下：

  ```js
  // 第三版
  Function.prototype.bind2 = function (context) {
    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);
    var fBound = function (...bindArgs) {
      // 当作为构造函数时，this 指向实例，此时结果为 true，将绑定函数的 this 指向该实例，可以让实例获得来自绑定函数的值
      // 以上面的是 demo 为例，如果改成 `this instanceof fBound ? null : context`，实例只是一个空对象，将 null 改成 this ，实例会具有 habit 属性
      // 当作为普通函数时，this 指向 window，此时结果为 false，将绑定函数的 this 指向 context
      return self.apply(this instanceof fBound ? this : context, args.concat(bindArgs));
    }
    // 修改返回函数的 prototype 为绑定函数的 prototype，实例就可以继承绑定函数的原型中的值
    fBound.prototype = this.prototype;
    return fBound;
  }
  ```

#### 构造函数效果的优化实现

- 但是在这个写法中，我们直接将 fBound.prototype = this.prototype，我们直接修改 fBound.prototype 的时候，也会直接修改绑定函数的 prototype。这个时候，我们可以通过一个空函数来进行中转：

  ```js
  Function.prototype.bind2 = function (context) {
  
      var self = this;
      var args = Array.prototype.slice.call(arguments, 1);
  
      var fNOP = function () {};
  
      var fBound = function () {
          var bindArgs = Array.prototype.slice.call(arguments);
          return self.apply(this instanceof fBount ? this : context, args.concat(bindArgs));
      }
      fNOP.prototype = this.prototype;
      // 即是fBound的实例，也是fNOP的实例
      fBound.prototype = new fNOP();
      return fBound;
  }
  ```

- 寄生构造函数

#### 三个小问题

- 在 MDN 中文版讲 bind 的模拟实现时，apply 这里的代码是：

  ```js
  self.apply(this instanceof self ? this : context || this, args.concat(bindArgs))
  ```

  - 多了一个关于 context 是否存在的判断，然而这个是错误的！
  - 举个例子：

  ```js
  var value = 2;
  var foo = {
      value: 1,
      bar: bar.bind(null)
  };
  
  function bar() {
      console.log(this.value);
  }
  
  foo.bar() // 2
  ```

  - 以上代码正常情况下会打印 2，如果换成了 context || this，这段代码就会打印 1！
  - 所以这里不应该进行 context 的判断，大家查看 MDN 同样内容的英文版，就不存在这个判断！

- **调用 bind 的不是函数咋办？**

  ```js
  if (typeof this !== "function") {
    throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
  }
  ```

#### 最终代码

- ```js
  Function.prototype.bind2 = function (context) {
  
      if (typeof this !== "function") {
        throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
      }
  
      var self = this;
      var args = Array.prototype.slice.call(arguments, 1);
  
      var fNOP = function () {};
  
      var fBound = function (...bindArgs) {
          return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
      }
  
      fNOP.prototype = this.prototype;
      fBound.prototype = new fNOP();
      return fBound;
  }
  ```

## 