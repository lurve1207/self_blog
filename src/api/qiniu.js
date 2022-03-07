import axios from 'axios'
import Qs from 'qs'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'


const qiniu_requests = axios.create({
    timeout: 3000
})

// 请求拦截器
qiniu_requests.interceptors.request.use(config => {
    // console.log('我是请求拦截器1');
    // 配置请求头...
    nprogress.start()
    return config
}, error => {
    return Promise.reject(error)
})

// 响应拦截器
qiniu_requests.interceptors.response.use(response => {
    // console.log('我是响应拦截器1');
    // 可进行数据处理...
    nprogress.done()
    return response
}, (error) => {
    return Promise.reject(error)
})


export const uploadImg = (data) => qiniu_requests.post("https://upload-z2.qiniup.com", data, {
    headers: { 'Content-Type': 'multipart/form-data' }
})

