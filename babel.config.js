const prodPlugins = []
// 项目处于产品的发布模式
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push("transform-remove-console")
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    // 发布产品的插件数组
    ...prodPlugins,
    "@babel/plugin-syntax-dynamic-import"
  ]
}
