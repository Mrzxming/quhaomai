/**
 * uni-app vue.config.js
 * 生产环境（发行）构建时移除 console，减小包体积
 * 需要：发行时勾选「运行时是否压缩代码」，或 CLI 加 --minimize
 * 参考：https://uniapp.dcloud.net.cn/collocation/vue-config.html#发布时删除console
 */
module.exports = {
  chainWebpack: (config) => {
    // 发行或运行时启用了压缩时会生效
    config.optimization.minimizer('terser').tap((args) => {
      const compress = args[0].terserOptions.compress
      // 移除所有 console 代码（log、debug、info、warn 等）
      compress.drop_console = true
      compress.drop_debugger = true
      return args
    })
  }
}
