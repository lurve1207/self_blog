import axios from 'axios'
import Qs from 'qs'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'


const requests = axios.create({
    // baseURL: "http://8.134.52.212:3000",
    baseURL: "http://127.0.0.1:8080/server",
    // baseURL: "http://127.0.0.1:8080/local",


    timeout: 5000
})



// 请求拦截器
requests.interceptors.request.use(config => {
    // console.log('我是请求拦截器1');
    // 配置请求头...
    nprogress.start()
    return config
}, error => {
    return Promise.reject(error)
})


// 响应拦截器
requests.interceptors.response.use(response => {
    // console.log('我是响应拦截器1');
    // 可进行数据处理...
    nprogress.done()
    return response
}, (error) => {
    return Promise.reject(error)
})


// 1.文章
export const getArticleById = (art_id) => requests.get(`/api/art/${art_id}`)

export const getAuthor = (data) => requests.get("/api/author", { params: { id: data } })

export const getTagList = () => requests.get("/api/tags")

export const getBlogListByTag = config => requests.get(`/api/tag/${config.id}/articles`, { params: config })

export const getBlogList = config => requests.get(`/api/all/`, { params: config })

export const getComment = (art_id) => requests.get(`/api/comms/${art_id}`)

export const getSingleComment = (comm_id) => requests.get(`/api/comm/${comm_id}`)

export const searchArt = (value) => requests.post('/api/search', Qs.stringify(value))

// 文章标签管理
export const addTag = (data) => requests.post('/api/addtag', Qs.stringify(data))

export const delTag = (tag_id) => requests.get(`/api/deltag/${tag_id}`)

export const updateTag = (tag_data) => requests.post(`/api/updatetag`, Qs.stringify(tag_data))


// 2.账户
export const register = (value) => requests.post('/api/register',
    `username=${value.username}&password=${value.password}`)

export const login = (value) => requests.post('/api/login',
    `username=${value.username}&password=${value.password}`)

// 3.友链
export const getLinks = () => requests.get('/api/links')

export const addLink = (data) => requests.post('/api/addlink', Qs.stringify(data))


// ****************************分割线*******************

// 1.个人中心
export const getUserinfo = () => requests.get('/user/userinfo', {
    headers: { 'Authorization': localStorage.getItem('blog_token') }
})

export const updateUserinfo = (data) => requests.post('/user/userinfo', Qs.stringify(data), {
    headers: { 'Authorization': localStorage.getItem('blog_token') }
})

export const updateUserPic = (data) => requests.post('/user/updateuserpic', Qs.stringify(data), {
    headers: { 'Authorization': localStorage.getItem('blog_token') }
})

export const updatePwd = (data) => requests.post('/user/updatepwd ', Qs.stringify(data), {
    headers: { 'Authorization': localStorage.getItem('blog_token') }
})

// 2.博客管理
export const saveArticle = (data) => requests.post('/user/saveart ', Qs.stringify(data), {
    headers: { 'Authorization': localStorage.getItem('blog_token') }
})

export const postArticle = (data) => requests.post('/user/addart ', Qs.stringify(data), {
    headers: { 'Authorization': localStorage.getItem('blog_token') }
})

export const getDraft = () => requests.get('/user/draft ', {
    headers: { 'Authorization': localStorage.getItem('blog_token') }
})

export const getImageUploadToken = (data) => requests.post('/user/imguptoken', Qs.stringify(data), {
    headers: { 'Authorization': localStorage.getItem('blog_token') }
})

export const getUserBlogs = () => requests.get("/user/all", {
    headers: { 'Authorization': localStorage.getItem('blog_token') }
})

export const getUserComments = () => requests.get(`/user/comms`, {
    headers: { 'Authorization': localStorage.getItem('blog_token') }
})

export const getUserlikes = () => requests.get("/user/likes", {
    headers: { 'Authorization': localStorage.getItem('blog_token') }
})

export const delArticle = (art_id) => requests.post("/user/delart", `id=${art_id}`, {
    headers: { 'Authorization': localStorage.getItem('blog_token'), }
})

// 3.文章交互
export const likeArticle = (art_id) => requests.post("/user/like/art", `id=${art_id}`, {
    headers: { 'Authorization': localStorage.getItem('blog_token'), }
})

export const likeComment = (comm_id) => requests.post("/user/like/comm", `id=${comm_id}`, {
    headers: { 'Authorization': localStorage.getItem('blog_token'), }
})



export const findAbout_Art = (art_id) => requests.post("/user/about/art", `id=${art_id}`, {
    headers: { 'Authorization': localStorage.getItem('blog_token'), }
})

export const findAbout_Comm = (art_id) => requests.post("/user/about/comm", `id=${art_id}`, {
    headers: { 'Authorization': localStorage.getItem('blog_token'), }
})


export const addComment = (data) => requests.post('/user/addcomm ', Qs.stringify(data), {
    headers: { 'Authorization': localStorage.getItem('blog_token') }
})

export const delComm = (data) => requests.post('/user/delcomm ', Qs.stringify(data), {
    headers: {
        'Authorization': localStorage.getItem('blog_token')
    }
})







