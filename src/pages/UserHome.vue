<template>
  <div class="home">
    <el-row class="intro hidden-xs-only">
      <div>
        <h1>简单的记录</h1>
        <transition appear>
          <p class="animate__animated animate__flipInX">
            今日复今日,今日何其少!今日又不为,此事何时了!
          </p>
        </transition>
      </div>
    </el-row>

    <el-row class="content" :class="$store.state.blogAbout.mode">
      <el-col
        :md="{ span: 16, offset: 4 }"
        :sm="{ span: 18, offset: 3 }"
        :xs="{ span: 22, offset: 1 }"
      >
        <!-- <h3>深度学习</h3>
        <h3>axios源码解析</h3>
        <h3>webpack自定义</h3>
        <h3>vue3</h3> -->
        <el-row>
          <!-- 左侧博客卡片列表 -->
          <el-col
            :span="16"
            :xs="{ span: 24 }"
            v-infinite-scroll="load"
            :infinite-scroll-immediate="true"
            :infinite-scroll-distance="200"
            class="blogs"
          >
            <transition-group appear>
              <div
                v-for="blog in showBlogList"
                :key="blog.id"
                class="el-card animate__animated animate__fadeInLeft"
                :class="
                  $store.state.blogAbout.mode == 'dark'
                    ? 'dark-sec'
                    : 'light-sec'
                "
              >
                <h2 @click="showBlog(blog.id)">{{ blog.title }}</h2>
                <div class="tags" v-show="showBlogList.length > 0">
                  <el-tag
                    v-for="tag_id in blog.tag_ids.split(',')"
                    :key="blog.id + '-' + tag_id"
                    type="success"
                    effect="dark"
                  >
                    {{ $store.state.blogAbout.tags_idToName[tag_id] }}
                  </el-tag>
                  <el-tag
                    v-if="blog.share_state == '转载'"
                    type="info"
                    effect="dark"
                    >转</el-tag
                  >
                </div>

                <div class="about">
                  <i class="el-icon-date">
                    <span> {{ blog.pub_date.slice(0, 16) }}</span>
                  </i>
                  <!-- <i class="el-icon-view">
                  <span>{{ blog.views }}</span>
                </i> -->
                  <i class="iconfont icon-cc-thumbs-up">
                    <span>{{ blog.likes }}</span>
                  </i>
                </div>
              </div>
            </transition-group>
            <p v-if="loading && count > 0 && total > 0" class="loading">
              加载中...
            </p>
            <p v-if="noMore && count > 0 && total > 0" class="noMore">
              没有更多了
            </p>
          </el-col>

          <!-- 右侧信息内容 -->
          <transition appear>
            <el-col
              :span="7"
              class="
                blogself
                hidden-xs-only
                animate__animated animate__fadeInLeft
              "
            >
              <div
                class="self"
                :class="
                  $store.state.blogAbout.mode == 'dark'
                    ? 'dark-sec'
                    : 'light-sec'
                "
              >
                <div class="info">
                  <el-avatar
                    shape="circle"
                    :size="100"
                    fit="cover "
                    src="http://cdn.yuguo.work/self_avatar.jpg"
                  ></el-avatar>
                  <h2>聿 果</h2>
                </div>

                <div
                  class="blog-info"
                  @click="$router.push({ path: '/summary' })"
                >
                  <span class="blog-info-item-title">文章</span>
                  <span class="blog-info-item-data">
                    {{ total }}
                  </span>
                </div>

                <div class="social-info">
                  <i class="iconfont icon-QQ" @click="openQQ"></i>
                  <i class="iconfont icon-wechat-fill" @click="openWechat"></i>
                  <i class="iconfont icon-email-fill" @click="openEmail"></i>
                  <i>
                    <a
                      href="https://github.com/lurve1207/self_blog"
                      target="_blank"
                    >
                      <i class="iconfont icon-github-fill"></i>
                    </a>
                  </i>
                </div>
              </div>

              <div
                class="tags"
                :class="
                  $store.state.blogAbout.mode == 'dark'
                    ? 'dark-sec'
                    : 'light-sec'
                "
              >
                <div class="tags_header clearfix">
                  <i class="el-icon-collection-tag tag">标签</i>
                  <span class="more" @click="$router.push({ path: '/tags' })">
                    more<i class="el-icon-d-arrow-right"></i
                  ></span>
                </div>
                <div class="tags_body">
                  <el-tag
                    v-for="tag in tagListCopy"
                    :key="tag.id"
                    type="success"
                    effect="dark"
                    @click="
                      $router.push({ path: '/tags', query: { tag_id: tag.id } })
                    "
                  >
                    {{ tag.name }}
                  </el-tag>
                </div>
              </div>

              <UserCarousel />
            </el-col>
          </transition>
        </el-row>
      </el-col>

      <el-backtop :visibility-height="800">
        <div class="top"></div>
      </el-backtop>
    </el-row>
  </div>
</template>


