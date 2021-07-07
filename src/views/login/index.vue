s<template>
  <div class="login-container">
    <div class="left-container">
      <img src="../../assets/images/gfkd_logo.png" alt="logo">
    </div>
    <div class="right-container">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
        <div class="title-container">
          <!-- <h3 class="title">创新院人工智能中心</h3> -->
          <img src="../../assets/images/Mdregistered.png" alt="logo">
        </div>
        <el-form-item prop="userName" class="user-name">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.userName"
            placeholder="账号"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="password" class="password" style="margin-bottom: 0;">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>

        <el-row style="margin-top: 6px;" class="bt-login">
          <el-col :span="12">
            <div>
              <el-button type="text" style=" color:#ff5338;" @click="handleregistered(1)">注册新用户</el-button>
            </div>
          </el-col>
          <el-col :span="12">
            <div style="text-align: right;">
              <el-button type="text" style=" color:#ff5338; " @click="handleregistered(2)">忘记密码</el-button>

            </div>
          </el-col>
        </el-row>

        <el-button :loading="loading" type="primary" style="width:100%;margin:30px 0;background:#ff5338 ;border:none;border-radius:38px;" @click.native.prevent="handleLogin">登 录</el-button>

      </el-form>
    </div>
  </div>
</template>

<script>
// import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入账号'))
      } else if (value.length < 3) {
        callback(new Error('账号长度不超过3位'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        userName: '',
        password: ''
      },
      loginRules: {
        userName: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    handleregistered(value) {
      if (value === 1) {
        this.$router.push('/registered')
      } else if (value === 2) {
        this.$router.push('/resetPassword')
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.loginForm.password = this.$md5(this.loginForm.password)

          this.$store.dispatch('loginByUsername', this.loginForm).then(res => {
            this.$message.success('登陆成功')

            this.$router.push({ path: '/' })
            this.loading = false
          }).catch(error => {
            this.$message.error(error)
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

// @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
//   .login-container .el-input input {
//     color: $cursor;
//   }
// }

/* reset element-ui css */
.login-container {
  .right-container {
    .el-input {
      display: inline-block;
      height: 50px;
      width: 85%;
      input {
        color: #FF5338;
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        // color: $light_gray;
        height: 50px;
        // caret-color: $cursor;
        // &:-webkit-autofill {
        //   box-shadow: 0 0 0px 1000px $bg inset !important;
        //   -webkit-text-fill-color: $cursor !important;
        // }
      }
    }
    .el-form-item {
      border:1px solid rgba(217,217,217,1);
      // background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #D9D9D9;
    }
  }

  /* 选择历史记录的文字颜色和背景颜色 */
  input:-webkit-autofill {
    -webkit-animation: autofill-fix 1s infinite!important;
    /* 选择历史记录的文字颜色*/
    -webkit-text-fill-color: #FF5338;
    -webkit-transition: background-color 50000s ease-in-out 0s!important;
    transition: background-color 50000s ease-in-out 0s!important;
    background-color: transparent!important;
    background-image: none !important;
    /* 选择历史记录的背景颜色 */
    -webkit-box-shadow: 0 0 0 1000px transparent inset!important;
  }
  [role=button], a, area, button, input:not([type=range]), label, select, summary, textarea {
    -ms-touch-action: manipulation;
    touch-action: manipulation;
  }
  input[type=number], input[type=password], input[type=text], textarea {
    -webkit-appearance: none;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  width: 100vw;
  height: 100vh;
  // background-color: $bg;
  overflow: hidden;
  display: flex;
  .left-container {
    width: 84vw;
    background-image: url('../../assets/images/logo_bg.png');
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    text-align: center;
    img {
      position: absolute;
      width: 200px;
      bottom: 10px;
      margin-left: -100px;
    }
  }
  .right-container {
    width: 30vw;
    background-color: #1e1d2c;
    .login-form {
      position: relative;
      padding: 20vh 50px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;
      margin-bottom: 100px;
       img {
         width: 100%;
       }
      .title {
        font-size: 26px;
        color: #292F4C;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }
    .user-name, .password {
      border: none;
      border-radius: 50px;
      overflow: hidden;
      background: #252637;
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }
}
</style>
<style>
 .bt-login .el-button:hover {
    border-color: #fff;
  }
 .login-form .el-form-item__error {
    z-index: 1;
  }
</style>
