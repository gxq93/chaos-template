const path = require('path')
const glob = require('glob')

const servicesDir = path.join(__dirname, '../../../services')

module.exports = ctx => {
  // 与客户端直接调用service层接口的参数格式保持一致，参数外部需使用数组包裹
  // 如 '['{a: 1}', '{b: 2}']'
  let { data = '[]' } = ctx.request.body
  data = JSON.parse(data)

  glob.sync('**/*.js', {
    cwd: servicesDir
  }).forEach((ctrPath) => {
    ctrPath = ctrPath.replace(/([/\\]?index)?\.js$/, '')

    if (`/${ctrPath}` === ctx.request.url) {
      const service = require(path.join(servicesDir, ctrPath))

      if (typeof service === 'function') {
        const responseData = service(...data)
        ctx.body = JSON.parse(responseData)
      }
    }
  })
}
