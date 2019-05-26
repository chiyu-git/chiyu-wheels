/*
action对象的type常量名称模块
*/
export const INCREMENT = 'increment'
export const DECREMENT = 'decrement'

export const increment = number => ({type: INCREMENT, data:number})
export const decrement = number => ({type: DECREMENT, data:number})