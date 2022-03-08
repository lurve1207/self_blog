import axios from 'axios'


const qiniu_requests = axios.create({
    timeout: 3000
})



export const uploadImg = (data) => qiniu_requests.post("https://upload-z2.qiniup.com", data, {
    headers: { 'Content-Type': 'multipart/form-data' }
})

