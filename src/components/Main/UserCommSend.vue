<template>
  <div class="comment-send" :box-key="comm_box_key" ref="send">
    <div class="avatar">
      <el-avatar
        :size="48"
        :src="$store.state.userAbout.user.user_pic"
        circle
      ></el-avatar>
    </div>
    <textarea
      cols="80"
      ref="textarea"
      placeholder="请输入留言"
      v-model="comm_content"
    />
    <button type="primary" @click="addComment">发表评论</button>
  </div>
</template>

<script>
export default {
  name: "UserCommSend",
  props: ["comm_box_key", "blog_id", "blog_title", "blog_commentable"],
  data() {
    return {
      comm_content: "",
      commented_commId: "",
      commented_username: "",
    };
  },
  mounted() {
    this.$bus.$on("reply", this.getCommInfo);
  },
  methods: {
    async addComment() {
      if (this.$store.state.userAbout.isLogin !== true) {
        this.$message.info("需要登录才能发表评论哟！");
      } else if (this.blog_commentable == 0) {
        this.$message.info("文章主人未开启评论权限！");
      } else {
        if (this.comm_content.trim() !== "") {
          //判断是 评论文章 还是 回复评论
          console.log("blog_id", this.blog_id);
          let comm_info = {
            username: this.$store.state.userAbout.user.username,
            content: this.comm_content,
            art_id: this.blog_id,
          };
          if (
            this.$refs.send.parentNode
              .getAttribute("class")
              .indexOf("sub_Comm") !== -1
          ) {
            console.log("回复评论");
            comm_info.answer_art_id = parseInt(-1);
            comm_info.answer_art_title = "null";
            comm_info.answer_comm_id = this.commented_commId;
            comm_info.answer_comm_username = this.commented_username;
          } else {
            console.log("添加评论");
            comm_info.answer_art_id = this.blog_id;
            comm_info.answer_art_title = this.blog_title;
            comm_info.answer_comm_id = parseInt(-1);
            comm_info.answer_comm_username = "null";
          }
          let result = await this.$store.dispatch("addComment", comm_info);
          console.log(result.data.message);
          if (result.data.status == 0) {
            this.$bus.$emit("addComm", {
              comm_box_key: this.comm_box_key,
              comm: result.data.data,
            });
            this.$refs.textarea.value = "";
          } else {
            this.$message.error(result.data.message);
          }
          // console.log(result);
        }
      }
    },
    getCommInfo(data) {
      this.commented_commId = data.id;
      this.commented_username = data.username;
      this.$refs.textarea.placeholder = "对 " + data.username + " 说点啥吧：";
    },
  },
  beforeDestroy() {
    this.$bus.$off("reply");
  },
};
</script>

<style lang="less" scoped>
.comment-send {
  display: flex;
  margin: 20px 0;
  display: none;
  .avatar {
    display: inline-block;
    margin-right: 10px;
    height: 65px;
    transform: translateY(-10px);
  }
  textarea {
    width: 76%;
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
</style>