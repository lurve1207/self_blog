<template>
  <div class="userblogs">
    <el-row>
      <el-col>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item><strong>博客</strong></el-breadcrumb-item>
          <el-breadcrumb-item>赞赏的文章</el-breadcrumb-item>
          <el-divider></el-divider>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <div class="table">
      <el-table
        ref="filterTable"
        :data="showblogs"
        style="width: 100%"
        @row-click="showBlog"
        :header-cell-style="{
          fontWeight: 600,
          color: 'pink',
          fontSize: '15px',
        }"
      >
        <el-table-column prop="title" label="标题" width="250">
        </el-table-column>
        <!-- <el-table-column
          prop="views"
          label="浏览"
          width="70"
          sortable
          align="center"
        >
        </el-table-column> -->
        <el-table-column
          prop="likes"
          label="点赞"
          width="100"
          sortable
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="tag_ids"
          label="标签"
          :filters="tag_ids_filter()"
          :filter-method="tag_ids_filterHandler"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag
              v-for="tag_id in tag_ids_formatter(scope.row.tag_ids)"
              :key="scope.row.id + '-' + tag_id"
              type="'success'"
              disable-transitions
              style="margin-right: 5px"
            >
              {{ tags_idToName[tag_id] }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-row class="bottom">
      <el-pagination
        small
        hide-on-single-page
        layout="total, prev, pager, next, jumper"
        :total="likeList.length"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="pageChange"
      >
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "UserLikes",
  data() {
    return {
      showblogs: [],
      likeList: [],
      pageSize: 7,
      currentPage: 1,
    };
  },
  computed: {
    ...mapState({
      tags_idToName: (state) => state.blogAbout.tags_idToName,
    }),
  },
  mounted() {
    this.getUserlikes();
  },
  methods: {
    showBlog(row, column, event) {
      this.$router.push({ name: "eachBlog", params: { id: row.id } });
    },
    tag_ids_formatter(value) {
      return value.split(",");
    },
    tag_ids_filter() {
      let filter = [];
      Object.keys(this.tags_idToName).forEach((key) => {
        filter.push({
          text: this.tags_idToName[key],
          value: this.tags_idToName[key],
        });
      });
      return filter;
    },
    tag_ids_filterHandler(value, row, column) {
      let result = false;
      const property = column["property"];
      this.tag_ids_formatter(row[property]).forEach((tag_id) => {
        if (this.tags_idToName[tag_id] === value) {
          result = true;
        }
      });
      return result;
    },

    clearFilter() {
      this.$refs.filterTable.clearFilter();
    },

    pageChange(currentPage) {
      this.showblogs = this.likeList.slice(
        (currentPage - 1) * this.pageSize,
        currentPage * this.pageSize
      );
    },

    async getUserlikes() {
      let response = await this.$store.dispatch("getUserlikes");
      this.likeList = response.reverse();
      this.pageChange(1);
    },
  },
};
</script>


<style scoped lang="less">
.userblogs {
  .bottom {
    margin-top: 10px;
  }
}

@media screen and (max-width: 767px) {
  .el-button {
    padding: 5px;
  }
}
</style>