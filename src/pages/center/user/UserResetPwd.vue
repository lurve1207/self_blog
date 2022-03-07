<template>
  <div class="resetPwd">
    <el-row>
      <el-col :span="12" :xs="{ span: 24, offset: 0 }">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item><strong>个人中心</strong></el-breadcrumb-item>
          <el-breadcrumb-item>重置密码</el-breadcrumb-item>
          <el-divider></el-divider>
        </el-breadcrumb>
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="60px"
          class="demo-ruleForm"
        >
          <el-form-item label="原密码" prop="oldPass">
            <el-input
              type="password"
              v-model="ruleForm.oldPass"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPass">
            <el-input
              type="password"
              v-model="ruleForm.newPass"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">
              提交
            </el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Loading } from "element-ui";
export default {
  name: "UserResetPwd",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入原密码"));
      } else if (value.length > 12 || value.length < 6) {
        callback(new Error("密码必须在6-12位"));
      } else {
        if (this.ruleForm.newPass !== "") {
          this.$refs.ruleForm.validateField("newPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else if (value.length > 12 || value.length < 6) {
        callback(new Error("新密码必须在6-12位"));
      } else if (value == this.ruleForm.oldPass) {
        callback(new Error("新密码不能与原密码一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        oldPass: "",
        newPass: "",
      },
      rules: {
        oldPass: [{ validator: validatePass, trigger: "blur" }],
        newPass: [{ validator: validatePass2, trigger: "blur" }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let response = await this.$store.dispatch("updatePwd", {
            username: this.$store.state.userAbout.user.username,
            oldPassword: this.ruleForm.oldPass,
            newPassword: this.ruleForm.newPass,
          });
          if (response.data.status == 0) {
            this.$store.dispatch("log_out");
            let loadingInstance = Loading.service({
              target: document.body,
              fullscreen: true,
              lock: true,
              text: response.data.message + "请重新登录,正在去往登录界面",
            });
            setTimeout(() => {
              loadingInstance.close();
              this.$router.push({ path: "/login" });
            }, 1000);

            // this.$nextTick(() => {
            //   // 以服务的方式调用的 Loading 需要异步关闭
            //   loadingInstance.close();
            // });
          } else {
            this.$message({
              message: response.data.message,
              type: "error",
              showClose: true,
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style>
</style>