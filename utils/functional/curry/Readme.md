## 函数柯里化

- 函数柯里化是把接受多个参数的函数转变成接受一个单一参数(最初函数的第一个参数),并且返回接受余下的参数而且返回结果的新函数的技术
- 柯里化其实本身是固定一个可以预期的参数，并返回一个特定的函数，处理批特定的需求。这增加了函数的适用性，但同时也降低了函数的适用范围。
- **本质**：用闭包把参数保存起来，当参数的数量足够执行函数了，就开始执行函数

### 通用定义

#### 基础定义

- ```js
  function currying(fn){
    var slice = Array.prototype.slice;
    // 截取fn后第一个参数，并保存在闭包内
    _args = slice.call(arguments,1);
    return function(...rest){
      return fn.apply(null,_args.concat(rest))
    }
  }
  const curryFunc = currying(fn,args)
  ```

**示例**

- ```js
  function square(i){
  	return i * i;
  }
  function dubble(i){
  	return i *= 2;
  }
  function map(handeler,list){
  	return list.map(handeler)
  }
  // 数组的每一项平方
  map(square, [1, 2, 3, 4, 5]);
  map(square, [6, 7, 8, 9, 10]);
  map(square, [10, 20, 30, 40, 50]);
  
  // 数组的每一项加倍
  map(dubble, [1, 2, 3, 4, 5]);
  map(dubble, [6, 7, 8, 9, 10]);
  map(dubble, [10, 20, 30, 40, 50]);
  ```

- 例子中，创建了一个map通用函数，用于适应不同的应用场景。显然，通用性不用怀疑。同时，例子中重复传入了相同的处理函数：square和dubble。

- 应用中这种可能会更多。当然，通用性的增强必然带来适用性的减弱。但是，我们依然可以在中间找到一种平衡。

- 我们利用柯里化改造一下：

  ```js
  function square(i) {
      return i * i;
  }
  
  function dubble(i) {
      return i *= 2;
  }
  
  function map(handeler, list) {
      return list.map(handeler);
  }
  
  var mapSQ = currying(map, square);
  mapSQ([1, 2, 3, 4, 5]);
  mapSQ([6, 7, 8, 9, 10]);
  mapSQ([10, 20, 30, 40, 50]);
  
  var mapDB = currying(map, dubble);
  mapDB([1, 2, 3, 4, 5]);
  mapDB([6, 7, 8, 9, 10]);
  mapDB([10, 20, 30, 40, 50]);
  ```

- 我们缩小了函数的适用范围，但同时提高函数的适性。

- 由此，可知柯里化不仅仅是提高了代码的合理性，更重的它突出一种思想---**降低适用范围，提高适用性**。

#### 更加通用的定义

- 正确的做法如下

  ```js
  const curry = function(fn,args=[]) {
    return function(...rest) {
      // 复制闭包里的参数，同时合并新传入的参数
      const _args = args.concat(rest)
      if (fn.length === _args.length) {
        // 累计的参数达到了形参的数量，执行函数
        return fn.apply(this, _args)
      }else{
        // 累计的参数没有达到了形参的数量，继续累计参数
        return curry.call(this, fn, _args);
      }
    }
  }
  ```

- ```js
  // 使用三目运算符，并且维护this
  function curry(fn, args = []) {
    return fn.length === args.length
      ? fn.apply(this, args)
      : function (...rest) {
      	// 当参数满了也会再次调用，然后执行fn
        return curry.call(this, fn, args.concat(rest))
      }
  }
  
  // 配合箭头函数，配合递归，但是无法维护this
  const curry = (fn, _args = []) => fn.length === _args.length 
    ? fn(..._args) 
    : (...rest) => curry(fn, _args.concat(rest));
  ```

- 如果不想定义参数，想要在传入空参数的时候直接调用

  ```js
  const curry = function(fn,args=[]) {
    return function(...rest) {
      // 复制闭包里的参数，同时合并新传入的参数
      const _args = args.concat(rest)
      if (fn.length === _args.length || rest.length ===0) {
        // 累计的参数达到了形参的数量，执行函数
        return fn.apply(this, _args)
      }else{
        // 累计的参数没有达到了形参的数量，继续累计参数
        return curry.call(this, fn, _args);
      }
    }
  }
  ```

**示例**

- ```js
  var curry = function(fn) {
    // 把所有传入的参数都保存在闭包内
    var _args = []
    return function cb(...rest) {
      if (fn.length === arr.length) {
        // 累计的参数达到了形参的数量，执行函数
        return fn.apply(this, _args)
      }
      // 累计的参数没有达到了形参的数量，继续累计参数
      _args.concat(rest)
      return cb;
    }
  }
  
  function add(){
    let sum = 0
    for (let i = 0; i < arguments.length; i++) {
      sum += arguments[i]
    }
    return sum
  }
  const curryAdd = curry(add)
  console.log(curryAdd(1)(2)(3)(4)())
  ```

### 延迟执行

- 柯里化的另一个应用场景是延迟执行。不断的柯里化，通过闭包累积传入的参数，最后执行

- 更加通用的写法

  ```js
  var curry = function(fn) {
      var _args = []
      return function cb() {
          if (arguments.length == 0) {
              return fn.apply(this, _args)
          }
          Array.prototype.push.apply(_args, arguments);
          return cb;
      }
  }
  ```

- 使用

  ```js
  function add(){
    let sum = 0
    for (let i = 0; i < arguments.length; i++) {
      sum += arguments[i]
    }
    return sum
  }
  const curryAdd = curry(add)
  console.log(curryAdd(1)(2)(3)(4)())
  ```

### 固定易变因素

- 柯里化特性决定了它这应用场景。提前把易变因素，传参固定下来，生成一个更明确的应用函数。最典型的代表应用，是bind函数用以固定this这个易变对象。

  ```js
  Function.prototype.bind = function(context,...rest) {
    var _this = this,
        _args = rest;
    return function(...rest) {
      return _this.apply(context, _args.concat(rest))
    }
  }
  ```

### 更加强大的功能

- curry 函数写到这里其实已经很完善了，但是注意这个函数的传参顺序必须是从左到右，根据形参的顺序依次传入，如果我不想根据这个顺序传呢？

  ```js
  var curry = function(fn) {
    // 把所有传入的参数都保存在闭包内
    var _args = []
    return function cb(...rest) {
      if (fn.length === arr.length) {
        // 累计的参数达到了形参的数量，执行函数
        return fn.apply(this, _args)
      }
      // 累计的参数没有达到了形参的数量，继续累计参数
      _args.concat(rest)
      return cb;
    }
  }
  ```

- 我们可以创建一个占位符，比如这样：

  ```js
  var fn = curry(function(a, b, c) {
      console.log([a, b, c]);
  });
  
  fn("a", _, "c")("b") // ["a", "b", "c"]
  ```

- <https://github.com/mqyqingfeng/Blog/issues/42>

## 