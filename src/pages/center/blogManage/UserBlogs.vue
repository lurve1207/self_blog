<template>
  <div class="userblogs">
    <el-row>
      <el-col>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item><strong>博客</strong></el-breadcrumb-item>
          <el-breadcrumb-item>我的博客</el-breadcrumb-item>
          <el-divider></el-divider>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <div class="table">
      <el-table
        ref="filterTable"
        :data="showblogs"
        :header-cell-style="{
          fontWeight: 600,
          color: 'skyblue',
          fontSize: '15px',
        }"
        style="width: 100%"
      >
        <el-table-column prop="title" label="标题" width="250">
        </el-table-column>
        <el-table-column
          class="pub"
          prop="pub_date"
          :formatter="pub_date_formatter"
          label="发布日期"
          stripe
          sortable
          max-height="250"
          width="180"
          column-key="pub_date"
          :filters="pub_date_filter()"
          :filter-method="pub_date_filterHandler"
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
        <el-table-column label="操作" width="210">
          <template slot-scope="scope">
            <el-button size="mini" @click="showBlog(scope.row)">查看</el-button>
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-row class="bottom">
      <el-col :xs="{ span: 24 }" :md="{ span: 12 }">
        <el-button @click="resetDateFilter">清除日期过滤器</el-button>
        <el-button @click="clearFilter">清除所有过滤器</el-button></el-col
      >
      <el-col :xs="{ span: 24 }" :md="{ span: 12 }">
        <el-pagination
          small
          hide-on-single-page
          layout="total, prev, pager, next, jumper"
          :total="blogListCopy.length"
          :page-size="pageSize"
          :current-page="currentPage"
          @current-change="pageChange"
        >
        </el-pagination
      ></el-col>
    </el-row>
  </div>
</template>

<script>
import { Loading } from "element-ui";
import { mapState } from "vuex";
export default {
  name: "UserBlogs",
  data() {
    return {
      showblogs: [],
      blogListCopy: [],
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
    this.getUserblogs();
  },
  methods: {
    async getUserblogs() {
      let loadingInstance = Loading.service({
        target: document.body,
        fullscreen: true,
        lock: true,
        text: "正在拼命加载...",
        spinner: "el-icon-loading",
      });
      let result = await this.$store.dispatch("getUserblogs");
      loadingInstance.close();
      this.blogListCopy = result.reverse();
      this.pageChange(1);
    },

    showBlog(row, column, event) {
      console.log(row.id);
      this.$router.push({ name: "eachBlog", params: { id: row.id } });
    },
    pub_date_formatter(row, column) {
      return row.pub_date.slice(0, 16);
    },
    pub_date_filter() {
      let dates = [];
      this.blogListCopy.forEach((blog) => {
        dates.push(blog.pub_date.slice(0, 10));
      });
      let set = new Set(dates);
      dates = [...set];
      let filter = [];
      dates.forEach((date) => {
        filter.push({ text: date, value: date });
      });
      return filter;
    },
    pub_date_filterHandler(value, row, column) {
      const property = column["property"];
      return row[property].slice(0, 10) === value;
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
    resetDateFilter() {
      this.$refs.filterTable.clearFilter("pub_date");
    },
    clearFilter() {
      this.$refs.filterTable.clearFilter();
    },

    handleEdit(index, row) {
      this.$message.warning(
        "对不起，暂未对普通用户开放此功能，博客发布后暂只有博主才能修改"
      );
    },
    async handleDelete(index, row) {
      let result = await this.$store.dispatch("delArticle", row.id);
      if (result.data.status == 0) {
        let idx;
        this.blogListCopy.some((ele, index) => {
          idx = index;
          return ele.id == row.id ? true : false;
        });
        this.blogListCopy.splice(idx, 1);
        this.$message.success(result.data.message);
        this.pageChange(this.currentPage);
      } else {
        this.$message.error(result.data.message);
      }
    },

    pageChange(currentPage) {
      this.showblogs = this.blogListCopy.slice(
        (currentPage - 1) * this.pageSize,
        currentPage * this.pageSize
      );
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