<template>
  <el-container class="center">
    <el-aside width="150px">
      <el-menu
        class="menu"
        :default-openeds="['1', '2']"
        menu-trigger="hover"
        :collapse="isCollapse"
        ref="menu"
        :collapse-transition="false"
      >
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-user"></i>
            <span slot="title">个人中心</span>
          </template>
          <el-menu-item-group>
            <el-menu-item
              index="1-1"
              @click="$router.push({ path: '/center/userinfo' })"
            >
              我的信息
            </el-menu-item>
            <el-menu-item
              index="1-2"
              @click="$router.push({ path: '/center/resetpwd' })"
            >
              修改密码
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span slot="title">博客</span>
          </template>
          <el-menu-item-group>
            <el-menu-item
              index="2-1"
              @click="$router.push({ path: '/center/post' })"
            >
              写博客
            </el-menu-item>
            <el-menu-item
              index="2-4"
              @click="$router.push({ path: '/center/blogs' })"
            >
              我的博客
            </el-menu-item>
            <el-menu-item
              index="2-2"
              @click="$router.push({ path: '/center/likes' })"
              >赞赏的文章
            </el-menu-item>
            <el-menu-item
              index="2-3"
              @click="$router.push({ path: '/center/comments' })"
              >我的评论
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item
          index="3"
          @click="$router.push({ path: '/center/tagManage' })"
        >
          <i class="el-icon-collection-tag"></i>
          <i class="hidden-xs-only">标签管理</i>
        </el-menu-item>
        <el-menu-item index="4">
          <i class="el-icon-star-on"></i>
          <span slot="title"> <i class="hidden-xs-only">热爱生活</i></span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-main>
      <keep-alive include="UserPost">
        <router-view> </router-view>
      </keep-alive>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "UserCenter",
  data() {
    return {
      innerHeight: window.innerHeight,
      isCollapse: false,
    };
  },
  mounted() {
    this.isCollapse = window.innerWidth <= 767 ? true : false;
    window.onresize = () => {
      return (() => {
        this.isCollapse = window.innerWidth <= 767 ? true : false;
      })();
    };
  },
  methods: {},
};
</script>

<style scoped>
.center {
  border-top: 1px solid #ddd;
}
.el-aside,
.menu,
.el-menu-item {
  color: #333;
  width: 150px;
  overflow: hidden;
  /* min-width: 150px; */
}

.el-main {
  background-color: #fff;
}

@media screen and (max-width: 767px) {
  .el-aside,
  .menu {
    width: 60px !important;
  }

  .el-menu-item:hover {
    background-color: #fff;
    color: blue !important;
    font-weight: bold;
  }
}
</style>