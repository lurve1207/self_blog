<template>
  <div class="header">
    <el-row
      :class="
        $route.path.indexOf('home') !== -1
          ? ''
          : $store.state.blogAbout.mode == 'dark'
          ? 'dark-sec'
          : 'light-sec'
      "
    >
      <el-col :span="3">
        <span class="blogerName hidden-xs-only"><i>聿果</i></span>
      </el-col>
      <el-col :span="21" :xs="24">
        <el-menu
          class="nav"
          background-color="rgba(0,0,0,0)"
          active-text-color="orange"
        >
          <el-menu-item v-if="$store.state.userAbout.user.username" index="8">
            <el-dropdown @command="handleCommand" placement="top-start">
              <span class="el-dropdown-link">
                <i> {{ $store.state.userAbout.user.username }}</i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a" icon="el-icon-user"
                  ><i>个人中心</i></el-dropdown-item
                >
                <el-dropdown-item command="b" icon="el-icon-postcard"
                  ><i>发布博客</i></el-dropdown-item
                >
                <el-dropdown-item command="c" icon="el-icon-delete"
                  ><i>退出登录</i></el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </el-menu-item>
          <el-menu-item
            v-else
            index="6"
            @click="$router.push({ path: '/login' })"
            class="log_res"
          >
            <i>登录/注册</i>
          </el-menu-item>
          <el-menu-item index="5" @click="$router.push({ path: '/links' })">
            <i class="el-icon-link"></i><i>友链</i>
          </el-menu-item>
          <!-- <el-menu-item
          index="4"
          @click="$router.push({ path: '/music' })"
          class="hidden-xs-only"
        >
          音乐盒
        </el-menu-item> -->
          <el-menu-item index="3" @click="$router.push({ path: '/summary' })">
            <i class="el-icon-files"></i><i>归档</i>
          </el-menu-item>
          <el-menu-item index="2" @click="$router.push({ path: '/tags' })">
            <i class="el-icon-price-tag"></i><i>标签</i>
          </el-menu-item>
          <el-menu-item index="1" @click="$router.push({ path: '/home' })">
            <i class="el-icon-s-home"></i><i>首页</i>
          </el-menu-item>
          <el-autocomplete
            class="inline-input hidden-sm-and-down"
            v-model="query"
            :fetch-suggestions="querySearchAsync"
            placeholder="搜索"
            :trigger-on-focus="false"
            @select="handleSelect"
            clearable
          ></el-autocomplete>
          <!-- <el-menu-item index="8" class="hidden-md-and-up">
            <i class="el-icon-search" style="color: #fff"></i>
          </el-menu-item> -->
          <el-menu-item index="9" @click="changeMode">
            <i
              v-if="$store.state.blogAbout.mode == 'light'"
              class="el-icon-sunny"
            ></i>
            <i v-else class="el-icon-moon"></i>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "UserHeader",
  data() {
    return { query: "" };
  },
  methods: {
    async querySearchAsync(queryString, cb) {
      if (queryString.trim() !== "") {
        let blogList = [];
        let result = await this.$store.dispatch("searchArt", {
          title: queryString,
        });
        if (result.data.status == 0) {
          console.log(result.data.data);
          for (let i of result.data.data) {
            i.value = i.title; //将想要展示的数据作为value
          }
          blogList = result.data.data;
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            cb(blogList);
          }, 100);
        } else {
          this.$message.error({
            showClose: true,
            message: result.data.message,
            offset: 60,
          });
        }
      }
    },
    handleSelect(item) {
      this.query = "";
      this.$router.push({ name: "eachBlog", params: { id: item.id } });
    },
    loadAll() {
      return [];
    },
    logout() {
      this.$store.dispatch("log_out");
      this.$router.push({ path: "/home" });
    },
    handleCommand(command) {
      switch (command) {
        case "a":
          this.$router.push({ path: "/center/userinfo" });
          break;
        case "b":
          this.$router.push({ path: "/center/post" });
          break;
        case "c":
          this.logout();
          break;
      }
    },
    changeMode() {
      let mode = this.$store.state.blogAbout.mode == "dark" ? "light" : "dark";
      this.$store.commit("SET_MODE", mode);
    },
  },
  computed: {},
};
</script>

<style scoped lang="less">
.blogerName {
  display: inline-block;
  float: left !important;
  font-size: 24px;
  line-height: 20px;
  font-weight: 600;
  color: #fff;
  padding: 20px;
}

.nav {
  border: 0;

  .el-menu-item {
    overflow: hidden;
    float: right;
    max-width: 97px;

    .el-icon-sunny {
      font-size: 24px;
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0) !important;
      animation: pulse;
      animation-duration: 0.4s;
    }

    .el-dropdown {
      display: flex;
      text-align: center;
      height: 100%;
      .el-dropdown-link {
        flex: 1;
        cursor: pointer;
      }
    }
  }

  i {
    color: white;
  }

  .is-active {
    background-color: rgba(0, 0, 0, 0) !important;
    i {
      color: orange;
    }
  }

  .el-autocomplete {
    display: inline-block;
    width: 200px;
    margin: 10px 5px;
    float: right;
    background-color: #fff;
    border-radius: 50%;
  }
}

.clearfix {
  overflow: hidden !important;
}

@media screen and (max-width: 767px) {
  .el-menu-item {
    padding: 0;
    width: 16%;
  }
  .log_res {
    text-indent: -1.3em;
  }
}
</style>