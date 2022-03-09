<template>
  <div class="eachblog" :style="{ minHeight: innerHeight + 'px' }">
    <transition>
      <el-row class="animate__animated animate__fadeInLeftBig">
        <el-col
          class="col typo"
          :md="{ span: 16, offset: 4 }"
          :sm="{ span: 18, offset: 3 }"
          :xs="{ span: 22, offset: 1 }"
        >
          <div class="header">
            <el-avatar :size="40" :src="author.user_pic" circle></el-avatar>

            <i class="el-icon-date">
              <span> {{ currentBlog.pub_date.slice(0, 16) }}</span>
            </i>
            <!-- <i class="el-icon-view">
            <span>{{ currentBlog.views }}</span>
          </i> -->
            <i class="iconfont icon-cc-thumbs-up">
              <span>{{ currentBlog.likes }}</span>
            </i>
          </div>
          <div class="cover_img">
            <img :src="currentBlog.cover_img" alt="" />
          </div>
          <div class="body">
            <el-tag>
              {{ currentBlog.share_state }}
            </el-tag>
            <h2>{{ currentBlog.title }}</h2>
            <div v-html="currentBlog.content_html"></div>
          </div>
        </el-col>

        <el-col
          class="col typo"
          :md="{ span: 16, offset: 4 }"
          :sm="{ span: 18, offset: 3 }"
          :xs="{ span: 22, offset: 1 }"
        >
          <div class="comment">
            <div class="comm_header">
              <span class="comm_count"> {{ allComments.length }}</span>
              <span class="comm_title">评论</span>
            </div>
            <el-tabs v-model="activeName" @tab-click="sortComms">
              <el-tab-pane label="按热度排列" name="likes"> </el-tab-pane>
              <el-tab-pane label="按时间排列" name="time"> </el-tab-pane>
            </el-tabs>

            <UserCommSend
              :blog_id="currentBlog.id"
              :blog_title="currentBlog.title"
              :blog_commentable="currentBlog.commentable"
              style="display: block"
            />
            <UserFirstComm
              v-for="ele in commentsCopy"
              :key="ele.firstComm.id"
              :ele="ele"
              :blog_id="currentBlog.id"
              :blog_title="currentBlog.title"
              :blog_commentable="currentBlog.commentable"
            />
          </div>
        </el-col>

        <div class="toolbar" @click="thumbsUp">
          <transition appear>
            <el-tooltip
              style="margin: 0 4px"
              effect="light"
              :content="thumbsFlag ? '已点赞' : '未点赞'"
              placement="right"
            >
              <i
                v-if="!thumbsFlag"
                class="iconfont icon-cc-thumbs-up animate__heartBeat"
              ></i>
              <i v-else class="iconfont icon-thumbs"></i>
            </el-tooltip>
          </transition>
        </div>
        <el-backtop :visibility-height="0" :right="80"> </el-backtop>
      </el-row>
    </transition>
  </div>
</template>

