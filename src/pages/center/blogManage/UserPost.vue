<template>
  <div class="post">
    <el-row>
      <el-col>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item><strong>博客</strong></el-breadcrumb-item>
          <el-breadcrumb-item>写博客</el-breadcrumb-item>
          <el-divider></el-divider>
        </el-breadcrumb>
        <el-form ref="article" :model="article" :rules="rules">
          <el-row>
            <el-col :span="15">
              <el-form-item prop="title">
                <el-input
                  v-model="article.title"
                  placeholder="请输入标题"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="1">
              <el-form-item prop="shareStatement">
                <el-select v-model="article.share_state" placeholder="版权状态">
                  <el-option
                    v-for="state in share_stateList"
                    :key="state.id"
                    :value="state.state"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item prop="content">
            <mavon-editor
              :ishljs="true"
              :toolbars="toolbars"
              v-model="article.content"
              @imgAdd="handleEditorImageAdd"
              @imgDel="handleEditorImageDel"
              ref="mavon_editor"
            ></mavon-editor>
          </el-form-item>

          <el-form-item prop="tags">
            <el-select
              :multiple-limit="4"
              multiple
              clearable
              filterable
              default-first-option
              v-model="article.tags"
              placeholder="请选择或输入标签"
              style="width: 100%"
            >
              <el-option
                v-for="tag in tagList"
                :key="tag.id"
                :value="tag.name"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-upload
              class="avatar-uploader"
              action="https://upload-z2.qiniup.com"
              :http-request="upCoverToqiniu"
              :data="coverImg_info"
              :limit="1"
              :file-list="cover_fileList"
              :before-upload="beforeCoverUpload"
              :on-success="handleCoverSuccess"
              :on-exceed="handleCoverExceed"
              :on-remove="handleCoverRemoved"
            >
              <el-button size="small" type="primary">点击上传封面</el-button>
            </el-upload>
          </el-form-item>

          <el-form-item>
            <el-checkbox
              label="可赞赏"
              v-model="article.appreciationable"
            ></el-checkbox>
            <el-checkbox
              label="可评论"
              v-model="article.commentable"
            ></el-checkbox>
          </el-form-item>

          <el-form-item>
            <el-button @click="$router.back()">返回</el-button>
            <el-button type="info" @click="getDraft">获取草稿</el-button>
            <el-button type="primary" @click="saveArticle">保存</el-button>
            <el-button type="success" @click="submitForm">发布</el-button>
          </el-form-item>
        </el-form>

        <el-backtop :visibility-height="0" :right="80"> </el-backtop>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "UserPost",
  data() {
    return {
      imageFile: [], // 所有的图片（内容中的图片加封面）
      coverImg_info: {},
      cover_fileList: [], // upload组件中用于显示封面图片的数组
      // mavon-editor的配置项
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        help: true, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: true, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: true, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true, // 预览
      },
      //  版权状态集合
      share_stateList: [
        { id: 0, state: "原创" },
        { id: 1, state: "转载" },
      ],
      tagList: this.$store.state.blogAbout.tagList, // 可用的所有标签
      // 文章数据
      article: {
        title: "", //标题
        share_state: "", //版权状态
        content: "", // 输入的原生md内容
        content_html: "", // 原生md转换为的html内容（结构+内容）
        tags: [], //标签
        appreciationable: true, //是否开启赞赏
        commentable: true, //是否开启评论
        cover_img: "",
      },
      // 文章校验规则
      rules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          {
            min: 2,
            max: 100,
            message: "长度在 2 到 100 个字符",
            trigger: "blur",
          },
        ],
        share_state: [
          { required: true, message: "请选择版权状态", trigger: "change" },
        ],
        content: [
          { required: true, message: "请输入正文内容", trigger: "blur" },
          { min: 10, message: "最小长度为 10 个字符", trigger: "blur" },
        ],
        tags: [
          {
            type: "array",
            required: true,
            message: "请至少添加一个标签",
            trigger: "change",
          },
        ],
      },
      qiniuaddr: "cdn.yuguo.work", // 这是七牛云空间的测试外链默认域名
    };
  },
  methods: {
    //博客内容的图片管理**********************
    async handleEditorImageAdd(pos, $file) {
      // console.log(pos);// mavon-editor 中的图片从 1 开始
      let obj = await this.getImgUptoken(pos, $file);
      if (Object.prototype.hasOwnProperty.call(obj, "token")) {
        this.uplodaImg(pos, obj);
      }
    },
    async handleEditorImageDel(pos) {
      // console.log("准备将图片从服务器删除");
      const arr = pos[0].split("/");
      const key = arr[arr.length - 1];
      // 根据key删除指定文件 ****** 后端实现
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
      console.log("response", response);

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
    //博客封面的图片管理**********************
    async beforeCoverUpload(file) {
      // 对文件类型进行判断
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        return this.$message.error("上传头像图片只能是 JPG 或 PNG 格式!");
      }
      if (!isLt2M) {
        return this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      // 获取图片上传token
      let getToken;
      let pos = 0;
      let obj = await this.getImgUptoken(pos, file);
      if (Object.prototype.hasOwnProperty.call(obj, "token")) {
        getToken = true;
        this.coverImg_info = obj;
        this.coverImg_info.pos = pos;
      }
      return isJPG && isLt2M && getToken;
    },
    async upCoverToqiniu() {
      let obj = this.coverImg_info;
      obj.formData.append("token", obj.token);
      let result = await this.$store.dispatch("uplodaImg", obj.formData);
      if (result.status == 200) {
        const url = "http://" + this.qiniuaddr + "/" + result.data.key; //图片的访问地址
        this.coverImg_info.url = url;
        this.$message.success("封面上传成功");
      } else {
        this.$message.error("封面上传失败");
      }
    },
    async handleCoverSuccess(res, file) {
      this.article.cover_img = this.coverImg_info.url;
    },
    handleCoverExceed() {
      this.$message.error("封面是唯一的");
    },
    handleCoverRemoved() {
      this.article.cover_img = "";
    },
    //博客保存与发布**********************
    async getDraft() {
      let result = await this.$store.dispatch("getDraft");
      if (result.data.status == 0) {
        this.article.title = this.$store.state.blogAbout.userDraft.title;
        this.article.content = this.$store.state.blogAbout.userDraft.content;
        this.$message.success("获取成功");
      } else {
        this.$message.error(result.data.message);
      }
    },
    async saveArticle() {
      console.log(this.article.content);
      let result = await this.$store.dispatch("saveArticle", {
        title: this.article.title,
        content: this.article.content,
        state: "草稿",
      });
      if (result.data.status == 0) {
        this.$message({
          message: result.data.message,
          type: "success",
          showClose: true,
        });
        this.$store.dispatch("getDraft");
      } else {
        this.$message({
          message: result.data.message,
          type: "warning",
          showClose: true,
        });
      }
    },
    submitForm() {
      this.$refs["article"].validate(async (valid) => {
        if (valid) {
          this.article.content_html = this.$refs.mavon_editor.d_render; //编辑器输出的html内容（结构+内容）
          // 将标签转换为对应的id
          let tag_ids = [];
          this.article.tags.forEach((item) => {
            this.tagList.forEach((ele) => {
              if (ele.name == item) {
                tag_ids.push(ele.id);
              }
            });
          });
          tag_ids = tag_ids.join(",");
          // 判断封面是否上传了
          if (this.article.share_state == "") {
            return this.$message.error("版权状态是必需的");
          }
          if (this.article.cover_img !== "") {
            let result = await this.$store.dispatch("postArticle", {
              ...this.article,
              tag_ids,
            });
            if (result.data.status == 0) {
              this.$message.success(result.data.message);
            } else {
              this.$message.error(result.data.message);
            }
          } else {
            this.$message.error("封面是必需的");
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
  beforeDestroy() {
    console.log("UserPost要被销毁了");
  },
};
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>