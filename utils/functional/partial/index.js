// 第一版
// 似曾相识的代码
export default function partial(fn) {
  var args = [].slice.call(arguments, 1);
  return function() {
      var newArgs = args.concat([].slice.call(arguments));
      return fn.apply(this, newArgs);
  };
};
// 因为涉及到调用时的this，所以不可以使用箭头函数
// function partial(fn,...rest) {
// return function(...inRest) {
//     return fn.apply(this, rest.concat(inRest));
// };
// };

