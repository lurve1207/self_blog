import Vue from 'vue'
import Vuex from 'vuex'

import * as request from "../api/index";
import * as qiniu_requests from "../api/qiniu";
import * as music_requests from "../api/music";
Vue.use(Vuex)

const userAbout = {
    namespace: true,
    actions: {
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
        async getAuthor(context, value) {
            let result = await request.getAuthor(value)
            return result

        },
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
        async log_out(context) {
            console.log('准备退出登录了');
            context.commit('LOG_OUT')
        },
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
        user: {
        },
        token: '',
        isLogin: false,
    }
}

const blogAbout = {
    namespace: true,
    actions: {
        async getArticleById(context, value) {
            let result = await request.getArticleById(value)
            if (result.data.status == 0) {
                context.commit('SET_SINGLE_ART', result.data.data)
            }
            return result
        },
        async getTagList(context) {
            let response = await request.getTagList()
            // console.log('......', response);
            if (response.data.status == 0) {
                let tags = response.data.data;
                console.log("所有博客分类---", tags);
                context.commit('SET_TAGLIST', tags)
            } else {
                return new Error('出错了')
            }
        },
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
                        console.log("已加载博客---", blogs);
                        context.commit('INSERT_BLOGLIST', blogs)
                        return blogs
                    }
                }
                else {
                    return []
                }
            }
        },
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
        async saveArticle(context, value) {
            let result = await request.saveArticle(value)
            return result
        },
        async postArticle(context, value) {
            let result = await request.postArticle(value)
            return result
        },
        async delArticle(context, value) {
            let result = await request.delArticle(value)
            return result
        },
        async getDraft(context) {
            let result = await request.getDraft()
            if (result.data.status == 0) {
                context.commit('SET_DRAFT', result.data.data)
            }
            return result
        },
        getTagNameById(context, value) {
            let name = ''
            context.state.tagList.forEach(tag => {
                if (tag.id == value)
                    name = tag.name
            });
            return name
        },
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
        async getComment(context, value) {
            let result = await request.getComment(value)
            if (result.data.status == 0) {
                context.commit('SET_COMMENTS', result.data.data)
            }
            return result
        },
        async addComment(context, value) {
            let result = await request.addComment(value)
            return result
        },
        async delComm(context, value) {
            let result = await request.delComm(value)
            return result
        },
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
        async getParentComm(context, value) {
            let result = await request.getSingleComment(value)
            return result
        },
        async searchArt(context, value) {
            let result = await request.searchArt(value)
            return result
        },
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
    },
    state: {
        total: 0,
        tagList: [],
        tags_idToName: {},
        tags_nameToId: {},
        blogList: [],
        userDraft: {},
        comments: [],
        commentsCopy: [],
        mode: 'dark',

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