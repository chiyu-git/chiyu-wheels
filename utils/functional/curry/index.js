export default function curry(fn,args=[]) {
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

// 使用三目运算符，并且维护this
// function curry(fn, args = []) {
//   return fn.length === args.length
//     ? fn.apply(this, args)
//     : function (...rest) {
//     	// 当参数满了也会再次调用，然后执行fn
//       return curry.call(this, fn, args.concat(rest))
//     }
// }

// 配合箭头函数，配合递归，但是无法维护this
// const curry = (fn, _args = []) => fn.length === _args.length 
//   ? fn(..._args) 
//   : (...rest) => curry(fn, _args.concat(rest));