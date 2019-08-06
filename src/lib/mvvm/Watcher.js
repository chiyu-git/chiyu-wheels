function Watcher(vm, exp, cb) {
  this.cb = cb // updater的包装函数
  this.vm = vm
  this.exp = exp
  // 此处为了触发属性的getter，从而在dep添加自己，结合Observer更易理解
  this.value = this.watch() 
}
Watcher.prototype = {
  update: function() {
    this.run()    // 属性值变化收到通知
  },
  run: function() {
    var value = this.vm[this.exp]  // 取到最新值
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