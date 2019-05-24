import React, { Component } from 'react';
import ReactDOM from 'react-dom'

export const UNMOUNTED = 'unmounted'
export const EXITED = 'exited'
export const ENTERING = 'entering'
export const ENTERED = 'entered'
export const EXITING = 'exiting'

class Transition extends Component {
  constructor(props) {
    super(props)
    
    let initialStatus

    // 根据 props 确定初始 status
    if (props.in) {
        initialStatus = ENTERED
    } else {
        initialStatus = EXITED
    }
    this.state = { status: initialStatus }
  }

  componentDidMount(){
    
  }

  componentDidUpdate(prevProps) {
    let nextStatus = null
    // props 发生了改变
    if (prevProps !== this.props) {
      const { status } = this.state
      if (this.props.in) {
        // in 为true
        if (status !== ENTERING && status !== ENTERED) {
          nextStatus = ENTERING
        }
      } else {
        if (status === ENTERING || status === ENTERED) {
          nextStatus = EXITING
        }
      }
      this.updateStatus(nextStatus)
    }
  }

  updateStatus(nextStatus) {
    if (nextStatus !== null) {
      // nextStatus will always be ENTERING or EXITING.
      // 通过给children函数传递第三个参数，来绑定子组件ref
      // 这样需要使用者自己去绑定，不如findDOMNode好使
      const node = ReactDOM.findDOMNode(this)

      if (nextStatus === ENTERING) {
        this.performEnter(node)
      } else {
        this.performExit(node)
      }
    }
  }

  performEnter(node) {
    this.setState({status:ENTERING},() => {
      node.addEventListener('transitionend',() => {
        this.setState({status:ENTERED})
      },{once:true})
    })
  }
  performExit(node) {
    this.setState({status:EXITING},() => {
      node.addEventListener('transitionend',(ev) => {
        this.setState({status:EXITED})
    },{once:true})
    })
  }

  render() {
    const {status} = this.state
    const {children,...childProps} = this.props

    // filter props for Transtition
    delete childProps.in
    delete childProps.mountOnEnter
    delete childProps.unmountOnExit
    delete childProps.appear
    delete childProps.enter
    delete childProps.exit
    delete childProps.timeout
    delete childProps.addEndListener
    delete childProps.onEnter
    delete childProps.onEntering
    delete childProps.onEntered
    delete childProps.onExit
    delete childProps.onExiting
    delete childProps.onExited
    
    return children(status,childProps) || null
  }
}

export default Transition;