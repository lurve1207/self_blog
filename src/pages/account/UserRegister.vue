<template>
  <div
    class="register"
    :class="$store.state.blogAbout.mode == 'dark' ? 'dark-sec' : 'light-sec'"
    :style="{ minHeight: innerHeight + 'px' }"
  >
    <el-row>
      <el-col
        :md="{ span: 8, offset: 8 }"
        :sm="{ span: 14, offset: 5 }"
        :xs="{ span: 20, offset: 2 }"
      >
        <div class="register_box">
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm">
            <el-form-item prop="username">
              <el-input
                v-model.number="ruleForm.username"
                placeholder="请输入用户名"
                prefix-icon="el-icon-user"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                type="password"
                v-model="ruleForm.password"
                prefix-icon="el-icon-s-flag"
                autocomplete="off"
                placeholder="请输入密码"
              ></el-input>
            </el-form-item>
            <el-form-item prop="checkPass">
              <el-input
                type="password"
                v-model="ruleForm.checkPass"
                prefix-icon="el-icon-s-flag"
                autocomplete="off"
                placeholder="请确认密码"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="submitForm">注册</el-button>
              <el-button type="info" @click="resetForm('ruleForm')"
                >重置</el-button
              >
              <el-button type="primary" @click="showLogin"
                >已有账号，去登录</el-button
              >
            </el-form-item>
            <!-- 展示加载中 -->
            <el-form-item v-show="countDownInfo.isLoading"
              >加载中......</el-form-item
            >
            <!-- 展示响应信息 -->
            <el-form-item v-show="countDownInfo.msg"
              >{{ countDownInfo.msg }}
              <strong v-show="!countDownInfo.status">{{
                countDownInfo.time
              }}</strong>
              <span v-show="!countDownInfo.status">
                s后即将跳转至登录界面
              </span></el-form-item
            >
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { register } from "../../api";
import loading from "../../components/mixin/loading";
export default {
  name: "UserRegister",
  mixins: [loading],
  data() {
    return {
      innerHeight: document.body.clientHeight,
    };
  },
  methods: {
    submitForm() {
      this.$refs["ruleForm"].validate(async (valid) => {
        if (valid) {
          // 点击注册按钮之后变为加载中
          let dataObj = {
            isLoading: true,
            status: 1,
            msg: "",
            time: 0,
          };
          this.countDownInfo = {
            ...this.countDownInfo,
            ...dataObj,
          };
          let response = await register(this.ruleForm);
          if (response.data.status == 0) {
            dataObj = {
              isLoading: false,
              status: 0,
              msg: response.data.message,
              time: 0,
            };
            this.countDownInfo = {
              ...this.countDownInfo,
              ...dataObj,
            };
            const TIME_COUNT = 5;
            this.countDownInfo.time = TIME_COUNT;
            if (!this.timer) {
              this.timer = setInterval(() => {
                if (
                  this.countDownInfo.time > 0 &&
                  this.countDownInfo.time <= TIME_COUNT
                ) {
                  this.countDownInfo.time--;
                } else {
                  clearInterval(this.timer);
                  this.timer = null;
                  this.countDownInfo = {
                    isLoading: false,
                    status: 1,
                    msg: "",
                    time: 0,
                  };
                  // 跳转到选人加分界面;
                  this.$router.push({
                    path: "/login",
                  });
                }
              }, 1000);
            }
          } else {
            let dataObj = {
              isLoading: false,
              status: 1,
              msg: response.data.message,
              time: 0,
            };
            this.countDownInfo = {
              ...this.countDownInfo,
              ...dataObj,
            };
            return new Error(response.data.message);
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
    showLogin() {
      this.$router.push({
        path: "/login",
      });
    },
  },
};
</script>

<style scoped>
.register_box {
  height: 300px;
  margin: 100px auto;
}
</style>