import React from 'react';
import ReactDOM from 'react-dom'
import store from './redux/store'

import Frame from './layouts/Frame.jsx'

import './static/reset.css'
import './lib/design/index.less'


// 定义渲染根组件标签的函数
const render = () => {
  ReactDOM.render(
    <Frame store={store}/>,
    document.getElementById('root')
  )
}
// 初始化渲染
render()

// 注册(订阅)监听, 一旦状态发生改变, 自动重新渲染
store.subscribe(render)
