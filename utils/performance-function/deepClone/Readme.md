## 类型判断

### typeof:

- 在 ES6 前，JavaScript 共六种数据类型，分别是：

  > Undefined、Null、Boolean、Number、String、Object

- typeof 对这些数据类型的值进行操作的时候，返回的结果却不是一一对应，分别是：

  > undefined、object、boolean、number、string、object

- **注意：返回的字符串都是小写的**，`typeof NaN // number`

- 可以判断: undefined/ 数值 / 字符串 / 布尔值 / **function**

- 不能判断: null与object  object与array , 不能区分出 object 的类

  ```js
  typeof null //object
  typeof array //object
  typeof NaN // number
  ```

- 在 JavaScript 最初的实现中，JavaScript 中的值是由一个表示类型的标签和实际数据值表示的。对象的类型标签是 0。由于 `null` 代表的是空指针（大多数平台下值为 0x00），因此，null的类型标签也成为了 0，`typeof null`就错误的返回了"`object"`。（[reference](http://www.2ality.com/2013/10/typeof-null.html)）

- ECMAScript提出了一个修复（通过opt-in），但[被拒绝](http://wiki.ecmascript.org/doku.php?id=harmony:typeof_null)。这将导致typeof null === 'object'。

### instanceof:

- instanceof运算符用于测试**构造函数**的prototype属性是否出现在对象的原型链中的任何位置
- 判断对象的是否是某个**具体类**（构造函数的实例）

**返回值**

- 如果该对象是构造函数的实例，则返回true，否则返回false

**示例**

- ```js
  语法：对象 instanceof 构造函数
  console.log(per instanceof Person); //true
  ```

**注意**

- **Object**是所有对象的祖先，所以任何对象和Object做instanceof运算符都会返回true

### ===

- 可以判断: undefined, null
- 因为这两个类型都只有一个值

### Object.prototype.toString.call(target) 

- 返回固定字符串： [object Target类型]

- `Object.prototype.toString.call(target).slice(8,-1)`，就可以返回准确的类型

- ES5开始，可以检查Null 和 undefined。ES5 规范地址：<https://es5.github.io/#x15.2.4.2>。

- 当 `Object.prototype.toString` 方法被调用的时候，下面的步骤会被执行：

  > 1. 如果 this 值是 undefined，就返回 [object Undefined]
  > 2. 如果 this 的值是 null，就返回 [object Null]
  > 3. 让 O 成为 ToObject(this) 的结果
  > 4. 让 class 成为 O 的内部属性 [[Class]] 的值
  > 5. 最后返回由 "[object " 和 class 和 "]" 三个部分组成的字符串

- 无法判断自定义类型

- Object.prototype.toString 可以识别出至少12种数据类型

  ```js
  // 以下是12种：
  var number = 1;          // [object Number]
  var string = '123';      // [object String]
  var boolean = true;      // [object Boolean]
  var und = undefined;     // [object Undefined]
  var nul = null;          // [object Null]
  var obj = {a: 1}         // [object Object]
  var array = [1, 2, 3];   // [object Array]
  var date = new Date();   // [object Date]
  var error = new Error(); // [object Error]
  var reg = /a/g;          // [object RegExp]
  var func = function a(){}; // [object Function]
  // ES6
  const sym = Symbol() // [object Symbol]
  
  function checkType() {
    for (var i = 0; i < arguments.length; i++) {
      console.log(Object.prototype.toString.call(arguments[i]))
    }
  }
  
  checkType(number, string, boolean, und, nul, obj, array, date, error, reg, func)
  ```

  ```js
  console.log(Object.prototype.toString.call(Math)); // [object Math]
  console.log(Object.prototype.toString.call(JSON)); // [object JSON]
  console.log(Object.prototype.toString.call(window)); // [object Window]
  ```

  ```js
  function a() {
      console.log(Object.prototype.toString.call(arguments)); // [object Arguments]
  }
  a();
  ```

  > **注意：**
  >
  > - Array.prototype的类型**也是数组**，类似的Number.prototype是number类型的对象
  > - 实例本身是没有`constructor`属性的，`constructor`属性在原型上，为了保持一致性，所以`Array.prototype`也是`Array`

### 封装 type 函数

- 写一个 type 函数能检测各种类型的值

  - 基本类型，就使用 typeof
  - 引用类型就使用 toString
  - 此外鉴于 typeof 的结果是小写，我也希望所有的结果都是小写。
  - 考虑到实际情况下并不会检测 Math 和 JSON，所以去掉这两个类型的检测。

  ```js
  // 第一版
  var class2type = {};
  
  // 生成class2type映射
  "Boolean Number String Function Array Date RegExp Object Error Null Undefined".split(" ").map(function(item, index) {
      class2type["[object " + item + "]"] = item.toLowerCase();
  })
  
  function type(obj) {
      return typeof obj === "object" || typeof obj === "function" ?
          class2type[Object.prototype.toString.call(obj)] || "object" :
          typeof obj;
  }
  ```

- **注意：**在 IE6 中，null 和 undefined 会被 Object.prototype.toString 识别成 [object Object]！

- 兼容IE6

  ```js
  // 第二版
  var class2type = {};
  
  // 生成class2type映射
  "Boolean Number String Function Array Date RegExp Object Error".split(" ").map(function(item, index) {
      class2type["[object " + item + "]"] = item.toLowerCase();
  })
  
  function type(obj) {
      // 一箭双雕
      if (obj == null) {
          return obj + "";
      }
      return typeof obj === "object" || typeof obj === "function" ?
          class2type[Object.prototype.toString.call(obj)] || "object" :
          typeof obj;
  }
  ```

### isFunction

- 有了 type 函数后，我们可以对常用的判断直接封装，比如 isFunction:

  ```js
  function isFunction(obj) {
      return type(obj) === "function";
  }
  ```

### isArray

- ```js
  var isArray = Array.isArray || function( obj ) {
      return type(obj) === "array";
  }
  ```

- 原型和构造函数都有被修改的可能性

### isArrayLike

- isArrayLike，看名字可能会让我们觉得这是判断类数组对象的，其实不仅仅是这样，jQuery 实现的 isArrayLike，数组和类数组都会返回 true

  ```js
  function isArrayLike(obj) {
  
    // obj 必须有 length属性
    var length = !!obj && "length" in obj && obj.length;
    var typeRes = type(obj);
  
    // 排除掉函数和 Window 对象
    if (typeRes === "function" || isWindow(obj)) {
      return false;
    }
  
    return typeRes === "array" || length === 0 ||
      typeof length === "number" && length > 0 && (length - 1) in obj;
  }
  ```

- 重点分析 return 这一行，使用了或语句，只要一个为 true，结果就返回 true。

- 所以如果 isArrayLike 返回true，至少要满足三个条件之一：

  1. 是数组
  2. 长度为 0
  3. lengths 属性是大于 0 的数字类型，并且`obj[length - 1]`必须存在

- 第一个就不说了，看第二个，为什么长度为 0 就可以直接判断为 true 呢？

  那我们写个对象：

  ```js
  var obj = {a: 1, b: 2, length: 0}
  ```

  isArrayLike 函数就会返回 true，那这个合理吗？

  回答合不合理之前，我们先看一个例子：

  ```js
  function a(){
      console.log(isArrayLike(arguments))
  }
  a();
  ```

  如果我们去掉length === 0 这个判断，就会打印 false，然而我们都知道 arguments 是一个类数组对象，这里是应该返回 true 的。

  所以是不是为了放过空的 arguments 时也放过了一些存在争议的对象呢？

  第三个条件：length 是数字，并且 length > 0 且最后一个元素存在。

  为什么仅仅要求最后一个元素存在呢？

  让我们先想下数组是不是可以这样写：

  ```json
  var arr = [,,3]
  ```

  当我们写一个对应的类数组对象就是：

  ```js
  var arrLike = {
      2: 3,
      length: 3
  }
  ```

  也就是说当我们在数组中用逗号直接跳过的时候，我们认为该元素是不存在的，类数组对象中也就不用写这个元素，但是最后一个元素是一定要写的，要不然 length 的长度就不会是最后一个元素的 key 值加 1。比如数组可以这样写

  ```
  var arr = [1,,];
  console.log(arr.length) // 2
  ```

  但是类数组对象就只能写成：

  ```js
  var arrLike = {
      0: 1,
      length: 1
  }
  ```

  所以符合条件的类数组对象是一定存在最后一个元素的！

  这就是满足 isArrayLike 的三个条件，其实除了 jQuery 之外，很多库都有对 isArrayLike 的实现，比如 underscore:

  ```js
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  
  var isArrayLike = function(collection) {
      var length = getLength(collection);
      return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };
  ```

### isPlainObject

- plainObject 来自于 jQuery，可以翻译成纯粹的对象，所谓"纯粹的对象"，就是该对象是通过 "{}" 或 "new Object" 创建的，该对象含有零个或者多个键值对。

- 之所以要判断是不是 plainObject，是为了跟其他的 JavaScript对象如 null，数组，宿主对象（documents）等作区分，因为这些用 typeof 都会返回object。

- jQuery提供了 isPlainObject 方法进行判断，先让我们看看使用的效果：

  ```js
  function Person(name) {
    this.name = name;
  }
  
  console.log($.isPlainObject({})) // true
  
  console.log($.isPlainObject(new Object)) // true
  
  console.log($.isPlainObject(Object.create(null))); // true
  
  console.log($.isPlainObject(Object.assign({a: 1}, {b: 2}))); // true
  
  console.log($.isPlainObject(new Person('yayu'))); // false
  
  console.log($.isPlainObject(Object.create({}))); // false
  ```

- 由此我们可以看到，除了 {} 和 new Object 创建的之外，jQuery 认为一个**没有原型的对象**也是一个纯粹的对象。

- isPlainObject 的实现也在变化，我们今天讲的是 3.0 版本下的 isPlainObject，我们直接看源码：

  ```js
  // 上节中写 type 函数时，用来存放 toString 映射结果的对象
  var class2type = {};
  
  // 相当于 Object.prototype.toString
  var toString = class2type.toString;
  
  // 相当于 Object.prototype.hasOwnProperty
  var hasOwn = class2type.hasOwnProperty;
  
  function isPlainObject(obj) {
    var proto, Ctor;
  
    // 排除掉明显不是obj的以及一些宿主对象如Window
    if (!obj || toString.call(obj) !== "[object Object]") {
      return false;
    }
  
    proto = Object.getPrototypeOf(obj);
  
    // 没有原型的对象是纯粹的，Object.create(null) 就在这里返回 true
    if (!proto) {
      return true;
    }
  
    /**
     * 以下判断通过 new Object 方式创建的对象
     * 判断 proto 是否有 constructor 属性，如果有就让 Ctor 的值为 proto.constructor
     * 如果是 Object 函数创建的对象，Ctor 在这里就等于 Object 构造函数
     */
    Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
  
    // 在这里判断 Ctor 构造函数是不是 Object 构造函数，用于区分自定义构造函数和 Object 构造函数
    return typeof Ctor === "function" && hasOwn.toString.call(Ctor) === hasOwn.toString.call(Object);
  }
  ```

- 注意：我们判断 Ctor 构造函数是不是 Object 构造函数，用的是` hasOwn.toString.call(Ctor)`，这个方法可不是 `Object.prototype.toString`，不信我们在函数里加上下面这两句话：

  ```js
  console.log(hasOwn.toString.call(Ctor)); // function Object() { [native code] }
  console.log(Object.prototype.toString.call(Ctor)); // [object Function]
  ```

- 发现返回的值并不一样，这是因为 `hasOwn.toString` 调用的其实是` Function.prototype.toString`，毕竟 `hasOwnProperty `可是一个函数！

- 而且 Function 对象覆盖了从 Object 继承来的 Object.prototype.toString 方法。函数的 toString 方法会返回一个表示函数源代码的字符串。具体来说，包括 function关键字，形参列表，大括号，以及函数体中的内容。

- **因此**：这里要判断的其实是两个函数是否一样

### isEmptyObject 

- 用`for...in`遍历

  ```js
  for (var i in obj) { // 如果不为空，则会执行到这一步，返回true
      return false
  }
  return true // 如果为空,返回false
  ```

- 其实所谓的` isEmptyObject `就是判断是否有属性，for 循环一旦执行，就说明有属性，有属性就会返回 false。

- 但是根据这个源码我们可以看出isEmptyObject实际上判断的并不仅仅是空对象。

  ```js
  console.log(isEmptyObject({})); // true
  console.log(isEmptyObject([])); // true
  console.log(isEmptyObject(null)); // true
  console.log(isEmptyObject(undefined)); // true
  console.log(isEmptyObject(1)); // true
  console.log(isEmptyObject('')); // true
  console.log(isEmptyObject(true)); // true
  ```

- 但是既然 jQuery 是这样写，可能是因为考虑到实际开发中 isEmptyObject 用来判断 {} 和 {a: 1} 是足够的吧。如果真的是只判断 {}，完全可以结合上篇写的 type 函数筛选掉不适合的情况。

- 通过 `JSON` 自带的 `stringify()` 方法来判断

  ```js
  if (JSON.stringify(data) === '{}') {
      return true // 如果为空,返回false
  }
  return false // 如果不为空，返回true
  ```

- 依靠`Object.keys()`

  ```js
  if (Object.keys(object).length === 0) {
      return true // 如果为空,返回false
  }
  return false // 如果不为空，则会执行到这一步，返回true
  ```

### isWondow

- Window 对象作为客户端 JavaScript 的全局对象，它有一个 window 属性指向自身，这点在[《JavaScript深入之变量对象》](https://github.com/mqyqingfeng/Blog/issues/5)中讲到过。我们可以利用这个特性判断是否是 Window 对象。

  ```js
  function isWindow( obj ) {
      return obj != null && obj === obj.window;
  }
  ```

### isElement

- isElement 判断是不是 DOM 元素。

  ```js
  isElement = function(obj) {
      return !!(obj && obj.nodeType === 1);
  };
  ```

## 克隆 @@@

### 数组的浅拷贝

#### slice() concat()

- 可以利用数组的一些方法比如：slice、concat 返回一个新数组的特性来实现拷贝。

  ```js
  var arr = ['old', 1, true, null, undefined];
  
  var new_arr = arr.concat();
  var new_arr = arr.slice();
  ```

#### 扩展运算符

- ```js
  var arr = ['old', 1, true, null, undefined];
  var new_arr = [...arr]
  ```

#### Array.from()

- 如果参数是一个真正的数组，`Array.from`会返回一个一模一样的新数组，浅克隆

  ```js
  var arr = ['old', 1, true, null, undefined];
  var new_arr = Array.from(arr)
  ```

#### 对比

- 扩展运算符背后调用的是遍历器接口（`Symbol.iterator`），如果一个对象没有部署这个接口，就无法转换。

- `Array.from`方法还支持类似数组的对象。所谓类似数组的对象，本质特征只有一点，即必须有`length`属性。因此，任何有`length`属性的对象，都可以通过`Array.from`方法转为数组，而此时扩展运算符就无法转换。

  ```js
  Array.from({ length: 3 });
  // [ undefined, undefined, undefined ]
  ```

### JSON实现深拷贝

- ```js
  var arr = ['old', 1, true, ['old1', 'old2'], {old: 1}]
  
  var new_arr = JSON.parse( JSON.stringify(arr) );
  
  console.log(new_arr);
  ```

- 有一个问题，不能拷贝函数，我们做个试验：

  ```js
  var arr = [function(){console.log(a)}, {b: function(){console.log(b)}}]
  
  var new_arr = JSON.parse(JSON.stringify(arr));
  
  console.log(new_arr);
  ```

- 我们会发现 new_arr 变成了：

  ![ä¸è½æ·è´å½æ°](https://github.com/mqyqingfeng/Blog/raw/master/Images/copy/copy1.png)

### 浅拷贝的实现

- ```js
  const shallowCopy = function(obj) {
    // 只拷贝对象
    if (typeof obj !== 'object') return;
    // 根据obj的类型判断是新建一个数组还是对象
    const newObj = obj instanceof Array ? [] : {};
    // 遍历obj，并且判断是obj的属性才拷贝
    // for (var key in obj) {
    //   if (obj.hasOwnProperty(key)) newObj[key] = obj[key]
    // }
    for (const [key,value] of Object.entries(obj)) {
      newObj[key] = value
    }
    return newObj;
  }
  ```

### 深拷贝的实现

- 那如何实现一个深拷贝呢？说起来也好简单，我们在拷贝的时候判断一下属性值的类型，如果是对象，我们递归调用深拷贝函数不就好了~

  ```js
  const deepCopy = function(obj) {
    if (typeof obj !== 'object') return;
    const newObj = obj instanceof Array ? [] : {};
    for (const [key,value] of Object.entries(obj)) {
      newObj[key] = typeof value === 'object' ? deepCopy(value) : value
    }
    return newObj;
  }
  ```

- 注意`null`，可以通过第一层判断，但是Object.entries()无法接受`null`作为参数

  ```js
  console.log(deepCopy(null))
  // TypeError: Cannot convert undefined or null to object at Function.entries (<anonymous>)
  ```

- 如果使用ES5 API 则会赋值为一个空对象

## jQuery.extend()

### 基本用法

- jQuery 的 extend 是 jQuery 中应用非常多的一个函数，今天我们一边看 jQuery 的 extend 的特性，一边实现一个 extend!

- 先来看看 extend 的功能，合并两个或者更多的对象的内容到第一个对象中。

  ```js
  jQuery.extend( target [, object1 ] [, objectN ] )
  ```

- 第一个参数 target，表示要拓展的目标，我们就称它为目标对象吧。

- 后面的参数，都传入对象，内容都会复制到目标对象中，我们就称它们为待复制对象吧。

- 当两个对象出现相同字段的时候，后者会覆盖前者，**不会进行深层次的覆盖**。

  ```js
  var obj1 = {
    a: 1,
    b: { b1: 1, b2: 2 }
  };
  
  var obj2 = {
    b: { b1: 3, b3: 4 },
    c: 3
  };
  
  var obj3 = {
    d: 4
  }
  
  console.log($.extend(obj1, obj2, obj3));
  
  // {
  //    a: 1,
  //    b: { b1: 3, b3: 4 },
  //    c: 3,
  //    d: 4
  // }
  ```

### extend 第一版

- ```js
  function extend(target, ...options) {
    const len = options.length;
    for (let i = 0; i < len; i++) {
      option = options[i]
      if (option != null) {
        for (let [key, value] of Object.entries(option)) {
          if (value !== undefined) {
            target[key] = value;
          }
        }
      }
      return target
    }
  }
  ```

### extend 深拷贝

- 那如何进行深层次的复制呢？jQuery v1.1.4 加入了一个新的用法：

  ```
  jQuery.extend( [deep], target, object1 [, objectN ] )
  ```

- 也就是说，函数的第一个参数可以传一个布尔值，如果为 true，我们就会进行深拷贝，false 依然当做浅拷贝，这个时候，target 就往后移动到第二个参数。

  ```js
  var obj1 = {
    a: 1,
    b: { b1: 1, b2: 2 }
  };
  
  var obj2 = {
    b: { b1: 3, b3: 4 },
    c: 3
  };
  
  var obj3 = {
    d: 4
  }
  
  console.log($.extend(true, obj1, obj2, obj3));
  
  // {
  //    a: 1,
  //    b: { b1: 3, b2: 2, b3: 4 },
  //    c: 3,
  //    d: 4
  // }
  ```

- 因为采用了深拷贝，会遍历到更深的层次进行添加和覆盖。

### extend 第二版

- 我们来实现深拷贝的功能，值得注意的是：根据 copy 的类型递归 extend。

  ```js
  function deepExtend(target,...options) {
    var len = options.length;
    // 循环遍历要复制的对象们
  for (let i = 0; i < len; i++) {
      option = options[i];
      // 要求不能为空 避免 deepExtend(a,,b) 这种情况
      if (option != null) {
        for (let [key,value] of Object.entries(option)) {
          if (value && typeof value == 'object') {
            // 是对象，进行递归调用
            target[key] = deepExtend(target[key], value)
          }
          else if (value !== undefined){
            // 不是对象，直接赋值
            target[key] = value
          }
        }
      }
    }
    return target;
  };
  ```

- 在实现上，核心的部分还是跟上篇实现的深浅拷贝函数一致，如果要复制的对象的属性值是一个对象，就递归调用 extend。

### Object.assign

- `Object.assign`方法实行的是浅拷贝，而不是深拷贝。也就是说，如果源对象某个属性的值是对象，那么目标对象拷贝得到的是这个对象的引用。

- 该方法的引入目的，主要是为了解决`Object.assign()`无法正确拷贝`get`属性和`set`属性的问题。

  - 上面代码中，`source`对象的`foo`属性的值是一个赋值函数，`Object.assign`方法将这个属性拷贝给`target1`对象，结果该属性的值变成了`undefined`。这是因为`Object.assign`方法总是拷贝一个属性的值，而不会拷贝它背后的赋值方法或取值方法。
  - 这时，`Object.getOwnPropertyDescriptors()`方法配合`Object.defineProperties()`方法，就可以实现正确拷贝。

  ```js
  const source = {
    set foo(value) {
      console.log(value);
    }
  };
  
  const target2 = {};
  Object.defineProperties(target2, Object.getOwnPropertyDescriptors(source));
  Object.getOwnPropertyDescriptor(target2, 'foo')
  // { get: undefined,
  //   set: [Function: set foo],
  //   enumerable: true,
  //   configurable: true }
  
  // 合并两个函数
  const shallowMerge = (target, source) => Object.defineProperties(
    target,
    Object.getOwnPropertyDescrptors(source)
  );
  ```

### 优化

#### target 是函数

- 在我们的实现中，`typeof target` 必须等于 `object`，我们才会在这个 `target` 基础上进行拓展，然而我们用 `typeof` 判断一个函数时，会返回`function`，也就是说，我们无法在一个函数上进行拓展！
- 当然啦，毕竟函数也是一种对象嘛。
- 函数的静态属性也是非常重要的

#### 类型不一致

- 其实我们实现的方法有个小 bug ，不信我们写个 demo:

  ```js
  var obj1 = {
    a: 1,
    b: {
      c: 2
    }
  }
  
  var obj2 = {
    b: {
      c: [5],
  
    }
  }
  
  var d = extend(true, obj1, obj2)
  console.log(d);
  ```

- 我们预期会返回这样一个对象：

  ```js
  {
    a: 1,
    b: {
      c: [5]
    }
  }
  ```

- 实际返回了

  ```js
  {
    a: 1,
    b: {
      c: {
        0: 5
      }
    }
  }
  ```

- 第三遍进行最终的赋值，因为 src 是一个基本类型，我们默认使用一个空对象作为目标值，所以最终的结果就变成了对象的属性！

- 为了解决这个问题，我们需要对目标属性值和待复制对象的属性值进行判断。

- 判断目标属性值跟要复制的对象的属性值类型是否一致:

  - 如果待复制对象属性值类型为数组，目标属性值类型不为数组的话，目标属性值就设为 []
  - 如果待复制对象属性值类型为对象，目标属性值类型不为对象的话，目标属性值就设为 {}

  ```js
  for (let [key,value] of Object.entries(option)) {
    // 排除null和undefined
    if (value && typeof value == 'object') {
      if(Array.isArray(value)){
        // 如果值是数组，保证target也是数组
        target[key] = Array.isArray(target[key])?target[key]:[]
      }
      // 进行递归调用
      target[key] = deepExtend(target[key], value)
    }
    else if (value !== undefined){
      // 不是对象，直接赋值
      target[key] = value
    }
  }
  ```

### 循环引用

- 实际上，我们还可能遇到一个循环引用的问题，举个例子：

  ```js
  var a = {name : null}
  var b = {name : null}
  a.name = b
  b.name = a
  console.log(deepExtend(a, b))
  ```

- 我们会得到一个可以无限展开的对象，类似于这样：

  ![å¾ªç¯å¼ç¨å¯¹è±¡](https://github.com/mqyqingfeng/Blog/raw/master/Images/extend/extend1.png)

- 为了避免这个问题，我们需要判断要复制的对象属性是否等于 target，如果等于，我们就跳过：

  ```js
  // 对象可能存在循环引用，此时应该跳过
  if (target === value) {
    continue;
  }
  ```

### 最终代码

- ```js
  function deepExtend(target,...options) {
    var len = options.length;
    // 如果target不是对象，我们是无法进行复制的，所以设为{}
    if (typeof target !== 'object') {
      target = {}
    }
    // 循环遍历要复制的对象们
    for (let i = 0; i < len; i++) {
      option = options[i];
      // 要求不能为空 避免 deepExtend(a,,b) 这种情况
      if (option != null) {
        for (let [key,value] of Object.entries(option)) {
          // 排除null和undefined
          if (value && typeof value == 'object') {
            // 对象可能存在循环引用，此时应该跳过
            if(target === value) continue
  
            // 如果值是数组，保证target也是数组
            if(Array.isArray(value)) target[key] = Array.isArray(target[key])?target[key]:[]
  
            // 进行递归调用
            target[key] = deepExtend(target[key], value)
          }else if (value !== undefined){
            // 不是对象，直接赋值
            target[key] = value
          }
        }
      }
    }
    return target;
  };
  ```

### 思考题

- 如果觉得看明白了上面的代码，想想下面两个 demo 的结果：

  ```js
  var a = extend(true, [4, 5, 6, 7, 8, 9], [1, 2, 3]);
  console.log(a) // ??? 
  ```

  ![1563081418013](F:\OneDrive\JS\assets\1563081418013.png)

- ```js
  var obj1 = {
    value: {
      3: 1
    }
  }
  var obj2 = {
    value: [5, 6, 7],
  }
  
  var b = extend(true, obj1, obj2) // ??? {value:[5,6,7]}
  var c = extend(true, obj2, obj1) // ??? {value:[5,6,7,1]}
  ```

## 结构化克隆算法

- 结构化克隆算法是[由HTML5规范定义](http://www.w3.org/html/wg/drafts/html/master/infrastructure.html#safe-passing-of-structured-data)的用于复制复杂JavaScript对象的算法。通过来自 [Workers](https://developer.mozilla.org/en-US/docs/Web/API/Worker)的 `postMessage() `或使用 [IndexedDB](https://developer.mozilla.org/en-US/docs/Glossary/IndexedDB) 存储对象时在内部使用。它通过递归输入对象来构建克隆，同时保持先前访问过的引用的映射，以避免无限遍历循环。
- 目前支持的类型有：
  - 除 symbols 之外的所有原始类型
  - Boolean 对象
  - String 对象
  - Date
  - RegExp （lastIndex 字段不会被保留。）
  - Blob
  - File
  - FileList
  - ArrayBuffer
  - ArrayBufferView
  - ImageData
  - Array
  - Object
  - Map
  - Set
- 不支持：
  - 原型链
  - Error 对象
  - Function
  - DOM

### 结构化克隆所不能做到的

- `Error` 以及 `Function` 对象是不能被结构化克隆算法复制的；如果你尝试这样子去做，这会导致抛出 `DATA_CLONE_ERR` 的异常。
- 企图去克隆 DOM 节点同样会抛出 `DATA_CLONE_ERROR` 异常。
- 对象的某些特定参数也不会被保留
  - `RegExp `对象的 `lastIndex` 字段不会被保留
  - 属性描述符，setters 以及 getters（以及其他类似元数据的功能）同样不会被复制。例如，如果一个对象用属性描述符标记为 read-only，它将会被复制为 read-write，因为这是默认的情况下。
  - 原形链上的属性也不会被追踪以及复制。
  - symbol上的属性也不会赋值

### 浏览器实现

- 用浏览器自身的API来实现深度拷贝，有MessageChannel、history api 、Notification api等
- <http://caibaojian.com/deep-copy.html>

## lodash _.baseClone()

- 结构化克隆的实现