<script>
import UserCommSend from "../components/Main/UserCommSend.vue";
import UserFirstComm from "../components/Main/UserFirstComm.vue";
export default {
  name: "UserBlog",
  components: { UserCommSend, UserFirstComm },
  data() {
    return {
      currentBlog: { pub_date: "" }, //当前博客
      author: {}, //当前博客作者
      thumbsFlag: "", //用户是否为当前博客点赞
      allComments: [], //当前博客的所有评论
      commentsCopy: [],
      comm_content: "", // 评论框输入内容
      activeName: "likes", // 评论排序标准
      innerHeight: document.body.clientHeight,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.$bus.$on("openReplyBox", this.openReplyBox);
      this.$bus.$on("delComm", this.delComm);
      this.$bus.$on("addComm", this.addComm);
      await this.findCurrentBlog();
      await this.findAuthor();
      if (this.$store.state.userAbout.isLogin === true) {
        this.findAbout();
      }
      await this.findComment();
    },
    async findAuthor() {
      let result = await this.$store.dispatch(
        "getAuthor",
        this.currentBlog.author_id
      );
      if (result.data.status == 0) {
        this.author = result.data.data;
      } else {
        this.$message.error(result.data.message);
      }
    },
    async findAbout() {
      let result = await this.$store.dispatch("findAbout", {
        id: this.$route.params.id,
        type: "art",
      });
      this.thumbsFlag = result;
    },
    async findComment() {
      console.log("文章id", this.$route.params.id);
      let result = await this.$store.dispatch(
        "getComment",
        parseInt(this.$route.params.id)
      );
      if (result.data.status == 0) {
        this.allComments = result.data.data;
        this.commentsCopy = this.OrderComments();
        this.sortComms();
      }
    },
    async thumbsUp() {
      if (this.$store.state.userAbout.isLogin !== true) {
        this.$message.info("需要登录才能赞赏哟！");
      } else if (this.currentBlog.appreciationable == 0) {
        this.$message.info("文章主人未开启赞赏权限！");
      } else {
        let result = await this.$store.dispatch(
          "likeArticle",
          this.currentBlog.id
        );
        if (result.data.status == 0) {
          this.thumbsFlag = result.data.data.is_like == 1 ? true : false;
          if (result.data.data.is_like == 1) {
            this.$message.success(result.data.message);
          } else {
            this.$message.info(result.data.message);
          }
        } else {
          this.$message.error(result.data.message, "失败");
        }
        this.findCurrentBlog();
      }
    },
    OrderComments() {
      let done = [];
      let arr = [];
      let idx = 0;

      this.allComments.forEach((comm) => {
        if (comm.is_delete == 1) {
          done.push(-1);
        } else {
          if (comm.answer_art_id == comm.art_id) {
            let ids = [];
            ids.push(comm.id);
            arr.push({ firstComm: comm, ids, subComms: [] });
            done.push(comm.id);
          }
        }
      });

      while (done.length < this.allComments.length) {
        let comm = this.allComments[idx];
        if (comm.is_delete == 1) {
          done.push(-1);
        } else {
          if (comm.answer_comm_id !== -1) {
            for (let obj of arr) {
              if (obj["ids"].indexOf(comm.answer_comm_id) !== -1) {
                obj["subComms"].push(comm);
                obj["ids"].push(comm.id);
                done.push(comm.id);
                break;
              }
            }
          }
        }
        idx++;
        if (idx == this.allComments.length) {
          idx = 0;
        }
      }
      return arr;
    },
    async delComm(comm_id) {
      let backUp = JSON.parse(JSON.stringify(this.allComments));
      let idSet = [];
      for (let comm of this.allComments) {
        idSet.push(comm.id);
        if (comm.id == comm_id) {
          comm.is_delete = 1;
        }
      }

      this.commentsCopy = this.OrderComments();
      this.commentsCopy.forEach((ele) => {
        ele.ids.forEach((id) => {
          let idx = idSet.indexOf(id);
          if (idx !== -1) {
            idSet.splice(idx, 1);
          }
        });
      });

      console.log(idSet);

      ////剩下的就是要删除的id

      let result = await this.$store.dispatch("delComm", idSet);
      console.log(result.data.message);
      if (result.data.status == 0) {
        this.sortComms();
        console.log("结束了");
        this.$message.success(result.data.message);
      } else {
        this.$message.error(result.data.message);
        this.allComments = backUp;
        this.commentsCopy = this.OrderComments();
        this.sortComms();
      }
    },
    addComm(data) {
      let comm = data.comm;
      this.allComments.push(comm);
      if (data.comm_box_key == undefined) {
        let ids = [];
        ids.push(comm.id);
        this.commentsCopy.unshift({ firstComm: comm, ids, subComms: [] });
      } else {
        let firstComm_id = data.comm_box_key.split("-")[1];
        this.commentsCopy.forEach((ele) => {
          if (ele.firstComm.id == firstComm_id) {
            ele["subComms"].unshift(comm);
            ele["ids"].push(comm.id);
          }
        });
      }
    },
    sortComms() {
      if (this.activeName == "likes") {
        this.commentsCopy.sort((a, b) => b.firstComm.likes - a.firstComm.likes);
      }
      if (this.activeName == "time") {
        this.commentsCopy.sort(
          (a, b) =>
            new Date(b.firstComm.pub_time).valueOf() -
            new Date(a.firstComm.pub_time).valueOf()
        );
      }
    },
    openReplyBox(box) {
      document.querySelectorAll(".firstComm .comment-send").forEach((ele) => {
        if (ele.getAttribute("box-key") == box) {
          ele.setAttribute("style", "display:block");
          ele.children[1].focus();
        } else {
          ele.setAttribute("style", "display:none");
        }
      });
    },
    async findCurrentBlog() {
      // 先在已加载的博客列表中找
      let isLoaded = false;
      this.$store.state.blogAbout.blogList.forEach((blog) => {
        if (blog.id == this.$route.params.id) {
          isLoaded = true;
          this.currentBlog = blog;
        }
      });
      // 没有则发请求获取文章
      if (!isLoaded) {
        let result = await this.$store.dispatch(
          "getArticleById",
          this.$route.params.id
        );
        if (result.data.status == 0) {
          this.currentBlog = result.data.data;
        } else {
          this.$message.error(result.data.message);
        }
      }
    },
  },
  beforeRouteLeave(to, from, next) {
    this.$bus.$off("openReplyBox"); //解绑该组件所用到的自定义事件
    this.$bus.$off("delComm");
    this.$bus.$off("addComm");
    next();
  },
};
</script>

