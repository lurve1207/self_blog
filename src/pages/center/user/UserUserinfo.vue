<template>
  <div class="userinfo">
    <el-row>
      <el-col :span="12" :xs="{ span: 24, offset: 0 }">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item><strong>个人中心</strong></el-breadcrumb-item>
          <el-breadcrumb-item>我的信息</el-breadcrumb-item>
          <el-divider></el-divider>
        </el-breadcrumb>
        <el-avatar :size="120" :src="ruleForm.user_pic"></el-avatar>

        <div class="btn">
          <el-upload
            class="avatar-uploader"
            action="https://upload-z2.qiniup.com"
            :http-request="upCoverToqiniu"
            :data="userPic_info"
            :limit="1"
            :before-upload="beforeCoverUpload"
            :on-success="handleCoverSuccess"
            :on-exceed="handleCoverExceed"
            :show-file-list="false"
          >
            <el-button size="small" type="success">更改头像</el-button>
          </el-upload>
        </div>

        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="80px"
        >
          <el-form-item label="用户名" prop="username" required>
            <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="ruleForm.gender">
              <el-radio label="君"></el-radio>
              <el-radio label="淑"></el-radio>
              <el-radio label="保密"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="生日" prop="birth">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="ruleForm.birth"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email"></el-input>
          </el-form-item>
          <el-form-item label="个人简介" prop="intro">
            <el-input v-model="ruleForm.intro"> </el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')"
              >保存</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "UserUserinfo",
  data() {
    return {
      ruleForm: {
        username: this.$store.state.userAbout.user.username,
        gender:
          this.$store.state.userAbout.user.gender == 2
            ? "保密"
            : this.$store.state.userAbout.user.gender == 0
            ? "淑"
            : "君",
        birth: this.$store.state.userAbout.user.birth,
        email: this.$store.state.userAbout.user.email,
        intro: this.$store.state.userAbout.user.intro,
        user_pic: this.$store.state.userAbout.user.user_pic,
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度在 1 到 10 个字符",
            trigger: "blur",
          },
        ],
        gender: [{ required: true, message: "请选择性别", trigger: "change" }],
        birth: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        email: [
          {
            required: true,
            message: "请输入可以联系到你的邮箱",
            trigger: "blur",
          },
        ],
        intro: [
          {
            message: "请简单描述一下你自己让别人更好的认识你",
            trigger: "blur",
          },
        ],
      },
      imageFile: [], // 所有的图片（内容中的图片加头像）
      userPic_info: {},
      qiniuaddr: "cdn.yuguo.work", // 这是七牛云空间的测试外链默认域名
    };
  },
  watch: {
    "this.$store.state.userAbout.user.birth": {
      handler(newVal) {
        this.ruleForm.birth = new Date(newVal);
      },
    },
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let result = await this.$store.dispatch("updateUserinfo", {
            username: this.ruleForm.username,
            email: this.ruleForm.email,
            intro: this.ruleForm.intro,
            gender:
              this.ruleForm.gender == "保密"
                ? 2
                : this.ruleForm.gender == "君"
                ? 1
                : 0,
            birth: this.ruleForm.birth,
          });
          if (result.data.status == 0) {
            this.$message.success({
              message: result.data.message,
              showClose: true,
            });

            console.log(result.data.message, "------------");
            //   更新成功后获取新的信息
            this.$store.dispatch("getUserinfo");
          } else {
            this.$message.error({
              message: result.data.message,
              showClose: true,
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async getImgUptoken(pos, file) {
      console.log("每次的pos", pos);
      this.imageFile[pos] = file;
      const formData = new FormData();
      formData.append("file", file);
      let keyname = new Date().valueOf() + "_" + file.name;
      formData.append("key", keyname);

      let response = await this.$store.dispatch("getImageUploadToken", {
        name: keyname,
        size: file.size,
        type: file.type,
        usertoken: this.$store.state.userAbout.token,
      });

      if (response.data.status == 0) {
        // this.$message.success({ message: "权限满足", showClose: true });
        return { formData, token: response.data.data };
      } else {
        this.$message.error("没有上传图片的权限");
        // 清除图片***************
        // 清除图片***************
        // 清除图片***************
        return {};
      }
    },
    async uplodaImg(pos, obj) {
      obj.formData.append("token", obj.token);
      let result = await this.$store.dispatch("uplodaImg", obj.formData);
      if (result.status == 200) {
        const url = "http://" + this.qiniuaddr + "/" + result.data.key; //图片的访问地址
        this.$refs.mavon_editor.$img2Url(pos, url); //很重要，将 ![图片名](pos) 替换成 ![图片名](url)
      } else {
        this.$message.error("图片上传失败");
      }
    },
    //博客头像的图片管理**********************
    async beforeCoverUpload(file) {
      // 对文件类型进行判断
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 或 PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      // 获取图片上传token
      let getToken;
      let pos = 0;
      let obj = await this.getImgUptoken(pos, file);
      if (Object.prototype.hasOwnProperty.call(obj, "token")) {
        getToken = true;
        this.userPic_info = obj;
        this.userPic_info.pos = pos;
      }
      return isJPG && isLt2M && getToken;
    },
    async upCoverToqiniu() {
      let obj = this.userPic_info;
      obj.formData.append("token", obj.token);
      let result = await this.$store.dispatch("uplodaImg", obj.formData);
      if (result.status == 200) {
        const url = "http://" + this.qiniuaddr + "/" + result.data.key; //图片的访问地址
        this.userPic_info.url = url;
        // this.$message.success("头像上传成功");
      } else {
        this.$message.error("头像上传失败");
      }
    },
    async handleCoverSuccess(res, file, fileList) {
      let result = await this.$store.dispatch("updateUserPic", {
        user_pic: this.userPic_info.url,
      });
      if (result.data.status == 0) {
        fileList.pop();
        await this.$store.commit("UPDATE_USERPIC", this.userPic_info.url);
        this.ruleForm.user_pic = this.userPic_info.url;
        this.$message.success("头像更改成功！");
      } else {
        this.$message.error("头像更改失败！");
      }
    },
    handleCoverExceed() {
      this.$message.error("头像是唯一的");
    },
  },
};
</script>

<style scoped lang="less">
.userinfo {
  .el-avatar {
    margin-left: 80px;
  }

  .btn {
    display: inline-block;
    transform: translateY(-12px) translateX(10px);
  }
}
</style>
