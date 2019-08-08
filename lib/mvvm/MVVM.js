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