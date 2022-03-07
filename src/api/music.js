import axios from 'axios'
import Qs from 'qs'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'


const music_requests = axios.create({
    baseURL: 'https://yuguo-netease-cloud-music-api.vercel.app',
    timeout: 5000
})

// 请求拦截器
music_requests.interceptors.request.use(config => {
    // console.log('我是请求拦截器1');
    // 配置请求头...
    nprogress.start()
    return config
}, error => {
    return Promise.reject(error)
})

// 响应拦截器
music_requests.interceptors.response.use(response => {
    // console.log('我是响应拦截器1');
    // 可进行数据处理...
    nprogress.done()
    return response
}, (error) => {
    return Promise.reject(error)
})


export const getNewSongs = () => music_requests.get(`/personalized/newsong`,)

export const getSongsUrl = (song_id) => music_requests.get(`/song/url?id=${song_id}`,)

export const getSongDetail = (song_ids) => music_requests.get(`/song/detail?ids=${song_ids}`)

export const getSongLyric = (song_id) => music_requests.get(`/lyric?id=${song_id}`)

