<template>
  <div
    class="summary"
    :class="$store.state.blogAbout.mode == 'dark' ? 'dark-sec' : 'light-sec'"
    :style="{ height: innerHeight + 'px' }"
  >
    <transition appear>
      <el-row
        :gutter="20"
        type="flex"
        justify="center"
        class="animate__animated animate__fadeInDownBig"
      >
        <el-col :span="2" :offset="8" class="hidden-sm-and-down">
          <div class="radio">
            <el-radio-group v-model="reverse">
              <el-radio :label="true">倒序</el-radio>
              <br />
              <el-radio :label="false">正序</el-radio>
            </el-radio-group>
          </div>
        </el-col>
        <el-col
          :md="{ span: 12, offset: 0 }"
          :sm="{ span: 14, offset: 10 }"
          :xs="{ span: 20, offset: 4 }"
        >
          <el-timeline :reverse="reverse" v-if="showList.length">
            <el-timeline-item
              v-for="blog in showList"
              :key="blog.id"
              :timestamp="blog.pub_date.slice(0, blog.pub_date.length - 7)"
              placement="bottom"
              icon="el-icon-star-off"
              type="primary"
              size="normal"
            >
              <div class="card">
                <router-link
                  :to="{ name: 'eachBlog', params: { id: blog.id } }"
                  :class="
                    $store.state.blogAbout.mode == 'dark'
                      ? 'lightColor'
                      : 'darkColor'
                  "
                >
                  <span>{{ blog.title }}</span>
                </router-link>
                <span class="tags">
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
                  >
                    转
                  </el-tag>
                </span>
              </div>
            </el-timeline-item>
            <el-timeline-item>
              <span style="color: skyblue">共计{{ total }}篇文章</span>
            </el-timeline-item>
          </el-timeline>
          <el-pagination
            small
            background
            hide-on-single-page
            layout="prev, pager, next"
            :page-size="pageSize"
            :total="total"
            @current-change="pageChange"
          >
          </el-pagination>
        </el-col>
      </el-row>
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "UserSummary",
  data() {
    return {
      reverse: false,
      showList: [],
      pageSize: 7,
      innerHeight: window.innerHeight,

      total: 0,
    };
  },
  computed: {
    ...mapState({
      blogList: (state) => state.blogAbout.blogList,
    }),
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.pageChange(1);
    },
    async pageChange(currentPage) {
      let result = await this.$store.dispatch("getBlogList", {
        limit: this.pageSize,
        offset: (currentPage - 1) * this.pageSize,
      });
      if (currentPage == 1) {
        this.total = result.total;
        this.showList = result.arts;
      } else {
        this.showList = result;
      }
      console.log(result, "==========");
      console.log("这是发送请求获取的", currentPage);
    },
  },
};
</script>

<style scoped lang="less">
.summary {
  padding-top: 20px;
  // color: white !important;
  .el-radio {
    margin-bottom: 5px;
  }
  .el-timeline {
    .el-timeline-item {
      /deep/ .el-timeline-item__tail {
        border-left: 2px solid #424242;
      }
      /deep/ .el-timeline-item__node {
        background-color: #424242;
      }
      .card {
        cursor: pointer;
        span {
          // color: white !important;
          margin-right: 10px;
        }
        .tags {
          .el-tag {
            height: 20px;
            line-height: 20px;
            cursor: pointer;
            margin: 0 5px;
          }
        }
      }
      .lightColor {
        color: white;
      }
      .darkColor {
        color: black;
      }
    }
  }

  .el-timeline-item__icon::before {
    font-size: 20px !important;
    color: red !important;
  }
}
</style>