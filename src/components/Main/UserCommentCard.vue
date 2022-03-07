<template>
  <div class="eachComment" :style="`margin-bottom:${margin_bottom}px`">
    <div v-if="!blogManage" class="avatar">
      <el-avatar :size="avaterSize" :src="author.user_pic" circle></el-avatar>
    </div>
    <div class="comm_body">
      <div v-if="avaterSize >= 36" class="mainComm">
        <span class="username"> {{ comm.username }}</span>
        <div class="content">{{ comm.content }}</div>
      </div>
      <div v-else class="subComm">
        <span class="username">{{ comm.username }}</span>
        <span ref="huifu" class="huifu"> 回复 </span>
        <span ref="desc" class="username" :class="titleClass" @click="showBlog">
          @{{ commented_username }}
        </span>
        <span class="content">: {{ comm.content }}</span>
      </div>

      <div class="about">
        <span class="time">{{ comm.pub_time.slice(0, 16) }}</span>
        <span class="like_about">
          <i
            v-if="!thumbsFlag"
            class="iconfont icon-cc-thumbs-up"
            @click="thumbsUp"
          ></i>
          <i v-else class="iconfont icon-thumbs" @click="thumbsUp"></i>
          <span class="likes">{{ comm.likes }}</span>
        </span>

        <span v-if="!blogManage" class="reply" @click="openReplyBox">回复</span>
        <span
          class="del"
          v-if="author.id == $store.state.userAbout.user.id && !blogManage"
          @click="delComm"
          >删除</span
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserCommentCard",
  props: [
    "comm",
    "blog_id",
    "comm_box_key",
    "avaterSize",
    "blogManage",
    "userComms",
    "margin_bottom",
  ],
  data() {
    return {
      author: {},
      commented_username: {},
      thumbsFlag: false,
      titleClass: "",
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      await this.findAuthor();
      if (this.$store.state.userAbout.isLogin === true) {
        this.findAbout();
      }
    },
    async findAuthor() {
      if (this.blogManage !== true) {
        let author = await this.$store.dispatch("getAuthor", this.comm.user_id);
        if (author.data.status == 0) {
          this.author = author.data.data;
        } else {
          this.$message.error(author.data.message);
        }
      }

      if (this.avaterSize <= 24 || this.blogManage == true) {
        if (this.blogManage == true) {
          if (this.comm.answer_art_id !== -1) {
            this.$refs.huifu.innerHTML = " 评论 ";
            this.$refs.desc.innerHTML = this.comm.answer_art_title;
            this.titleClass = "title";
          } else {
            this.commented_username = this.comm.answer_comm_username;
          }
        } else {
          this.commented_username = this.comm.answer_comm_username;
        }
      }
    },
    async findAbout() {
      let result = await this.$store.dispatch("findAbout", {
        id: this.comm.id,
        type: "comm",
      });
      this.thumbsFlag = result;
    },
    async thumbsUp() {
      if (this.$store.state.userAbout.isLogin !== true) {
        this.$message.info("需要登录才能赞赏哟！");
      } else {
        let result = await this.$store.dispatch("likeComment", this.comm.id);
        if (result.data.status == 0) {
          this.thumbsFlag = result.data.data.is_like == 1 ? true : false;
          this.comm.likes = result.data.data.likes;
        } else {
          this.$message.error(result.data.message, "失败");
        }
      }
    },
    async delComm() {
      this.$confirm("若该评论有子评论的话也会随之一起删除，是否继续?", "提示", {
        type: "warning",
      })
        .then(async () => {
          this.$bus.$emit("delComm", this.comm.id);
        })
        .catch(() => {});
    },
    openReplyBox() {
      this.$bus.$emit("openReplyBox", this.comm_box_key);
      this.$bus.$emit("reply", {
        id: this.comm.id,
        username: this.comm.username,
      });
    },
    showBlog(e) {
      if (e.target.getAttribute("class").indexOf("title") !== -1) {
        this.$router.push({
          name: "eachBlog",
          params: { id: this.comm.art_id },
        });
      }
    },
  },
};
</script>
<style lang="less" scoped>
.eachComment {
  display: flex;
  margin-bottom: 5px;
  .avatar {
    display: inline-block;
    height: 48px;
    margin-right: 10px;
  }
  .comm_body {
    flex: 1;
    .username {
      font-size: 13px;
      color: #6d757a;
      vertical-align: middle;
      font-weight: bold;
      padding-bottom: 4px;
      cursor: pointer;
    }
    .huifu,
    .content {
      box-sizing: content-box;
      font-size: 14px;
      line-height: 20px;
      padding: 2px 0;
      margin: 0;
      text-shadow: none;
      overflow: hidden;
      word-wrap: break-word;
      word-break: break-word;
      white-space: pre-wrap;
      border: 0;
      vertical-align: baseline;
      font-family: "Microsoft YaHei", Arial, Helvetica, sans-serif;
      color: #222;
      font-weight: normal;
    }
    .subComm {
      .content {
        position: relative;
        top: 1px;
        margin-left: 16px;
      }
    }

    .about {
      margin-top: 6px;
      color: #99a2aa;
      .time {
        margin-right: 15px;
        line-height: 14px;
      }
      .like_about {
        .iconfont {
          font-size: 13px;
          cursor: pointer;
        }
        .icon-thumbs {
          color: #409eff !important;
        }
        .likes {
          margin-left: 8px;
          cursor: normal;
        }
      }
      .reply,
      .del {
        margin-left: 10px;
        padding: 3px;
        border-radius: 5px;
        cursor: pointer;
        &:hover {
          color: rgb(78, 188, 231);
          background-color: #eee;
        }
      }
    }
  }
}
.title {
  color: rgb(46, 174, 225) !important;
}
</style>