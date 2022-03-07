
export default {
    data() {
        var checkName = (rule, value, callback) => {
            if (!value) {
                return callback(new Error("用户名不能为空"));
            }
            setTimeout(() => {
                if (value.length > 10) {
                    callback(new Error("用户名最大长度为10位"));
                } else {
                    callback();
                }
            }, 1000);
        };
        var validatePass = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入密码"));
            } else if (value.length > 12 || value.length < 6) {
                callback(new Error("密码必须在6-12位"));
            } else {
                if (this.ruleForm.checkPass !== "") {
                    this.$refs.ruleForm.validateField("checkPass");
                }
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请再次输入密码"));
            } else if (value !== this.ruleForm.password) {
                callback(new Error("两次输入密码不一致!"));
            } else {
                callback();
            }
        };
        return {
            ruleForm: {
                username: "",
                password: "",
                checkPass: "",
            },
            rules: {
                username: [{ validator: checkName, trigger: "blur" }],
                password: [{ validator: validatePass, trigger: "blur" }],
                checkPass: [{ validator: validatePass2, trigger: "blur" }],
            },
            countDownInfo: {
                isLoading: false,
                status: 1,
                msg: "",
                time: 0,
            },
        };
    },
}