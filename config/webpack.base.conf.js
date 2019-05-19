'use strict'
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // 入口起点
  entry: {
    app: './src/index.js',
  },
  // 输出
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: "[name].js",
    publicPath: '/',
  },
  // 解析,自动为引入的模块添加后缀名
  resolve: {
    extensions: ['.ts', '.tsx', '.js','.jsx', '.json']
  },
  // loader
  module: {
    rules: [
      {
        test: /\.js|jsx$/,
        exclude: /(node_modules|bower_components)/,// 屏蔽不需要处理的文件（文件夹）（可选）
        loader: 'babel-loader'
      },
      {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
  		},
  		{
 			 test: /\.less$/,
  			use: [{
              loader: "style-loader" 
            },{
              loader: "css-loader" 
            },{
              loader: "less-loader"
            }]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: './images/[name].[ext]',
            }
          }
        ]
      },
  	]
	},
  // 插件
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './public/index.html', //指定为create-react-app 的入口
      inject: 'body'
    })
  ]
};