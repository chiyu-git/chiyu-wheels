function compose() {
  var args = arguments;
  var start = args.length - 1;
  return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
  };
};

function compose(...funcs) {
if (funcs.length === 0) return arg => arg
if (funcs.length === 1) return funcs[0]
return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
// args 是 c(...args)，函数从右向左执行