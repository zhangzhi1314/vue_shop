<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="login_logo">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单 -->
      <el-form
        label-width="0px"
        class="login_form"
        :model="loginForm"
        :rules="loginFormRule"
        ref="loginForm"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-yonghu"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            show-password
            prefix-icon="iconfont icon-suo"
            v-model="loginForm.password"
            type="password"
            @keyup.enter.native="login"
          ></el-input>
          <!-- 在组件框架中使用键盘点击事件需要加native修饰 -->
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" plain @click="login" style="width: 410px"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //  登录表单的数据绑定对象
      loginForm: {
        username: "admin",
        password: "123456",
      },
      loginFormRule: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 12,
            message: "长度在 3 到 12 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 20, message: "长度在 6 到20个字符", trigger: "blur" },
        ],
      },
    };
  },
  //   重置表单输入内容
  methods: {
    formClear() {
      console.log(this);
      this.$refs.loginForm.resetFields();
    },
    login() {
      this.$refs.loginForm.validate(async (valid) => {
        console.log(valid);
        if (!valid) {
          return;
        }
        // 通过解构赋值获取data里面的值
        const { data: msg } = await this.$http.post("login", this.loginForm);
        if (msg.meta.status === 200) {
          console.log(msg);
          console.log("登录成功");
          this.$message.success({ duration: 1000, message: "登录成功" });
          window.sessionStorage.setItem("token", msg.data.token);
          window.sessionStorage.setItem("username", this.loginForm.username);
          //    编程式导航
          this.$router.push("/home");
        } else {
          console.log("登录失败");
          //  提示错误信息
          this.$message.error({
            duration: 1000,
            message: "用户名或密码错误",
          });
        }
      });
    },
  },
};
</script>
<style scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: white;
  border-radius: 6px;
  position: absolute;
}
.login_logo {
  height: 130px;
  width: 130px;
  border: 1px solid #eeeeee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
}
.login_logo img {
  height: 100%;
  width: 100%;
  border-radius: 50%;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
}
.btns {
  float: right;
}
</style>
