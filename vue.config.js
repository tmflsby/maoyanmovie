// module.exports = {
//   lintOnSave: process.env.NODE_ENV !== 'production'
// }

module.exports = {
  publicPath: '/shuaiyang',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://39.97.33.178',
        changeOrigin: true
      }
    }
  }
}
