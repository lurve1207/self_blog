<template>
  <div
    class="links"
    :class="$store.state.blogAbout.mode"
    :style="{ minHeight: innerHeight + 'px' }"
  >
    <el-row>
      <el-col
        :md="{ span: 16, offset: 4 }"
        :sm="{ span: 18, offset: 3 }"
        :xs="{ span: 22, offset: 1 }"
      >
        <el-card
          shadow="hover"
          :class="
            $store.state.blogAbout.mode == 'dark' ? 'dark-sec' : 'light-sec'
          "
        >
          <h2>添加友链~</h2>
          <div class="myDescription">
            <div>名称：聿果的个人博客</div>
            <div>
              简介：这是一篇简单的个人博客，也是一个我记录笔记的地方，欢迎各位到访
            </div>
            <div>
              头像：<a
                href="http://cdn.yuguo.work/self_avatar.jpg"
                target="_blank"
                >http://cdn.yuguo.work/self_avatar.jpg</a
              >
            </div>
            <div>
              博客：<a href="http://8.134.52.212" target="_blank"
                >http://8.134.52.212</a
              >
            </div>
          </div>
          <br />
          <h2>
            如果要和本站交换友链，请按照以下格式发送到
            <ins>2211524637@qq.ocm</ins>，或在这里
            <el-button
              type="primary"
              icon="el-icon-edit"
              style="padding-left: 15px !important"
              @click="dialogFormVisible = true"
              >添加友链
            </el-button>
            填写表格 如果我没有回复的话，可以直接滴滴QQ，一般都是我没看见
          </h2>

          <el-dialog
            title="新增友链"
            :visible.sync="dialogFormVisible"
            width="80%"
          >
            <el-form
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              label-width="80px"
            >
              <el-row>
                <el-col :span="16" :sm="{ span: 16 }" :xs="{ span: 24 }">
                  <el-form-item
                    label="友链名称"
                    prop="name"
                    :label-width="formLabelWidth"
                  >
                    <el-input
                      v-model="ruleForm.name"
                      autocomplete="off"
                    ></el-input> </el-form-item
                ></el-col>
              </el-row>

              <el-form-item
                label="头像地址"
                prop="avatar"
                :label-width="formLabelWidth"
              >
                <el-input
                  v-model="ruleForm.avatar"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="博客地址"
                prop="link"
                :label-width="formLabelWidth"
              >
                <el-input v-model="ruleForm.link" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item
                label="友链描述"
                prop="desc"
                :label-width="formLabelWidth"
              >
                <el-input v-model="ruleForm.desc" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
              <el-button type="primary" @click="submitForm('ruleForm')"
                >确 定</el-button
              >
            </div>
          </el-dialog>

          <p class="myDescription">
            友链信息展示需要，你的信息格式要包含：名称、介绍、链接、头像，博主经过筛选后，会在下方以卡片的形式展示出来
          </p>
          <br />
        </el-card>
        <div class="linkbox">
          <UserLinkCard v-for="link in linkList" :key="link.id" :link="link" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import UserLinkCard from "../components/Main/UserLinkCard.vue";
import { mapState } from "vuex";
export default {
  name: "UserLinks",
  components: { UserLinkCard },
  data() {
    return {
      dialogFormVisible: false,
      formLabelWidth: "80px",
      ruleForm: {
        name: "",
        avatar: "",
        link: "",
        desc: "",
      },
      rules: {
        blogger: [
          { required: true, message: "请输入友链名称", trigger: "blur" },
          {
            min: 1,
            max: 15,
            message: "长度在 1 到 15 个字符",
            trigger: "blur",
          },
        ],
        avatar: [
          {
            required: true,
            message: "请输入头像地址（便于展示）",
            trigger: "blur",
          },
        ],
        link: [
          {
            required: true,
            message: "请输入博客地址",
            trigger: "blur",
          },
        ],
        desc: [
          {
            required: true,
            message: "请输入友链描述信息",
            trigger: "blur",
          },
        ],
      },
      msg: "",
      innerHeight: document.body.clientHeight,
    };
  },
  computed: {
    ...mapState({
      linkList: (state) => state.linkAbout.linkList,
    }),
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch("addLink", this.ruleForm).then((response) => {
            if (response.data.status == 0) {
              this.dialogFormVisible = false;
              this.openTip(
                "恭喜你，" + response.data.message + "请等待管理员审核",
                "success"
              );
            } else {
              this.openTip(response.data.message, "warning");
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.msg = "";
    },
    openTip(message, type) {
      this.$message({
        message: message,
        type,
        showClose: true,
      });
    },
  },
  mounted() {
    this.$store.dispatch("getLinks");
  },
};
</script>

<style scoped lang="less">
.links {
  height: 100%;
  padding-top: 20px;
  .el-card {
    // background-color: #2f3133;
    border: 0;
    // color: #fff;
    .myDescription {
      padding: 15px;
      background-color: #ecf7fe;
      border-left: 4px solid skyblue;
      border-radius: 5px;
      margin: 10px 0;
      font-size: 16px;
      color: black;
      div {
        margin: 10px 0;
      }
      a {
        padding: 0;
        // color: #fff;
      }
    }

    h2 {
      font-weight: 400 !important;
      font-size: 16px;
    }
  }

  .linkbox {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
}
</style>
