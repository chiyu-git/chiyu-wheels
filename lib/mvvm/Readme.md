## Vue数据双向绑定原理 @@@

**参考**：<https://github.com/DMQ/mvvm>

- vue数据双向绑定是通过**数据劫持结合观察者模式**来实现的，那么vue是如何进行数据劫持的，我们可以先来看一下通过控制台输出一个定义在vue初始化数据上的对象是个什么东西。

  ```vue
  var vm = new Vue({
      data: {
          obj: {
              a: 1
          }
      },
      created: function () {
          console.log(this.obj);
      }
  });
  ```

- 我们可以看到属性a有两个相对应的get和set方法，为什么会多出这两个方法呢？因为vue是通过Object.defineProperty()来实现数据劫持的。

### **思路分析**

- 实现mvvm主要包含两个方面，数据变化更新视图，视图变化更新数据

- 关键点在于data如何更新view。

  > 因为view更新data其实可以通过事件监听即可，比如input标签监听 'input' 事件就可以实现了。所以我们着重来分析下，当数据改变，如何更新视图的。

- 数据更新视图的重点是**如何知道数据变了**，只要知道数据变了，那么接下去的事都好处理。如何知道数据变了，其实上文我们已经给出答案了，就是通过Object.defineProperty( )对属性设置一个set函数，当数据改变了就会来触发这个函数，所以我们只要将一些需要更新的方法放在这里面就可以实现data更新view了


### **实现过程**

1. 实现一个数据监听器Observer：
   - 能够对数据对象的所有属性进行监听
   - 如有变动可拿到最新值并通知（notify）订阅者执行 updater
2. 实现一个指令解析器Compile，对每个元素节点的指令进行扫描和解析，根据指令模板替换数据，以及绑定相应的更新函数
3. 实现一个Watcher，作为连接Observer和Compile的桥梁：
   - 能够订阅并收到每个属性变动的通知（来自Observer）
   - 执行指令绑定的相应回调函数，从而更新视图 （updater）
4. 实现一个消息订阅器，用来搜集Watcher
5. mvvm入口函数，整合以上三者



### 实现Observer

- ok, 思路已经整理完毕，也已经比较明确相关逻辑和模块功能了，let's do it

- 我们知道可以利用`Obeject.defineProperty()`来监听属性变动

- 那么将需要observe的数据对象进行递归遍历，包括子属性对象的属性，都加上 `setter`和`getter`
  这样的话，给这个对象的某个值赋值，就会触发`setter`，那么就能监听到了数据变化。

- Observer.js：

  ```js
  const data = { name: 'kindeng' }
  Observe(data)
  data.name = 'dmq' // 哈哈哈，监听到值变化了 kindeng --> dmq
  
  function Observe(data) {
    if (!data || typeof data !== 'object') return
  
    // 取出所有属性遍历
    Object.keys(data).forEach(function (key) {
      defineReactive(data, key, data[key]);
    })
  }
  
  function defineReactive(data, key, val) {
    Observe(val); // 监听子属性
    Object.defineProperty(data, key, {
      enumerable: true, // 可枚举
      configurable: false, // 不能再define
      get: function () {
        return val
      },
      set: function (newVal) {
        console.log('哈哈哈，监听到值变化了 ', val, ' --> ', newVal)
        val = newVal
      }
    })
  }
  ```

- 这样我们已经可以监听每个数据的变化了，那么监听到变化之后就是怎么通知订阅者了，所以接下来我们需要实现一个消息**订阅器，维护一个数组，用来收集订阅者**，数据变动触发notify，再调用订阅者的update方法，代码改善之后是这样：

  ```js
  // ... 省略
  function defineReactive(data, key, val) {
    var dep = new Dep();
    observe(val); // 监听子属性
  
    Object.defineProperty(data, key, {
      // ... 省略
      set: function(newVal) {
        if (val === newVal) return
        console.log('哈哈哈，监听到值变化了 ', val, ' --> ', newVal)
        val = newVal
        dep.notify() // 通知所有订阅者
      }
    });
  }
  
  function Dep() {
    // this.watchers = []
    this.subs = [];
  }
  function Dep() {
    // this.watchers = []
    this.subs = []
  }
  Dep.prototype = {
    addSub: function (sub) {
      this.subs.push(sub)
    },
    notify: function () {
      this.subs.forEach(function (sub) {
        sub.update()
      })
    }
  }
  ```

- 那么问题来了，谁是订阅者？怎么往订阅器添加订阅者？