<style lang="less" scoped>
@import "../assets/css/typo.css";

.eachblog {
  height: 100%;
  padding-top: 20px;
  .col {
    margin-bottom: 20px;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 10px;
    .header {
      display: flex;
      align-items: center;
      padding: 14px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.6);
      border-bottom: 1px solid #ccc;
      i {
        margin: 5px;
        span {
          margin-left: 5px;
        }
      }
    }

    .cover_img {
      padding: 14px;
      border-bottom: 1px solid #ccc;
      img {
        border-radius: 6px;
      }
    }

    .body {
      padding: 14px;
    }

    .comment {
      padding: 14px;
      .comm_header {
        margin-bottom: 20px;
        font-size: 18px;
        color: #222;
        .comm_count {
          margin-right: 10px;
        }
      }

      .comm-send {
        margin: 20px 0;
        display: none;
        .avatar {
          height: 65px;
          transform: translateY(-10px);
        }
        textarea {
          width: 80%;
          font-size: 12px;
          background-color: #f4f5f7;
          border: 1px solid #e5e9ef;
          border-radius: 4px;
          color: #555;
          height: 65px;
          padding: 5px 10px;
          margin-right: 10px;
          outline: none;
          resize: none;
          &:focus {
            border-color: #00a1d6;
            background-color: #fff;
          }
        }
        button {
          width: 70px;
          height: 64px;
          padding: 4px 15px;
          font-size: 14px;
          color: #fff;
          border-radius: 4px;
          text-align: center;
          min-width: 60px;
          vertical-align: top;
          cursor: pointer;
          background-color: #00a1d6;
          border: 1px solid #00a1d6;
          transition: 0.1s;
          user-select: none;
          outline: none;
        }
      }
    }
  }
}

.toolbar {
  overflow: hidden;
  position: fixed;
  right: 80px;
  bottom: 80px;
  width: 40px;
  height: 40px;
  padding-top: 5px;
  border-radius: 10px 10px 0 0;
  // border: 1px solid #000;
  // border-bottom: 0;
  background-color: #fff;
  color: #409eff;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  box-shadow: 0 0 6px rgb(0 0 0 / 12%);
  cursor: pointer;
  &:hover {
    background-color: skyblue;
  }
  z-index: 5;
  .iconfont {
    flex: 100%;
    font-size: 18px !important;
    text-align: center;
  }
}

.el-backtop {
  border-radius: 0;
  &:hover {
    background-color: skyblue;
  }
}
</style>