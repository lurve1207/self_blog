<template>
  <div
    class="banner-wrap"
    :style="
      $store.state.blogAbout.mode == 'dark'
        ? { background: `url(http://cdn.yuguo.work/${bg[0]})` }
        : { background: `url(http://cdn.yuguo.work/${bg[1]})` }
    "
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
  data() {
    return { bg: ["bg3.jpg", "bg6.jpg"] };
  },
  methods: {
    async init() {
      if (localStorage.getItem("blog_token")) {
        await this.getUserinfo();
      }
      this.$store.dispatch("getTagList");
    },
    async getUserinfo() {
      let result = await getUserinfo();
      console.log("这是获取用户信息的结果", result.data);
      if (result.data.status == 0) {
        this.$store.commit("SET_USERINFO", result.data.data);
      } else {
        this.$message.warning("请重新登录");
      }
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

<style scoped>
.banner-wrap {
  width: 100%;
  height: 600px;
  background-repeat: no-repeat;
  background-size: cover;
  animation: fadeInDown;
  animation-duration: 1s;
}

.notHome {
  height: 60px;
}

@media screen and (max-width: 767px) {
  .banner-wrap {
    height: 60px;
  }
}
</style>
