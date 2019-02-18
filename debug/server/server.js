const path = require('path')
const Koa = require('koa')
const nunjucks = require('koa-nunjucks-2')
const staticServe = require('koa-static')
const bodyParser = require('koa-bodyparser')
const childProcess = require('child_process')

require('app-module-path/register')

const router = require('middlewares/router')
const app = new Koa()
const port = 3000

// 托管一些静态资源
app.use(async (ctx, next) => {
  try {
    await staticServe(path.join(__dirname, './resource'))(ctx, next)
  } catch (e) {
    console.log(e)
    ctx.redirect('/404.html')
  }
})

app.use(bodyParser({
  multipart: true,
  jsonLimit: '3mb',
  textLimit: '3mb',
  formLimit: '3mb',
  onError: (err, ctx) => {
    ctx.log.error(err)
    if (err.status === 413) {
      ctx.log.error(err)
      throw({code: 413, error: '图片不能超过5M'}) // eslint-disable-line
    }
  }
}))

app.use(nunjucks({
  ext: 'html',
  path: path.join(__dirname, '../app/pages'),
  nunjucksConfig: {
    noCache: true,
    autoescape: true
  }
}))

// routers
app.use(router.routes())

app.listen(port, () => {
  // 输出完整http地址，可以在控制台直接点击打开
  console.log(`server started at http://127.0.0.1:${port}/index`)
  // Mac 下面直接打开浏览器
  if (process.platform === 'darwin') {
    childProcess.exec(`open http://127.0.0.1:${port}/index`)
  }
})
