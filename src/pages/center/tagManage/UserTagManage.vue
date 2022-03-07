<template>
  <div class="tagManege">
    <el-row>
      <el-col>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item><strong>标签管理</strong></el-breadcrumb-item>
          <el-divider></el-divider>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm">
      <el-row>
        <el-col :span="10">
          <el-form-item prop="name">
            <el-input v-model="ruleForm.name" placeholder="标签名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item prop="alias">
            <el-input
              v-model="ruleForm.alias"
              placeholder="标签别名"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="1" style="margin-left: 10px">
          <el-button type="success" @click="submitForm('ruleForm')">
            新建标签
          </el-button>
        </el-col>
      </el-row>
    </el-form>

    <div class="table">
      <el-table
        ref="filterTable"
        :data="showTags"
        @cell-mouse-enter="mouseEnter"
        @cell-mouse-leave="mouseLeave"
        @cell-click="mouseClick"
        :cell-style="{ height: '53px' }"
        style="width: 100%"
        :header-cell-style="styleObj"
      >
        <el-table-column prop="name" label="名称">
          <template slot-scope="scope">
            <div
              v-if="
                cellId == '' || cellId !== scope.row.id + '-' + scope.column.id
              "
              class="prop"
            >
              <span style="margin-right: 10px">{{ scope.row.name }}</span>
              <i v-show="rowId == scope.row.id" class="el-icon-edit"></i>
            </div>
            <div v-else class="ipt">
              <el-input
                clearable
                v-autoFocus
                :placeholder="scope.row.name"
                v-model="editTagName"
              >
                <el-button slot="append" @click="updateTag(scope)">
                  确认
                </el-button>
              </el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="alias" label="别名">
          <template slot-scope="scope">
            <div
              v-if="
                cellId == '' || cellId !== scope.row.id + '-' + scope.column.id
              "
              class="prop"
            >
              <span style="margin-right: 10px">{{ scope.row.alias }}</span>
              <i v-show="rowId == scope.row.id" class="el-icon-edit"></i>
            </div>
            <div v-else class="ipt">
              <el-input
                clearable
                v-autoFocus
                :placeholder="scope.row.name"
                v-model="editTagAlias"
              >
                <el-button slot="append" @click="updateTag(scope)">
                  确认
                </el-button>
              </el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              v-show="rowId == scope.row.id"
              @click="handleDelete(scope.$index, scope.row)"
            >
              删除
            </el-button>
            <el-button
              size="mini"
              type="primary"
              v-show="rowId == scope.row.id"
              icon="el-icon-refresh-right"
              @click="iptBlur"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination
      small
      hide-on-single-page
      layout="total, prev, pager, next"
      :total="tagListCopy.length"
      :page-size="pageSize"
      :current-page.sync="currentPage"
      @current-change="pageChange"
    >
    </el-pagination>
  </div>
</template>


<script>
import { mapState } from "vuex";
export default {
  name: "UserTagManage",
  data() {
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("标签名称不能为空"));
      } else if (this.$store.state.blogAbout.tags_nameToId[value]) {
        callback(new Error("标签名称已被使用"));
      } else {
        callback();
      }
    };
    var checkAlias = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("标签别名不能为空"));
      } else {
        let result = this.tagListCopy.some((tagObj) =>
          value == tagObj.alias ? true : false
        );
        if (result) {
          return callback(new Error("标签别名已被使用"));
        } else {
          callback();
        }
      }
    };
    return {
      ruleForm: {
        name: "",
        alias: "",
      },
      rules: {
        name: [{ validator: checkName, trigger: "blur" }],
        alias: [{ validator: checkAlias, trigger: "blur" }],
      },

      editTagName: "",
      editTagAlias: "",

      rowId: 0,
      cellId: "",

      pageSize: 7,
      currentPage: 1,
      showTags: [],

      styleObj: {
        color: "lightgreen",
        fontWeight: 600,
        fontSize: "15px",
      },
    };
  },
  computed: {
    ...mapState({
      tagListCopy: (state) => state.blogAbout.tagList,
    }),
  },
  mounted() {
    this.pageChange(1);
  },
  methods: {
    // 鼠标经过该行显示删除按钮
    mouseEnter(row, column, cell, event) {
      this.rowId = row.id;
    },
    mouseLeave(row, column, cell, event) {
      this.rowId = "";
    },
    mouseClick(row, column, cell, event) {
      this.cellId = row.id + "-" + column.id;
    },

    pageChange(currentPage) {
      this.showTags = this.tagListCopy.slice(
        (currentPage - 1) * this.pageSize,
        currentPage * this.pageSize
      );
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (this.$store.state.userAbout.user.id !== 6) {
          this.$message.warning(
            "对不起，暂未对普通用户开放此功能，博客发布后暂只有博主才能修改"
          );
        } else if (valid) {
          let result = await this.$store.dispatch("addTag", this.ruleForm);
          if (result.data.status == 0) {
            this.$store.commit("SET_TAGLIST", [
              ...this.tagListCopy,
              result.data.data,
            ]);
            this.pageChange(this.currentPage);
            this.$message.success(result.data.message);
          } else {
            this.$message.error(result.data.message);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async handleDelete(index, row) {
      if (this.$store.state.userAbout.user.id !== 6) {
        this.$message.warning(
          "对不起，暂未对普通用户开放此功能，博客发布后暂只有博主才能修改"
        );
      } else {
        let result = await this.$store.dispatch("delTag", row.id);
        if (result.data.status == 0) {
          this.$store.commit(
            "DEL_TAG",
            (this.currentPage - 1) * this.pageSize + index
          );
          this.pageChange(this.currentPage);
          this.$message.success(result.data.message);
        } else {
          this.$message.error(result.data.message);
        }
      }
    },

    updateTag(scopeItem) {
      if (this.$store.state.userAbout.user.id !== 6) {
        this.$message.warning(
          "对不起，暂未对普通用户开放此功能，博客发布后暂只有博主才能修改"
        );
      } else {
        let tagObj = scopeItem.row;
        let toChange;
        let itemName;
        if (scopeItem.column.label == "别名") {
          itemName = "别名";
          toChange = {
            id: tagObj.id,
            name: tagObj.name,
            alias: this.editTagAlias,
          };
        } else {
          itemName = "名称";
          toChange = {
            id: tagObj.id,
            name: this.editTagName,
            alias: tagObj.alias,
          };
        }
        this.$confirm(`此操作将修改该标签${itemName}, 是否继续?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            let result = await this.$store.dispatch("updateTag", toChange);
            if (result.data.status == 0) {
              this.cellId = "";
              this.$store.commit("UPDATE_TAG", {
                index:
                  (this.currentPage - 1) * this.pageSize + scopeItem.$index,
                val: toChange,
              });
              this.pageChange(this.currentPage);
              this.$message.success(result.data.message);
            } else {
              this.$message.error(result.data.message);
            }
            this.editTagName = "";
            this.editTagAlias = "";
          })
          .catch(() => {
            this.$message.info("已取消删除");
          });
      }
    },

    iptBlur() {
      this.editTagName = "";
      this.editTagAlias = "";
      this.cellId = "";
    },
  },
  directives: {
    autoFocus: {
      inserted(element, binding) {
        element.children[0].focus();
      },
    },
  },
};
</script>

<style>
.hhh {
  background-color: rgb(167, 213, 231);
  color: "white";
  font-weight: "bold";
  border: 1px solid #000;
}
</style>