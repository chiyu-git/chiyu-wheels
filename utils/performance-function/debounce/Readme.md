## 防抖

- 防抖的原理就是：你尽管触发事件，但是我一定在事件触发 n 秒后才执行，如果你在一个事件触发的 n 秒内又触发了这个事件，那我就以新的事件的时间为准，n 秒后才执行，总之，就是要等你触发完事件 n 秒内不再触发事件，我才执行，真是任性呐!

### 初步实现

- ```js
  function debounce(func,wait){
    let timeout
    return function(){
      clearTimeout(timeout)
      timeout = setTimeout(func,wait)
    }
  }
  ```

### 完善

- this 的指向问题，因为涉及到了定时器

  ```js
    let count = 1;
    const container = document.getElementById('container');
  
    function getUserAction() {
        container.innerHTML = count++;
        console.log(this)
    };
  
    function debounce(func,wait){
      let timeout
      return function(){
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          func.call(this)
        },wait)
      }
    }
  
    container.onmousemove = debounce(getUserAction,1000);
  ```

- 不使用箭头函数的话，需要主动绑定this

  ```js
    function debounce(func,wait){
      let timeout
      return function(){
        const ctx = this // 事件回调函数指向正确的this
        clearTimeout(timeout)
        timeout = setTimeout(function() {
          func.call(ctx) // 调用call和apply方法的同时会执行函数，所以必须包裹在一个匿名函数内
        },wait)
      }
    }
  ```

- 事件event对象的缺失

  ```js
    function debounce(func,wait){
      let timeout
      return function(ev){
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          func.call(this,ev)
        },wait)
      }
    }
  ```

- 关键是意识到真正作为回调函数的是 debounce函数的返回值，所以这个函数有着正确的this指向和传入的参数

### 需求

#### 立即触发

- 希望第一次可以立即触发函数，如果频繁触发，则需要在停止触发n秒后才可以继续触发

  ```js
  function debounce(func, wait, immediate) {
  
    var timeout;
    var first  = true
    var callNow = false
    return function () {
      var context = this;
      var args = arguments;
  
      if (timeout) clearTimeout(timeout);
      if (immediate) {
        timeout = setTimeout(function(){
          callNow = true;
        }, wait)
        // 保证第一次执行，和之后可以重复执行
        if (first || callNow){
          func.apply(context, args)
          first = false
          callNow = false
        }
      }
      else {
        timeout = setTimeout(function(){
          func.apply(context, args)
        }, wait);
      }
    }
  }
  ```

- 利用定时器的返回值的特性，减少变量

  ```js
  function debounce(func, wait, immediate) {
  
    var timeout;
  
    return function () {
      var context = this;
      var args = arguments;
  
      if (timeout) clearTimeout(timeout);
      if (immediate) {
        // timeout的值不为0，说明开启了定时器，不可执行
        var callNow = !timeout;
        // 只要在wait时间内不再触发事件，timeout会从一个数字（定时器编号）变成null
        timeout = setTimeout(function(){
          timeout = null;
        }, wait)
        if (callNow) func.apply(context, args)
      }
      else {
        timeout = setTimeout(function(){
          func.apply(context, args)
        }, wait);
      }
    }
  }
  ```

#### 取消防抖

- 希望能取消 debounce 函数，比如说我 debounce 的时间间隔是 10 秒钟，immediate 为 true，这样的话，我只有等 10 秒后才能重新触发事件，现在我希望有一个按钮，点击后，取消防抖，这样我再去触发，就可以又立刻执行啦

  ```js
  function debounce(func, wait, immediate) {
  
    var timeout, result;
  
    var debounced = function () {
      var context = this;
      var args = arguments;
  
      if (timeout) clearTimeout(timeout);
      if (immediate) {
        // 如果已经执行过，不再执行
        var callNow = !timeout;
        timeout = setTimeout(function(){
          timeout = null;
        }, wait)
        if (callNow) result = func.apply(context, args)
      }
      else {
        timeout = setTimeout(function(){
          func.apply(context, args)
        }, wait);
      }
      return result;
    };
  
    debounced.cancel = function() {
      clearTimeout(timeout);
      timeout = null;
    };
  
    return debounced;
  }
  ```

- 使用

  ```js
  var count = 1;
  var container = document.getElementById('container');
  
  function getUserAction(e) {
    container.innerHTML = count++;
  };
  
  var setUseAction = debounce(getUserAction, 10000, true);
  
  container.onmousemove = setUseAction;
  
  document.getElementById("button").addEventListener('click', function(){
    setUseAction.cancel();
  })
  ```

### 返回值

- 虽然说一般事件绑定函数是没有返回值的，因为传入的是一个回调函数，想要获得回调函数的处理结果需要再传入一个回调函数接受这个结果，但是这样没办法再 immediate 为 false 的时候获得返回值，因为定时器的this指向window，且不接受额外的回调函数，最好的方法还是使用 promise

### 对比

- 前面的防抖表现为：停止一段时间后，由定时器触发
- 需求内的防抖变成了：立即执行，停止一段时间后，才可以再去触发
- 后一种情况才是实际中更加多见的吧

### 防抖应用场景

1. 搜索框输入查询，如果用户一直在输入中，没有必要不停地调用去请求服务端接口，等用户停止输入的时候，再调用，设置一个合适的时间间隔，有效减轻服务端压力。
2. 表单验证
3. 按钮提交事件。
4. 浏览器窗口缩放，resize事件等。

## 