<template>
  <div
    class="banner-wrap"
    :class="$route.path.indexOf('home') == -1 ? 'notHome' : ''"
  >
    <noscript>
      <strong>出问题了</strong>
    </noscript>
    <UserHeader />
    <UserMain />
    <UserFooter v-show="$route.meta.showFooter" />
  </div>
</template>

<script>
import UserHeader from "./components/Header/UserHeader";
import UserMain from "./components/Main/UserMain";
import UserFooter from "./components/Footer/UserFooter";

import { getUserinfo } from "./api";

export default {
  name: "App",
  components: { UserHeader, UserMain, UserFooter },
  methods: {
    async getUserinfo() {
      let result = await getUserinfo();
      console.log("这是获取用户信息的结果", result.data);
      if (result.data.status == 0) {
        this.$store.commit("SET_USERINFO", result.data.data);
      } else {
        this.$message.warning("请重新登录");
      }
    },

    async init() {
      if (localStorage.getItem("blog_token")) {
        await this.getUserinfo();
      }
      this.$store.dispatch("getTagList");
      // this.$store.dispatch("getBlogList");
    },
  },
  created() {
    if (sessionStorage.getItem("blog_store")) {
      this.$store.replaceState(
        Object.assign({}, JSON.parse(sessionStorage.getItem("blog_store")))
      );
    }
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("blog_store", JSON.stringify(this.$store.state));
    });

    this.init();
  },
};
</script>

<style>
/* 内外边距 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 斜体不倾斜 */
em,
i {
  font-style: normal;
}

/* 去掉li的圆点 */
li {
  list-style: none;
}

/* 防止图片作为链接是出现边框 */
/* 垂直居中对齐文字 */
img {
  border: 0;
  vertical-align: middle;
}

/* 鼠标移至按钮变成小手 */
button {
  cursor: pointer;
}

/* 链接去掉下划线，改变默认颜色 */
a {
  color: #666;
  text-decoration: none;
}

/* 鼠标移至链接，变色 */
a:hover {
  color: #c81623;
}

/* 按钮，输入的字体 */
button,
input {
  font-family: Microsoft YaHei, Heiti SC, tahoma, arial, Hiragino Sans GB,
    "\5B8B\4F53", sans-serif;
  border: 0;
  outline: none;
}

/* 主体背景，字体，颜色 */
body {
  /* 字体平滑 */
  -webkit-font-smoothing: antialiased;
  font: 12px/1.5 Microsoft YaHei, Heiti SC, tahoma, arial, Hiragino Sans GB,
    "\5B8B\4F53", sans-serif;
  min-width: 320px;
  overflow-x: hidden;
}

/* 自定义隐藏类 */
.hide,
.none {
  display: none;
}

/* 清除浮动 */
.clearfix:after {
  visibility: hidden;
  clear: both;
  display: block;
  content: ".";
  height: 0;
}

.clearfix {
  *zoom: 1;
}

.banner-wrap {
  width: 100%;
  height: 600px;
  background: url("./assets/images/wallhaven-dpxeem.jpg") no-repeat;
  background-size: cover;
}

.global-notify {
  background-color: green;
  font-size: 30px;
}

.notHome {
  height: 60px !important;
}

@media screen and (max-width: 767px) {
  .banner-wrap {
    height: 60px;
  }
}
</style>
