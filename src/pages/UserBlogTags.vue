<template>
  <div
    class="blogtags"
    :class="$store.state.blogAbout.mode"
    :style="{ minHeight: innerHeight + 'px' }"
  >
    <el-row class="row">
      <el-col
        :md="{ span: 16, offset: 4 }"
        :sm="{ span: 18, offset: 3 }"
        :xs="{ span: 22, offset: 1 }"
      >
        <!-- 分类 -->
        <div class="tags">
          <el-card
            class="box-card"
            :class="
              $store.state.blogAbout.mode == 'dark' ? 'dark-sec' : 'light-sec'
            "
            shadow="hover"
          >
            <div class="clearfix header">
              <span class="biaoqian">标签</span>
              <span style="float: right; padding: 3px 0" type="text">
                共
                <span class="tagsCount">{{ tagList.length }} </span>个
              </span>
            </div>
            <div class="body" v-show="tagList.length">
              <span
                class="tag"
                v-for="tag in tagList"
                :key="tag.id"
                @click="showArticlesByTags(tag.id)"
              >
                <el-tag
                  class="eachtag"
                  :class="currentTag == tag.id ? 'isActive' : ''"
                >
                  {{ tag.name }}
                  <span class="count"> {{ tag.art_count }}</span>
                </el-tag>
              </span>
            </div>
          </el-card>
        </div>

        <!-- 博客 -->
        <transition appear>
          <div
            class="blogs animate__animated animate__fadeInLeft"
            v-infinite-scroll="load"
          >
            <UserBlogCard
              v-for="blog in blogListData"
              :key="blog.id"
              :blog="blog"
            />
            <div
              class="other"
              :class="
                $store.state.blogAbout.mode == 'dark'
                  ? 'colorWhite'
                  : 'colorBlack'
              "
            >
              <p v-if="loading && count > 0 && total > 0" class="loading">
                加载中...
              </p>
              <p v-if="noMore && count > 0 && total > 0" class="noMore">
                没有更多了
              </p>
            </div>
          </div>
        </transition>
      </el-col>

      <el-backtop></el-backtop>
    </el-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
import UserBlogCard from "../components/Main/UserBlogCard.vue";
export default {
  name: "UserBlogTags",
  data() {
    return {
      blogListData: [],
      currentTag: 1,

      count: 5,
      offset: 4,
      loading: false,
      total: 0,

      innerHeight: document.body.clientHeight,
    };
  },
  components: { UserBlogCard },
  computed: {
    ...mapState({
      tagList: (state) => state.blogAbout.tagList,
    }),
    noMore() {
      return this.count >= this.total;
    },
    disabled() {
      return this.loading || this.noMore;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      await this.$store.dispatch("getTagList");
      let tag_id = this.$route.query.tag_id
        ? this.$route.query.tag_id
        : this.currentTag;
      this.showArticlesByTags(tag_id);
    },
    async load() {
      if (this.total != 0 && this.noMore) {
        return;
      }
      this.loading = true;
      console.log("loading......");
      // 首次加载时，会进行loadmore，判断 blogListData 是否为空
      // 如果为空进行首次加载，每次多加载几条
      let loadConfig = { isByTag: true, id: this.currentTag };
      if (this.blogListData.length === 0) {
        loadConfig = { ...loadConfig, limit: this.count, offset: 0 };
      } else {
        loadConfig = { ...loadConfig, limit: this.offset, offset: this.count };
        this.count += this.offset;
      }
      let result = await this.$store.dispatch("getBlogList", loadConfig);
      if (loadConfig.offset === 0) {
        this.total = result.total;
        this.blogListData = result.arts;
      } else {
        this.blogListData.push(...result);
      }
      this.loading = false;
    },
    showArticlesByTags(tag_id) {
      this.currentTag = tag_id;
      this.total = 0;
      this.blogListData = [];
      this.load();
    },
  },
};
</script>

<style lang='less' scoped >
.blogtags {
  height: 100%;
  .row {
    padding-top: 20px;
    .tags {
      border-radius: 5px;
      overflow: hidden;
      .box-card {
        .header {
          .biaoqian {
            font-size: 20px;
            font-weight: bold;
            margin: 0 3px;
            color: deepskyblue;
          }
          .tagsCount {
            font-size: 20px;
            font-weight: bold;
            margin: 0 3px;
            color: red;
          }
        }
        .body {
          margin-top: 10px;
          .tag {
            cursor: pointer;

            .eachtag {
              font-size: 13px !important;
              margin: 0 20px 10px 5px;

              &:hover {
                // animation: zoomInUp;
                // animation-duration: 0.5s;
                background-color: pink;
                transition: backgroundColor 0.2s;
              }

              .count {
                font-weight: bold;
                margin-left: 5px;
              }
            }

            .isActive {
              background-color: rgb(190, 231, 173) !important;
              border: 1px solid rgb(190, 231, 173);
            }
          }
        }
      }
    }
    .blogs {
      margin: 10px 0;

      .animate__fadeInLeft {
        animation-duration: 1.2s;
      }
      .other {
        .loading,
        .noMore {
          // color: white;
          text-align: center;
          font-size: 12px !important;
          margin: 10px auto;
        }
      }
      .colorBlack {
        color: black !important;
      }
      .colorWhite {
        color: white !important;
      }
    }
  }
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
</style>