- 没错，上面的思路整理中我们已经明确订阅者应该是Watcher, 而且`var dep = new Dep();`是在 `defineReactive`方法内部定义的，所以想通过`dep`添加订阅者，就必须要在闭包内操作，所以我们可以在 `getter`里面动手脚：

  ```js
  // Observer.js
  // ...省略
  Object.defineProperty(data, key, {
    get: function() {
      // 由于需要在闭包内添加watcher，所以通过Dep定义一个静态target属性，暂存watcher, 添加完移除
      Dep.target && dep.addSub(Dep.target)
      return val
    }
    set: function(newVal) {
    	if (val === newVal) return
    	console.log('哈哈哈，监听到值变化了 ', val, ' --> ', newVal)
    	val = newVal
    	dep.notify(); // 通知所有订阅者
  	}
  })
  
  // Watcher.js，提前给出关键部分，便于串联、理解
  Watcher.prototype = {
    get: function() {
      Dep.target = this    // 这里的this是某一个watcher
      var value = this.vm[this.exp]   // 触发getter，添加自己到exp对应的属性订阅器中
      Dep.target = null    // 添加完毕，重置
      return value
    }
  }
  
  ```

- 这里已经实现了一个Observer了，已经具备了监听数据和数据变化通知订阅者的功能，[完整代码](https://github.com/DMQ/mvvm/blob/master/js/observer.js)。那么接下来就是实现Compile了

### 实现Compile

- compile主要做的事情是：解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图，如图所示：


- 因为遍历解析的过程有多次操作dom节点，为提高性能和效率，会先将跟节点`el`转换成文档碎片`fragment`进行解析编译操作，解析完成，再将`fragment`添加回原来的真实dom节点中

  ```js
  function Compile(el,vm) {
    this.$vm = vm
    this.$el = this.isElementNode(el) ? el : document.querySelector(el)
    if (this.$el) {
      this.$fragment = this.node2Fragment(this.$el)
      this.init()
      this.$el.appendChild(this.$fragment)
    }
  }
  Compile.prototype = {
    init: function() { this.compileElement(this.$fragment); },
    node2Fragment: function(el) {
      var fragment = document.createDocumentFragment(), child
      // 将原生节点拷贝到fragment
      while (child = el.firstChild) {
        fragment.appendChild(child)
      }
      return fragment
    }
  }
  ```

- compileElement方法将遍历所有节点及其子节点，进行扫描解析编译，调用对应的指令渲染函数进行数据渲染，并调用对应的指令更新函数进行绑定，详看代码及注释说明：

  ```js
  Compile.prototype = {
    // ... 省略
    // 对不同类型的节点，调用不同的函数进行解析
    compileElement: function(el) {
      const childNodes = el.childNodes, self = this
      ;[].slice.call(childNodes).forEach(function(childNode) {
        const text = childNode.textContent
        const reg = /\{\{(.*)\}\}/    // 花括号表达式文本
        // 按元素节点方式编译
        if (self.isElementNode(childNode)) {
          self.compileNode(childNode)
        } else if (self.isTextNode(childNode) && reg.test(text)) {
          self.compileText(childNode, RegExp.$1)
        }
        // 遍历编译子节点
        if (childNode.childNodes && childNode.childNodes.length) {
          self.compileElement(childNode)
        }
      })
    },
    // 解析元素节点
    compileNode: function(node) {
      const nodeAttrs = node.attributes, self = this
      ;[].slice.call(nodeAttrs).forEach(function(attr) {
        // 规定：指令以 v-xxx 命名
        // 如 <span v-text="content"></span> 中指令为 v-text
        const attrName = attr.name;    // v-text
        if (self.isDirective(attrName)) {
          const exp = attr.value; // content
          const dir = attrName.substring(2)    // text
          if (self.isEventDirective(dir)) {
            // 事件指令, 如 v-on:click
            compileUtil.eventHandler(node, self.$vm, exp, dir)
          } else {
            // 普通指令
            compileUtil[dir] && compileUtil[dir](node, self.$vm, exp)
          }
        }
      })
    }
  };
  
  // 指令处理集合 updaters
  const compileUtil = {
    text: function(node, vm, exp) {
      this.bind(node, vm, exp, 'text')
    },
    // ...省略
    bind: function(node, vm, exp, dir) {
      const updater = updaters[dir + 'Updater']
      // 第一次初始化视图
      updater && updater(node, vm[exp])
      // 实例化订阅者，此操作会在对应的属性消息订阅器中添加了该订阅者watcher
      new Watcher(vm, exp, function(value, oldValue) {
        // 一旦属性值有变化，会收到通知执行此更新函数，更新视图
        updater && updater(node, value, oldValue)
      })
    },
    // 事件处理
    eventHandler: function (node, vm, exp, dir) {
      const eventType = dir.split(':')[1],
        fn = vm.$options.methods && vm.$options.methods[exp];
  
      if (eventType && fn) {
        node.addEventListener(eventType, fn.bind(vm), false);
      }
    }
  }
  
  // 更新函数
  const updater = {
    textUpdater: function(node, value) {
      node.textContent = typeof value == 'undefined' ? '' : value
    }
    // ...省略
  }
  ```

- 这里通过递归遍历保证了每个节点及子节点都会解析编译到，包括了{{}}表达式声明的文本节点。指令的声明规定是通过特定前缀的节点属性来标记，如`<span v-text="content" other-attr`中`v-text`便是指令，而`other-attr`不是指令，只是普通的属性。

- 监听数据、绑定更新函数的处理是在`compileUtil.bind()`这个方法中，通过`new Watcher()`添加回调来接收数据变化的通知

- 至此，一个简单的Compile就完成了。接下来要看看Watcher这个订阅者的具体实现了

- Compile.prototype的一些辅助函数

  ```js
    // 解析文本节点
    compileText: function (node, exp) {
      compileUtil.text(node, this.$vm, exp);
    },
    // 判断 辅助 函数
    isDirective: function (attr) {
      return attr.indexOf('v-') == 0;
    },
  
    isEventDirective: function (dir) {
      return dir.indexOf('on') === 0;
    },
    isElementNode: function (node) {
      return node.nodeType == 1;
    },
  
    isTextNode: function (node) {
      return node.nodeType == 3;
    }
  ```

### 实现Watcher

- Watcher订阅者作为Observer和Compile之间通信的桥梁，主要做的事情是:

  1. 在自身实例化时往属性订阅器(dep)里面添加自己
  2. 自身必须有一个update()方法
  3. 待属性变动dep.notice()通知时，能调用自身的update()方法，并触发Compile中绑定的回调，则功成身退。

- 如果有点乱，可以回顾下前面的思路整理

  ```js
  function Watcher(vm, exp, cb) {
    this.cb = cb // updater的包装函数
    this.vm = vm
    this.exp = exp // 对应的model键名
    // 此处为了触发属性的getter，从而在dep添加自己，结合Observer更易理解
    this.value = this.wtach() 
  }
  Watcher.prototype = {
    update: function() {
      this.run()    // 属性值变化收到通知
    },
    run: function() {
      var value = this.vm[this.exp] // 取到最新值
      var oldVal = this.value
      if (value !== oldVal) {
        this.value = value;
        this.cb.call(this.vm, value, oldVal) // 执行Compile中绑定的回调，更新视图
      }
    },
    watch: function() {
      Dep.target = this    // 将当前订阅者指向自己
      var value = this.vm[this.exp]    // 触发相应变量的getter，添加自己到属性订阅器中
      Dep.target = null    // 添加完毕，重置
      return value
    }
  }
  // 这里再次列出Observer和Dep，方便理解
  Object.defineProperty(data, key, {
    get: function() {
      // 由于需要在闭包内添加watcher，所以可以在Dep定义一个全局target属性，暂存watcher, 添加完移除
      Dep.target && dep.addDep(Dep.target);
      return val;
    }
    // ... 省略
  });
  Dep.prototype = {
    notify: function() {
      this.subs.forEach(function(sub) {
        sub.update(); // 调用订阅者的update方法，通知变化
      });
    }
  };
  ```

- 实例化`Watcher`的时候，调用`get()`方法，通过`Dep.target = watcherInstance`标记订阅者是当前watcher实例，强行触发属性定义的`getter`方法，`getter`方法执行的时候，就会在属性的订阅器`dep`添加当前watcher实例，从而在属性值有变化的时候，watcherInstance就能收到更新通知。

- ok, Watcher也已经实现了。

- 基本上vue中数据绑定相关比较核心的几个模块也是这几个，猛戳[这里](https://github.com/vuejs/vue) , 在`src` 目录可找到vue源码。

- 最后来讲讲MVVM入口文件的相关逻辑和实现吧，相对就比较简单了~

### 实现MVVM

- MVVM作为数据绑定的入口，整合Observer、Compile和Watcher三者，通过Observer来监听自己的model数据变化，通过Compile来解析编译模板指令，最终利用Watcher搭起Observer和Compile之间的通信桥梁，达到数据变化 -> 视图更新；视图交互变化(input) -> 数据model变更的双向绑定效果。

- 一个简单的MVVM构造器是这样子：

  ```js
  function MVVM(options) {
    this.$options = options;
    var data = this._data = this.$options.data;
    observe(data, this) // ??? 传个this干嘛
    this.$compile = new Compile(options.el || document.body, this)
  }
  ```

- 但是这里有个问题，从代码中可看出监听的数据对象是options.data，每次需要更新视图，则必须通过`var vm = new MVVM({data:{name: 'kindeng'}}); vm._data.name = 'dmq'; `这样的方式来改变数据。

- 显然不符合我们一开始的期望，我们所期望的调用方式应该是这样的： `var vm = new MVVM({data: {name: 'kindeng'}}); vm.name = 'dmq';`

- 所以这里需要给MVVM实例添加一个属性代理的方法，使访问vm的属性代理为访问vm._data的属性，改造后的代码如下：

  ```js
  function MVVM(options) {
    this.$options = options
    const data = this._data = this.$options.data, vm = this
    // 属性代理，实现 vm.xxx -> vm._data.xxx
    Object.keys(data).forEach(function (key) {
      vm._proxy(key)
    })
    Observe(data, this)
    this.$compile = new Compile(options.el || document.body, this)
  }
  
  MVVM.prototype = {
    _proxy: function (key) {
      const vm = this
      // key由真正的data传递，做到一一对应
      Object.defineProperty(vm, key, {
        configurable: false,
        enumerable: true,
        get: function proxyGetter() {
          return vm._data[key]
        },
        set: function proxySetter(newVal) {
          vm._data[key] = newVal
        }
      })
    }
  }
  ```

- 这里主要还是利用了`Object.defineProperty()`这个方法来劫持了vm实例对象的属性的读写权，使读写vm实例的属性转成读写了`vm._data`的属性值，达到鱼目混珠的效果，哈哈

### 实现双向绑定

- 到此为止，已经实现了从model到view的映射，主要的体现是
  - 花括号语法
  - method绑定
- 接下来我们需要实现表单的双向绑定，指令是`v-model`

#### model关联表单，单向绑定

- 和text命令类似，我们可以继续使用bind方法绑定，只需要增加相应的model命令以及model的更新函数即可

- Compile.js

  ```js
  const compileUtil = {
    text: function (node, vm, exp) {
      this.bind(node, vm, exp, 'text')
    },
    model: function (node, vm, exp) {
      this.bind(node, vm, exp, 'model')
      // 实现双向绑定...暂时省略  
    },
    bind: function (node, vm, exp, dir) {
      const updater = updaters[dir + 'Updater']
      // 第一次初始化视图
      updater && updater(node, vm[exp])
      // 实例化订阅者，此操作会在对应的属性消息订阅器中添加了该订阅者watcher
      console.log(exp)
      new Watcher(vm, exp, function (value, oldValue) {
        // 一旦属性值有变化，会收到通知执行此更新函数，更新视图
        updater && updater(node, value, oldValue)
      })
    }
    // ...
  }
  ```

- 增加相应的updater，Complie.js

  ```js
  // 更新函数
  const updaters = {
    textUpdater: function (node, value) {
      node.textContent = typeof value == 'undefined' ? '' : value
    },
    modelUpdater: function (node, value, oldValue) {
      node.value = typeof value == 'undefined' ? '' : value;
    }
    // ...省略其他updater
  }
  ```

#### 双向绑定

- 双向绑定=单向绑定+UI事件监听，因此我们只需要给node添加事件来改变vm相应字段即可

- 我们在运行model指令的同时执行绑定

- Complie.js

  ```js
  // compileUtil['model'](node,selft.$vm,exp)
  const compileUtil = {
    text: function (node, vm, exp) {
      this.bind(node, vm, exp, 'text')
    },
    model: function (node, vm, exp) {
      this.bind(node, vm, exp, 'model')
      // 实现双向绑定
      const self = this // 即是compileUtil对象
      let val = this._getVMVal(vm, exp)
      node.addEventListener('input', function (e) {
        const newValue = e.target.value
        if (val === newValue) return
  			// 修改vm
        self._setVMVal(vm, exp, newValue)
      })
    },
    _getVMVal: function (vm, exp) {
      let val = vm
      // exp: word.test.test
      exp = exp.split('.')
      // 迭代查询 vm[word][test][test]
      exp.forEach((key)=> val = val[key])
      return val
    },
    _setVMVal: function (vm, exp, value) {
      let val = vm
      // exp: word.test.test
      exp = exp.split('.')
      exp.forEach(function (key, i) {
        // 查询到最后一个key，才更新val的值
        if (i < exp.length - 1) val = val[key]
        else val[key] = value
      })
    }
    // ...
  }
  ```

## 