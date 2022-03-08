const { resolve } = require('path')

module.exports = {
    lintOnSave: false, //关闭语法检查
    devServer: {
        proxy: {
            // 远程服务器的nodejs后台
            '/server': {
                target: 'http://8.134.52.212:3000',
                pathRewrite: { '^/server': '' },
                changeOrigin: true
            },
            // 本地测试时的nodejs后台
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

        // 发布模式
        config.when(process.env.NODE_ENV === 'production', config => {
            // 默认是main.js要清空换成自己的
            config.entry('app').clear().add('./src/main-prod.js')

            config.set('externals', {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                nprogress: 'NProgress'
                // 'mavon-editor': 'mavon-editor' // 配置有问题，不知道如何修改
            })

            config.plugin('html').tap(args => {
                args[0].isProd = true
                args[0].title = 'Yuguo的博客'
                return args
            })
        })

        // 开发模式
        config.when(process.env.NODE_ENV === 'development', config => {
            // 默认是main.js要清空换成自己的
            config.entry('app').clear().add('./src/main-dev.js')

            // config.set('externals', {
            //     'vue-router': 'VueRouter',
            // })
            config.plugin('html').tap(args => {
                args[0].isProd = false
                args[0].title = 'Yuguo的博客'
                return args
            })
        })
    },

    publicPath: process.env.NODE_ENV === 'production' ? './' : '/'

}