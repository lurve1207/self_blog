import Vue from 'vue'
import Vuex from 'vuex'

import * as request from "../api/index";
import * as qiniu_requests from "../api/qiniu";
import * as music_requests from "../api/music";
Vue.use(Vuex)

const userAbout = {
    namespace: true,
    actions: {
        // 获取是否点赞文章或者评论
        async findAbout(context, value) {
            let result
            if (value.type == 'art') {
                result = await request.findAbout_Art(value.id)
            }
            if (value.type == 'comm') {
                result = await request.findAbout_Comm(value.id)
            }
            if (result.data.data) {
                return result.data.data.is_like
            }
            else {
                return false
            }
        },
        // 获取作者信息
        async getAuthor(context, value) {
            let result = await request.getAuthor(value)
            return result
        },
        // 用户信息
        async getUserinfo(context) {
            let result = await request.getUserinfo()
            if (result.data.status == 0) {
                context.commit('SET_USERINFO', result.data.data)
            }
            else {
                return alert(result.data.message)
            }
        },
        async updateUserinfo(context, value) {
            let result = await request.updateUserinfo(value)
            return result
        },
        async updateUserPic(context, value) {
            let result = await request.updateUserPic(value)
            return result
        },
        async updatePwd(context, value) {
            let result = await request.updatePwd(value)
            return result
        },
        // 退出登录
        async log_out(context) {
            console.log('准备退出登录了');
            context.commit('LOG_OUT')
        },
        // 存储token
        setToken(context, value) {
            context.commit('SET_TOKEN', value)
        }
    },
    mutations: {
        SET_USERINFO(state, value) {
            state.isLogin = true
            state.user = value
            console.log('用户已登录，state.userAbout变成了', state);
        },
        SET_TOKEN(state, value) {
            state.token = value
        },
        LOG_OUT(state) {
            state.isLogin = false
            state.user = {}
            sessionStorage.removeItem('blog_store')
            localStorage.removeItem('blog_token')
        },
        UPDATE_USERPIC(state, value) {
            state.user.user_pic = value
        }
    },
    state: {
        user: {},
        token: '',
        isLogin: false,
    }
}

