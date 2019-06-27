const Koa = require('koa')
const fs = require('fs')
const path = require('path');
const app = new Koa()
const static = require('koa-static');
var Router = require('koa-router');
var router = new Router();

// 静态资源目录对于相对入口文件index.js的路径
const staticPath = './dist'

/**
 * 用Promise封装异步读取文件方法
 * @param  {string} page html文件名称
 * @return {promise}      
 */
function render( page ) {
  return new Promise(( resolve, reject ) => {
    let viewUrl = `./${page}`
    fs.readFile(viewUrl, "binary", ( err, data ) => {
      if ( err ) {
        reject( err )
      } else {
        resolve( data )
      }
    })
  })
}

/**
 * 根据URL获取HTML内容
 * @param  {string} url koa2上下文的url，ctx.url
 * @return {string}     获取HTML文件内容
 */
async function route( url ) {
  let view = '404.html'
  switch ( url ) {
    case '/':
      view = 'index.html'
      break
    case '/index':
      view = 'index.html'
      break
    case '/dist/stringhtml-lazyload.js':
      view = 'dist/stringhtml-lazyload.js'
      break
  }
  let html = await render( view )
  return html
}

app.use(static(
  path.join( __dirname,  staticPath)
))
app.use( async ( ctx ) => {
  let url = ctx.request.url
  let html = await route( url )
  ctx.body = html
})


app.listen(3333);
console.log('listen: http://localhost:3333/');