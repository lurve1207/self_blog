import axios from 'axios'


const music_requests = axios.create({
    baseURL: 'https://yuguo-netease-cloud-music-api.vercel.app',
    timeout: 5000
})



export const getNewSongs = () => music_requests.get(`/personalized/newsong`,)

export const getSongsUrl = (song_id) => music_requests.get(`/song/url?id=${song_id}`,)

export const getSongDetail = (song_ids) => music_requests.get(`/song/detail?ids=${song_ids}`)

export const getSongLyric = (song_id) => music_requests.get(`/lyric?id=${song_id}`)

