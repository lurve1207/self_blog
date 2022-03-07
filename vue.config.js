const { resolve } = require('path')

module.exports = {
    lintOnSave: false, //关闭语法检查
    devServer: {
        proxy: {
            '/server': {
                target: 'http://8.134.52.212:3000',
                pathRewrite: { '^/server': '' },
                changeOrigin: true
            },
            '/local': {
                target: 'http://127.0.0.1:3000',
                pathRewrite: { '^/local': '' },
                changeOrigin: true
            },
        }
    },
    chainWebpack: config => {
        config.resolve.alias
            .set('@', resolve('src')).set('vue', resolve('./node_modules/vue'))
    },
}