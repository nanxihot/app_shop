// webpack配置文件修改默认配置
module.exports = {
  chainWebpack: config => {
    // config.when判断当前是开发阶段还是发布阶段
    // process.env.NODE_ENV === 'production'为true时执行后边的函数
    config.when(process.env.NODE_ENV === 'production', config => {
      // 自定义打包入口
      config.entry('app').clear().add('./src/main-prod.js')
      config.set("externals",
        {
          vue: 'Vue',
          'vue-router': 'VueRouter',
          axios: 'axios',
          lodash: '_',
          echarts: 'echarts',
          nprogress: 'NProgress',
          'vue-quill-editor': 'VueQuillEditor'
        })
      // 用于在index.html中判断是发布者模式还是开发者模式
      config.plugin('html').tap(args => {
        args[0].isprod = true;
        return args
      })
    })
    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
      config.plugin('html').tap(args => {
        args[0].isprod = false;
        return args
      })
    })
  }
}
