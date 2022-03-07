<template>
  <div class="usercomments" style="height: 600px; width: 600px">
    <el-row>
      <el-col>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item><strong>博客</strong></el-breadcrumb-item>
          <el-breadcrumb-item>我的评论</el-breadcrumb-item>
          <el-divider></el-divider>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <UserCommentCard
      v-for="comm in userComms"
      :key="comm.id"
      :blog_id="999"
      :comm="comm"
      :blogManage="true"
      :userComms="userComms"
      :margin_bottom="20"
    />
  </div>
</template>

<script>
import { Loading } from "element-ui";
import UserCommentCard from "../../../components/Main/UserCommentCard.vue";
export default {
  name: "UserComments",
  components: { UserCommentCard },
  data() {
    return {
      userComms: [],
    };
  },
  mounted() {
    this.init();
  },

  methods: {
    async init() {
      let loadingInstance = Loading.service({
        target: document.body,
        fullscreen: true,
        lock: true,
        text: "正在拼命加载...",
        spinner: "el-icon-loading",
      });

      let result = await this.$store.dispatch("getUserComments");
      loadingInstance.close();
      this.userComms = result;
    },
  },
};
</script>


<style lang="less" scoped>
</style>