<script>
import { mapState } from "vuex";
import UserCarousel from "../components/Main/UserCarousel.vue";
export default {
  name: "UserHome",
  components: { UserCarousel },
  data() {
    return { tagListCopy: [], loading: false, firstTime: true };
  },
  computed: {
    ...mapState({
      count: (state) => state.blogAbout.count,
      total: (state) => state.blogAbout.total,
      showBlogList: (state) => state.blogAbout.blogList,
      tagList: (state) => state.blogAbout.tagList,
    }),
    noMore() {
      return this.showBlogList.length >= this.total;
    },
    disabled() {
      return this.loading || this.noMore;
    },
  },
  mounted() {
    this.load();
  },
  watch: {
    tagList: {
      handler(newVal) {
        this.tagListCopy = newVal;
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    openQQ() {
      this.$notify({
        title: "QQ:2211524637",
        position: "bottom-right",
        showClose: true,
        duration: 0,
        // customClass: "global-notify",
      });
    },
    openWechat() {
      this.$notify({
        title: "微信号:wx2211524637",
        position: "bottom-right",
        showClose: true,
        duration: 0,
        dangerouslyUseHTMLString: true,
        message:
          '<img src="http://cdn.yuguo.work/wechat.jpg" style="width:250px"/>',
      });
    },
    openEmail() {
      this.$notify({
        title: "Email:2211524637@qq.com",
        position: "bottom-right",
        showClose: true,
        duration: 0,
      });
    },
    showBlog(blog_id) {
      this.$router.push({ name: "eachBlog", params: { id: blog_id } });
    },
    async load() {
      this.loading = true;
      console.log("loading....at home..");
      // 首次加载时，会进行loadmore，判断 showBlogList 是否为空
      // 如果为空进行首次加载，每次多加载几条
      let loadConfig;
      if (this.firstTime == true) {
        console.log("第一次加载+++++++----------++++++++++");
        loadConfig = { limit: 10, offset: 0 };
        let result = await this.$store.dispatch("getBlogList", loadConfig);
        if (result.total !== 0 && this.total !== result.total) {
          console.log("======已加载最新博客======");
          this.$store.commit("SET_TOTAL", result.total);
          this.$store.commit("SET_COUNT", 10);
          this.$store.commit("EMPTY_BLOGLIST");
          this.$store.commit("SET_BLOGLIST", result.arts);
        } else {
          console.log("======已保持同步博客======");
        }
        this.firstTime = false;
      } else if (this.total > 0 && this.noMore) {
        this.loading = false;
        return console.log("~~~~~~~已全部加载~~~~~~");
      } else {
        loadConfig = { limit: 5, offset: this.count };
        this.$store.commit("SET_COUNT", this.count + 5);
        let result = await this.$store.dispatch("getBlogList", loadConfig);
        this.$store.commit("INSERT_BLOGLIST", result);
      }

      this.loading = false;
    },
  },
};
</script>

<style scpoed lang="less">
.home {
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0);
  color: #fff;
  .intro {
    background-color: rgba(0, 0, 0, 0);
    margin: 205px 0;
    text-align: center;
    > div {
      letter-spacing: 5px;
      text-indent: 5px;
      h1 {
        font-size: 2rem;
      }
      p {
        margin-top: 30px;
        font-size: 1.2rem;
      }
    }
  }

  .content {
    padding-top: 10px;
    .blogs {
      margin: 0;
      padding: 0;
      height: 100%;
      min-height: 100px;
      .el-card {
        overflow: auto;
        width: 100%;
        height: 100%;
        margin-bottom: 10px;
        border-radius: 10px;
        padding: 10px 20px;

        &:hover {
          box-shadow: 0 3px 12px 0 rgb(0 0 0 / 10%);
        }
        h2 {
          font-size: 16px;
          // color: #fff;
          font-weight: 400;
          line-height: 1.5;
        }
        .tags {
          margin-top: 5px;
        }
        .about {
          margin-top: 3px;
          font-size: 12px;
          i {
            margin-right: 5px;
            font-size: 12px;
            span {
              margin-left: 5px;
            }
          }
        }
      }
      .loading,
      .noMore {
        text-align: center;
        font-size: 14px;
        margin: 10px auto;
      }
    }

    .blogself {
      margin-left: 20px;
      border-radius: 20px;
      .self {
        // background-color: #303133;
        border-radius: 10px;
        overflow: hidden;
        &:hover {
          box-shadow: 0 3px 12px 0 rgb(0 0 0 / 10%);
        }
        .info {
          text-align: center;

          .el-avatar {
            margin: 10px 0;
          }
        }
        .blog-info {
          margin: 10px 0;
          font-size: 1rem;
          text-align: center;
        }
        .social-info {
          display: flex;
          padding: 20px;
          i {
            flex: 1;
            text-align: center;
            cursor: pointer;
            font-size: 26px;
            // color: #fff;
            &:hover {
              color: skyblue;
            }
          }
        }
      }

      .tags {
        margin-top: 20px;
        font-size: 20px !important;
        background-color: #303133;
        border-radius: 10px;
        text-align: center;
        overflow: hidden;
        &:hover {
          box-shadow: 0 3px 12px 0 rgb(0 0 0 / 10%);
        }

        .tags_header {
          padding: 20px 15px;

          .tag {
            font-size: 14px;
            line-height: 1;
            float: left;
          }
          .more {
            float: right;
            font-size: 14px;
            line-height: 1;
            cursor: pointer;
          }
        }
        .tags_body {
          padding: 10px;
          .el-tag:hover {
            transform: scale(1.1);
            transition: all 0.2s ease;
          }
        }
      }
    }

    .el-backtop {
      width: 120px;
      height: 140px;
      background-color: transparent;
      box-shadow: 0 0 0 rgb(0 0 0 / 0);
      .top {
        width: 100%;
        height: 100%;
        background: url("../assets/images/rocket_top.png") no-repeat;
        background-size: contain;
      }
    }
  }

  .el-tag {
    height: 24px;
    font-size: 10px;
    line-height: 22px;
    margin-right: 5px;
    cursor: pointer;
    margin: 5px 10px 5px 0;
  }
}
</style>

