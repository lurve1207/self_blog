import Vue from 'vue'
import App from './App.vue'
import store from './store/index'
import router from './router'
import axios from 'axios'
// 按需导入element ui
import './plugins/elementUI.js'

// 引入全局样式
import 'animate.css'
import './assets/icon/iconfont.css'
import 'element-ui/lib/theme-chalk/display.css';
//全局公用样式
import './assets/css/normalize.css'
import './assets/css/common.css'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 引入mavon-editor
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
// 引入infiniteScroll
import infiniteScroll from 'vue-infinite-scroll'
// 引入音乐播放器
import APlayer from '@moefe/vue-aplayer';


// 注册mavonEditor
Vue.use(mavonEditor)
// 注册infiniteScroll
Vue.use(infiniteScroll)
// 注册音乐播放器
Vue.use(APlayer, {
    defaultCover: 'https://github.com/u3u.png',
    productionTip: true,
});

// 在request拦截器中，展示进度条 NProgress.start()
axios.interceptors.request.use(config => {
    NProgress.start()
    return config
}, (error) => {
    return Promise.reject(error)
})
// 在response拦截器中，隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
    NProgress.done()
    return config
}, (error) => {
    return Promise.reject(error)
})


Vue.config.productionTip = false

new Vue({
    render: h => h(App),
    router,
    store,
    beforeCreate() {
        Vue.prototype.$bus = this;
    }
}).$mount('#app')
