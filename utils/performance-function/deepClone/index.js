export default function deepExtend(target,...options) {
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