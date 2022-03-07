<template>
  <el-row
    class="blogcard"
    :class="$store.state.blogAbout.mode == 'dark' ? 'dark-sec' : 'light-sec'"
  >
    <el-col :md="{ span: 19 }" :xs="{ span: 24 }" class="words">
      <h2 @click="showBlog">{{ blog.title }}</h2>
      <div class="tags">
        <el-tag
          v-for="tag_id in blog.tag_ids.split(',')"
          :key="blog.id + '-' + tag_id"
          type="success"
          effect="dark"
        >
          {{ $store.state.blogAbout.tags_idToName[tag_id] }}
        </el-tag>
        <el-tag v-if="blog.share_state == '转载'" type="info" effect="dark">
          转
        </el-tag>
      </div>

      <div class="about" @click="showBlog">
        <i class="el-icon-date">
          <span> {{ blog.pub_date.slice(0, 16) }}</span>
        </i>
        <!-- <i class="el-icon-view">
          <span>&nbsp;{{ blog.views }}&nbsp;</span>
        </i> -->
        <i class="iconfont icon-cc-thumbs-up">
          <span>&nbsp;{{ blog.likes }}</span>
        </i>
      </div>
    </el-col>
    <el-col :span="5" class="pic hidden-md-and-down">
      <img :src="blog.cover_img" @click="showBlog" />
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "UserBlogCard",
  props: ["blog"],
  methods: {
    showBlog() {
      this.$router.push({ name: "eachBlog", params: { id: this.blog.id } });
    },
  },
};
</script>

<style lang="less" scoped>
.blogcard {
  border-radius: 8px;
  margin: 10px 0;
  padding: 10px;
  max-height: 135px;

  &:hover {
    box-shadow: 0 3px 12px 0 rgb(0 0 0 / 10%);
  }

  .words {
    border-radius: 10px;
    padding-left: 10px;
    box-sizing: border-box;
    cursor: pointer;
    h2 {
      font-size: 16px;
      // color: #fff;
      font-weight: 400;
      line-height: 1.5;
    }

    .tags {
      margin: 10px 0;
      .el-tag {
        height: 24px;
        font-size: 13px;
        line-height: 22px;
        margin-right: 5px;
        cursor: pointer;
        margin: 5px 10px 5px 0;
      }
    }
    .about {
      margin-top: 5px;
      font-size: 13px;
      // color: #eee;
      i {
        margin: 0 7px;
        font-size: 13px;
        span {
          margin-left: 5px;
        }
      }
    }
  }

  .pic {
    border-radius: 10px;
    height: 100%;
    img {
      max-width: 100%;
      max-height: 115px;
      vertical-align: middle;
    }
  }
}
</style>