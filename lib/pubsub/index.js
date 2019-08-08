export default class PubSub {
  constructor() {
    this.eventList = {};
  }
  /**
   * @param  {String} event 
   * @param  {Function} handler 
   *
   * @api private
   */
  subscribe(event, handler) {
    if(!this.eventList.hasOwnProperty(event) || this.eventList[event].length===0) {
      this.eventList[event] = [];
    }
    return this.eventList[event].push(handler);
  }
  /**
   * @param  {String} event 
   *
   * @api private
   */
  publish(event,...rest) {
    if(!this.eventList.hasOwnProperty(event)){
      console.log('事件未定义');
      return
    }
    
    this.eventList[event].forEach(handler => handler(...rest));
  }
  /**
   * @param  {String} event 
   * @param  {Function} handler 
   * @api private
   */
  unsubscribe(event,handler){
    const handlers = this.eventList[event]
    if(handlers===undefined) return

    const handlerIndex = handlers.indexOf(handler)
    handlers.splice(handlerIndex,1)
    console.log('成功解除事件绑定');
  }
  once(event,handler){
    const self = this
    function func(...rest){
      handler(rest)
      self.unsubscribe(event,func)
    }
    this.subscribe(event,func)
  }
}