const blogAbout = {
    namespace: true,
    actions: {
        // 根据id获取指定文章
        async getArticleById(context, value) {
            let result = await request.getArticleById(value)
            if (result.data.status == 0) {
                context.commit('SET_SINGLE_ART', result.data.data)
            }
            return result
        },
        // 获取标签列表
        async getTagList(context) {
            let response = await request.getTagList()
            if (response.data.status == 0) {
                let tags = response.data.data;
                console.log("所有博客分类---", tags);
                context.commit('SET_TAGLIST', tags)
            } else {
                return new Error('出错了')
            }
        },
        // 获取文章列表
        async getBlogList(context, value) {
            if (value.isByTag) {
                let response = await request.getBlogListByTag(value)
                return response.data.status == 0 ? response.data.data : []
            }
            else {
                let response = await request.getBlogList(value)
                if (response.data.status == 0) {
                    if (value.offset == 0) {
                        // let blogs = response.data.data.arts;
                        // context.commit("EMPTY_BLOGLIST");
                        // context.commit('SET_BLOGLIST', blogs)
                        return response.data.data
                    }
                    else {
                        let blogs = response.data.data;
                        // context.commit('INSERT_BLOGLIST', blogs)
                        return blogs
                    }
                }
                else {
                    return []
                }
            }
        },
        // 获取用户发布的文章列表
        async getUserblogs(context) {
            let response = await request.getUserBlogs()
            if (response.data.status == 0) {
                let blogs = response.data.data;
                return blogs
            }
            else {
                return []
            }
        },
        // 获取用户点赞的文章列表
        async getUserlikes(context) {
            let response = await request.getUserlikes()
            if (response.data.status == 0) {
                let likes = response.data.data;
                return likes
            }
            else {
                return []
            }
        },
        // 获取七牛云图片上传token
        async getImageUploadToken(context, value) {
            let response = await request.getImageUploadToken(value)
            return response
        },
        async uplodaImg(context, value) {
            // for (var val of value.values()) {
            //     console.log(val);
            // }
            let result = await qiniu_requests.uploadImg(value)
            return result
        },
        // 草稿保存与获取
        async saveArticle(context, value) {
            let result = await request.saveArticle(value)
            return result
        },
        async getDraft(context) {
            let result = await request.getDraft()
            if (result.data.status == 0) {
                context.commit('SET_DRAFT', result.data.data)
            }
            return result
        },
        // 发布与删除文章
        async postArticle(context, value) {
            let result = await request.postArticle(value)
            return result
        },
        async delArticle(context, value) {
            let result = await request.delArticle(value)
            return result
        },
        // 获取指定标签
        getTagNameById(context, value) {
            let name = ''
            context.state.tagList.forEach(tag => {
                if (tag.id == value)
                    name = tag.name
            });
            return name
        },
        // 喜欢文章或评论
        async likeArticle(context, value) {
            let result = await request.likeArticle(value)
            if (result.data.status == 0) {
                context.commit('SET_ART_LIKES', {
                    id: value,
                    likes: result.data.data.likes
                })
            }
            return result
        },
        async likeComment(context, value) {
            let result = await request.likeComment(value)
            return result
        },
        // 获取评论列表
        async getComment(context, value) {
            let result = await request.getComment(value)
            if (result.data.status == 0) {
                context.commit('SET_COMMENTS', result.data.data)
            }
            return result
        },
        // 添加与删除评论
        async addComment(context, value) {
            let result = await request.addComment(value)
            return result
        },
        async delComm(context, value) {
            let result = await request.delComm(value)
            return result
        },
        // 获取用户的评论列表
        async getUserComments(context, value) {
            let result = await request.getUserComments()
            if (result.data.status == 0) {
                let likes = result.data.data;
                return likes
            }
            else {
                return []
            }
        },
        // 文章搜索
        async searchArt(context, value) {
            let result = await request.searchArt(value)
            return result
        },
        // 标签的增删改
        async addTag(context, value) {
            let result = await request.addTag(value)
            return result
        },
        async delTag(context, value) {
            let result = await request.delTag(value)
            return result
        },
        async updateTag(context, value) {
            let result = await request.updateTag(value)
            return result
        },
        // 音乐接口
        async getSongsUrl(context, value) {
            let result = await music_requests.getSongsUrl(value)
            return result
        },
        async getNewSongs(context, value) {
            let result = await music_requests.getNewSongs(value)
            return result
        },
        async getSongDetail(context, value) {
            let result = await music_requests.getSongDetail(value)
            return result
        },
        async getSongLyric(context, value) {
            let result = await music_requests.getSongLyric(value)
            return result
        },






    },
    mutations: {
        SET_TAGLIST(state, value) {
            state.tagList = value
            state.tagList.forEach((ele) => {
                state.tags_idToName[ele.id] = ele.name;
                state.tags_nameToId[ele.name] = ele.id;
            });
        },
        DEL_TAG(state, value) {
            state.tagList.splice(value, 1);
        },
        UPDATE_TAG(state, value) {
            state.tagList[value.index].name = value.val.name
            state.tagList[value.index].alias = value.val.alias

            state.tags_idToName[value.val.id] = value.val.name
            state.tags_nameToId[value.val.name] = value.val.id

        },
        SET_SINGLE_ART(state, value) {
            let isLoaded = false
            state.blogList.forEach((element, index) => {
                if (element.id == value.id) {
                    isLoaded = true
                    state.blogList[index] = value
                }
            });
            if (!isLoaded) {
                state.blogList.push(value)
            }
        },
        DEL_ART(state, value) {
            state.blogList.forEach((element, index) => {
                if (element.id == value.id) {
                    state.blogList[index] = value
                }
            });
        },
        ADD_ART(state, value) {
            state.blogList.forEach((element, index) => {
                if (element.id == value.id) {
                    state.blogList[index] = value
                }
            });
        },
        SET_ART_LIKES(state, value) {
            state.blogList.forEach((element, index) => {
                if (element.id == value.id) {
                    state.blogList[index].likes = value.likes
                }
            });
        },
        EMPTY_BLOGLIST(state, value) {
            console.log('变空了');
            state.blogList = []
        },
        SET_BLOGLIST(state, value) {
            console.log("初次+++已加载博客---", value);
            state.blogList = value
        },
        INSERT_BLOGLIST(state, value) {
            console.log("已加载博客---", value);
            state.blogList.push(...value)
        },
        SET_DRAFT(state, value) {
            state.userDraft = value
        },
        SET_COMMENTS(state, value) {
            state.comments = value
        },
        SET_COMMENTSCOPY(state, value) {
            state.commentsCopy = value
        },
        SET_MODE(state, value) {
            state.mode = value
        },
        SET_TOTAL(state, value) {
            state.total = value
        },
        SET_COUNT(state, value) {
            state.count = value
        },
    },
    state: {
        count: 0, // 无限滚动的计数
        total: 0, // 后台返回的文章总数
        tagList: [], // 标签列表
        tags_idToName: {}, // 标签id-->name的字典
        tags_nameToId: {}, // 标签name-->id的字典
        blogList: [], // 文章列表
        userDraft: {}, // 草稿
        comments: [], // 评论列表
        commentsCopy: [],
        mode: 'dark', // 昼夜模式

    }
}

const linkAbout = {
    namespace: true,
    actions: {
        async getLinks(context) {
            let response = await request.getLinks()
            if (response.data.status == 0) {
                context.commit('SET_LINKLIST', response.data.data)
            }
        },
        async addLink(context, value) {
            console.log('value', value);
            let response = await request.addLink(value)
            return response
        }
    },
    mutations: {
        SET_LINKLIST(state, value) {
            state.linkList = value
        }
    },
    state: {
        linkList: []
    }
}

export default new Vuex.Store({
    modules: {
        userAbout,
        blogAbout,
        linkAbout
    }
})