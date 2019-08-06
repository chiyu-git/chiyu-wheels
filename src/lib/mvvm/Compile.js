function Compile(el, vm) {
  this.$vm = vm
  this.$el = this.isElementNode(el) ? el : document.querySelector(el)
  if (this.$el) {
    this.$fragment = this.node2Fragment(this.$el)
    this.init()
    this.$el.appendChild(this.$fragment)
  }
}
Compile.prototype = {
  init: function () { this.compileElement(this.$fragment) },
  node2Fragment: function (el) {
    const fragment = document.createDocumentFragment()
    let child = null
    // 将原生节点拷贝到fragment
    while (child = el.firstChild) {
      fragment.appendChild(child)
    }
    return fragment
  },
  // 对不同类型的节点，调用不同的函数进行解析
  compileElement: function (el) {
    const childNodes = el.childNodes, self = this
      ;[].slice.call(childNodes).forEach(function (childNode) {
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
  compileNode: function (node) {
    const nodeAttrs = node.attributes, self = this
      ;[].slice.call(nodeAttrs).forEach(function (attr) {
        // 规定：指令以 v-xxx 命名
        // 如 <span v-text="content"></span> 中指令为 v-text
        const attrName = attr.name;    // v-text
        if (self.isDirective(attrName)) {
          const exp = attr.value; // 变量名
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
  },
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
}

// 指令处理集合
const compileUtil = {
  text: function (node, vm, exp) {
    this.bind(node, vm, exp, 'text')
  },
  model: function (node, vm, exp) {
    this.bind(node, vm, exp, 'model')
    const self = this
    let val = this._getVMVal(vm, exp)
    node.addEventListener('input', function (e) {
      const newValue = e.target.value
      if (val === newValue) return

      self._setVMVal(vm, exp, newValue)
    })
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
  },
  // 事件处理
  eventHandler: function (node, vm, exp, dir) {
    const eventType = dir.split(':')[1],
          fn = vm.$options.methods && vm.$options.methods[exp]
    if (eventType && fn) {
      node.addEventListener(eventType, fn.bind(vm), false)
    }
  },
  _getVMVal: function (vm, exp) {
    let val = vm
    exp = exp.split('.')
    exp.forEach(function (k) {
      val = val[k]
    })
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
}

// 更新函数
const updaters = {
  textUpdater: function (node, value) {
    node.textContent = typeof value == 'undefined' ? '' : value
  },
  modelUpdater: function (node, value, oldValue) {
    node.value = typeof value == 'undefined' ? '' : value;
  }
  // ...省略
}