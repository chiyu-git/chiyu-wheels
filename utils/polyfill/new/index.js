// 第二版的代码
function objectFactory(Constructor,...args) {
  // var obj = new Object()
  // Object.setPrototypeOf(obj,Constructor.prototype)
  const obj = Object.create(Constructor.prototype)
  var ret = Constructor.apply(obj, arguments);
  // obj 已经经过工厂模式的修改
  return typeof ret === 'object' ? ret : obj;
};