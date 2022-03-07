<template>
  <div class="login">
    <el-row>
      <el-col
        :md="{ span: 8, offset: 8 }"
        :sm="{ span: 14, offset: 5 }"
        :xs="{ span: 20, offset: 2 }"
      >
        <div class="login_box">
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
            <el-form-item prop="checkCode">
              <el-row>
                <el-col :span="8">
                  <el-input
                    v-model="checkCode"
                    autocomplete="off"
                    placeholder="请输入验证码"
                    @keydown.enter.native="submitForm"
                  ></el-input>
                </el-col>
                <el-col :span="6" :offset="2">
                  <div class="codeArea" @click="refreshCode">
                    <UserIdentify :identifyCode="identifyCode"></UserIdentify>
                  </div>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="submitForm">登录</el-button>
              <el-button
                type="info"
                @click="$router.push({ path: '/register' })"
              >
                尚未注册
              </el-button>
            </el-form-item>
            <!-- 展示加载中 -->
            <el-form-item v-show="countDownInfo.isLoading">
              加载中......
            </el-form-item>
            <!-- 展示响应信息 -->
            <el-form-item v-show="countDownInfo.msg">{{
              countDownInfo.msg
            }}</el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { login } from "../../api";
import loading from "../../components/mixin/loading";
import UserIdentify from "../../components/Main/UserIdentify.vue";
export default {
  name: "UserLogin",
  components: { UserIdentify },
  mixins: [loading],
  data() {
    return {
      identifyCode: "",
      identifyCodes: "1234567890",
      checkCode: "",
    };
  },
  mounted() {
    this.identifyCode = "";
    this.makeCode(this.identifyCodes, 4);
  },
  methods: {
    submitForm() {
      this.$refs["ruleForm"].validate(async (valid) => {
        //判断验证码
        if (this.checkCode !== this.identifyCode) {
          return this.$message.error("验证码不正确");
        }
        if (valid) {
          // 点击登录按钮之后变为加载中
          let dataObj = {
            isLoading: true,
            status: 1,
            msg: "",
          };
          this.countDownInfo = {
            ...this.countDownInfo,
            ...dataObj,
          };

          // 执行登录请求
          let response = await login(this.ruleForm);
          if (response.data.status == 0) {
            dataObj = {
              isLoading: false,
              status: 0,
              msg: response.data.message,
            };
            this.countDownInfo = {
              ...this.countDownInfo,
              ...dataObj,
            };
            this.countDownInfo = {
              isLoading: false,
              status: 1,
              msg: "",
              time: 0,
            };
            //!!!!!!!! 登录成功后，存储token
            localStorage.setItem("blog_token", response.data.token);
            this.$store.dispatch("setToken", response.data.token);
            this.$store.dispatch("getUserinfo");

            this.$router.push({
              path: "/home",
            });
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
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    refreshCode() {
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    },
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode +=
          this.identifyCodes[this.randomNum(0, this.identifyCodes.length)];
      }
      console.log(this.identifyCode);
    },
  },
};
</script>

<style scoped>
.login_box {
  height: 300px;
  margin: 100px auto;
}

.codeArea {
  text-align: center;
  padding: 0;
}
</style>
