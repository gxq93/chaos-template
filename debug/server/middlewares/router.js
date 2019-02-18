const Router = require('koa-router')
const controller = require('../controllers/controller')

const router = new Router({
  prefix: ''
})

router.get('/index', async ctx => {
  await ctx.render('index')
})

router.all('/*', controller)

module.exports = router
