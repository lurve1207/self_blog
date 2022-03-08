<template>
  <div class="firstComm" style="padding: 15px 0">
    <UserCommentCard
      :comm="ele.firstComm"
      :blog_id="blog_id"
      :comm_box_key="comm_box_key"
      :avaterSize="48"
    />
    <div class="sub_Comm">
      <UserCommentCard
        v-for="comm in subCommsShow"
        :key="ele.firstComm.id + '-' + comm.id"
        :comm="comm"
        :blog_id="blog_id"
        :comm_box_key="comm_box_key"
        :avaterSize="24"
        style="padding: 10px 0"
      />
      <el-pagination
        small
        hide-on-single-page
        layout="total, prev, pager, next"
        :total="ele.subComms.length"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="pageChange"
        prev-text="上一页"
        next-text="下一页"
      >
      </el-pagination>
      <UserCommSend
        :comm_box_key="comm_box_key"
        :blog_id="blog_id"
        :blog_title="blog_title"
        :blog_commentable="blog_commentable"
      />
    </div>
  </div>
</template>

<script>
import UserCommentCard from "./UserCommentCard.vue";
import UserCommSend from "./UserCommSend.vue";
export default {
  name: "UserFirstComm",
  props: ["ele", "blog_id", "blog_title", "blog_commentable"],
  components: { UserCommentCard, UserCommSend },
  data() {
    return {
      pageSize: 6,
      currentPage: 1,
      subCommsShow: [],
    };
  },

  computed: {
    comm_box_key() {
      return this.blog_id + "-" + this.ele.firstComm.id;
    },
  },
  watch: {
    ele: {
      handler(newVal) {
        this.subCommsShow = newVal.subComms.slice(
          (this.currentPage - 1) * this.pageSize,
          this.currentPage * this.pageSize
        );
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    pageChange(currentPage) {
      this.subCommsShow = this.ele.subComms.slice(
        (currentPage - 1) * this.pageSize,
        currentPage * this.pageSize
      );
    },
  },
  mounted() {
    this.pageChange(1);
  },
};
</script>

<style lang="less" scoped>
.firstComm {
  border-bottom: 1px solid #e5e9ef;
  .sub_Comm {
    padding-left: 60px;
  }
}
</style>
