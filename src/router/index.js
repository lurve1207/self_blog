import Vue from 'vue'
import VueRouter from 'vue-router'

// 引入组件
import UserHome from '../pages/UserHome'
import UserBlogTags from '../pages/UserBlogTags'
import UserSummary from '../pages/UserSummary'
import UserBlog from '../pages/UserBlog'
import UserMusic from '../pages/UserMusic'
import UserLinks from '../pages/UserLinks'
import UserSearch from '../pages/UserSearch'
import UserLogin from '../pages/account/UserLogin'
import UserRegister from '../pages/account/UserRegister'

import UserCenter from '../pages/center/UserCenter'
import UserUserinfo from '../pages/center/user/UserUserinfo'
import UserResetPwd from '../pages/center/user/UserResetPwd'
import UserBlogs from '../pages/center/blogManage/UserBlogs'
import UserPost from '../pages/center/blogManage/UserPost'
import UserLikes from '../pages/center/blogManage/UserLikes'
import UserComments from '../pages/center/blogManage/UserComments'
import UserTagManage from '../pages/center/tagManage/UserTagManage.vue'


// 引入store
import store from '../store/index'





Vue.use(VueRouter)

// 重写编程式导航的push与replace
let originPush = VueRouter.prototype.push
let originReplace = VueRouter.prototype.replace
VueRouter.prototype.push = function (location, resolve, reject) {
    // console.log("@", this);
    if (resolve && reject) {
        originPush.call(this, location, resolve, reject)
    } else {
        originPush.call(this, location, () => { }, () => { })
    }
}
VueRouter.prototype.replace = function (location, resolve, reject) {
    // console.log("@", this);
    if (resolve && reject) {
        originReplace.call(this, location, resolve, reject)
    } else {
        originReplace.call(this, location, () => { }, () => { })
    }
}


let router = new VueRouter({
    routes: [
        {
            path: '/home',
            component: UserHome,
            meta: {
                showFooter: true,
            }
        },
        {
            path: '/tags',
            component: UserBlogTags,
            meta: {
                showFooter: true,
            }
        },
        {
            path: '/summary',
            component: UserSummary,
            meta: {
                showFooter: false,
            }
        },
        {
            name: "eachBlog",
            path: '/blog/:id',
            component: UserBlog,
            meta: {
                showFooter: true,
            }
        },
        {
            path: '/links',
            component: UserLinks,
            meta: {
                showFooter: false,
            }
        },
        {
            path: '/login',
            component: UserLogin,
            meta: {
                showFooter: false,
            }
        },
        {
            path: '/register',
            component: UserRegister,
            meta: {
                showFooter: false,
            }
        },
        {
            path: '/center',
            component: UserCenter,
            meta: {
                showFooter: true,
            },
            children: [
                {
                    path: 'userinfo',
                    component: UserUserinfo,
                    meta: {
                        showFooter: false,
                    },
                },
                {
                    path: 'resetpwd',
                    component: UserResetPwd,
                    meta: {
                        showFooter: false,
                    },
                },
                {
                    path: 'blogs',
                    component: UserBlogs,
                    meta: {
                        showFooter: false,
                    }
                },
                {
                    path: 'post',
                    component: UserPost,
                    meta: {
                        showFooter: false,
                    },

                },
                {
                    path: 'likes',
                    component: UserLikes,
                    meta: {
                        showFooter: false,
                    },

                },
                {
                    path: 'comments',
                    component: UserComments,
                    meta: {
                        showFooter: false,
                    },

                },
                {
                    path: 'tagManage',
                    component: UserTagManage,
                    meta: {
                        showFooter: false,
                    },

                },

            ]
        },
        // 重定向
        {
            path: "*",
            redirect: "/home"
        }

    ]
})

router.beforeEach((to, from, next) => {
    console.log('路由信息，from:', from.path, ' to:', to.path);

    let isLoginAtSession
    let isLoginAtStore
    let isLogin
    // 刷新网站
    if (sessionStorage.getItem("blog_store")) {
        isLoginAtSession = JSON.parse(sessionStorage.getItem("blog_store")).userAbout.isLogin
        isLoginAtStore = store.state.userAbout.isLogin
        isLogin = isLoginAtSession == isLoginAtStore ? isLoginAtStore : isLoginAtSession
    }
    // 打开多个网站页面
    else if (store.state.userAbout.isLogin !== false) {
        isLogin = store.state.userAbout.isLogin
    }
    // 刚打开网站
    else {
        isLogin = false
    }

    console.log("是否已登录：", isLogin);
    if (isLogin == true) {
        if (to.path == '/login') {
            console.log('登录了不能去login,打回去');
            next(from.path)
        }
    }
    else {
        if (to.path.indexOf('/center') !== -1) {
            console.log('没登录不能去center,打回去');
            next(from.path)
        }
    }
    next()
})

export default router