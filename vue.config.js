const webpack = require('webpack')
module.exports = {
  baseUrl: './',
  assetsDir: 'static',
  productionSourceMap: false,
  devServer: {
    proxy: {
      '/mall-api': {
        target: `http://mallapi-uat.stbchina.cn`, //
        // target: `http://localhost:8080`,
        changeOrigin: true,
        pathRewrite: {
          '/mall-api': '/'
        }
      }
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        'window.Quill': 'quill/dist/quill.js',
        'Quill': 'quill/dist/quill.js'
      })
    ]
  }
}
