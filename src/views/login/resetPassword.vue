<template>
  <el-container class="boxRegistered">
    <el-header>
      <el-card class="box-card">
        <el-row
          class="imgBox"
          type="flex"
          justify="space-between"
          align="middle"
        >
          <h1 @click="$router.push('/login')">优颂乐器</h1>
          <span
            class="rightBox"
          >已有账户,
            <span class="fontColor" @click="linkTo()">立即登录</span></span>
        </el-row>
      </el-card>
    </el-header>
    <el-main class="main">
      <div class="main_container">
        <h3 class="fontStyle">找回密码</h3>
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
        >
          <!-- <el-form-item label="手机号" prop="phoneNumber">
                      <el-input v-model.number="ruleForm.phoneNumber" placeholder="请输入您的手机号码" ></el-input>
                    </el-form-item> -->
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="ruleForm.password"
              type="password"
              placeholder="请输入您的密码"
            />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="ruleForm.confirmPassword"
              type="password"
              placeholder="请再次输入您的密码"
            />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="ruleForm.email"
              placeholder="请输入您的邮箱"
              style="width: 40%;"
            />
            <!-- <el-button type="primary" style="margin-left: 6px;background:#FF5338 ;border:none;"  @click="handleSendVerificationCode()">获取验证码</el-button> -->
            <input
              v-model="codeMsg"
              type="button"
              class="getNumber"
              :disabled="codeDisabled"
              style="width: 22%;height: 40px; margin-left: 6px;background:#FF5338;border-radius: 4px; border: none; color: #fff;outline:medium;"
              @click="getCode"
            >
          </el-form-item>
          <el-form-item label="验证码" prop="emailVerificationCode">
            <el-input
              v-model="ruleForm.emailVerificationCode"
              placeholder="请输入您的验证码"
            />
          </el-form-item>
          <!-- <el-form-item label="验证码" prop="desc">

                    </el-form-item> -->
          <el-form-item>
            <el-button
              type="primary"
              style="width:100%;margin:30px 0;background:#FF5338 ;border:none;"
              @click="submitForm('ruleForm')"
            >确认重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { getSendVerificationCode, getResetPassword } from '@/api/login'

export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.confirmPassword !== '') {
          this.$refs.ruleForm.validateField('confirmPassword')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      // 是否禁用按钮
      codeDisabled: false,
      // 倒计时秒数
      countdown: 60,
      // 按钮上的文字
      codeMsg: '获取验证码',
      // 定时器
      timer: null,
      dialogVisible: false,
      ruleForm: {
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        email: '',
        emailVerificationCode: '',
        institutionalType: '',
        nameOrganization: '',
        institutionCode: '',
        EnglishText: '',
        // InstitutionAddress: [],
        fileList: null,
        desc: ''
      },
      rules: {
        //   phoneNumber: [
        //     { required: true, message: '请输入您的手机号码', trigger: 'change' },
        //      { type: 'number', message: '手机号必须为数字值'}
        //   ],
        password: [
          { validator: validatePass, required: true, trigger: 'blur' }
        ],
        confirmPassword: [
          { validator: validatePass2, required: true, trigger: 'blur' }
        ],

        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        emailVerificationCode: [
          { required: true, message: '请输入邮箱验证码', trigger: 'change' }
        ]
        //   InstitutionAddress: [
        //     { type: 'array',  required: true, message: '请填写机构地址', trigger: 'blur' }
        //   ],
      },
      valTextarea: '',
      props: {
        lazy: true,
        lazyLoad(node, resolve) {
          setTimeout(() => {
            // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            resolve(node)
          }, 1000)
        }
      },

      textHidden: false
    }
  },
  mounted() {},
  methods: {
    getCode() {
      // 验证码60秒倒计时
      if (!this.timer) {
        this.timer = setInterval(() => {
          if (this.countdown > 0 && this.countdown <= 60) {
            this.countdown--
            if (this.countdown !== 0 && this.ruleForm.email) {
              this.codeMsg = '重新发送(' + this.countdown + ')'
            } else {
              clearInterval(this.timer)
              this.codeMsg = '获取验证码'
              this.countdown = 60
              this.timer = null
              this.codeDisabled = false
            }
          }
        }, 1000)
      }
      if (this.codeMsg === '获取验证码' && this.ruleForm.email) {
        this.handleSendVerificationCode()
      } else if (this.ruleForm.email === '') {
        this.$message({
          message: '请输入邮箱',
          type: 'warning'
        })
      }
    },
    // 获取验证码
    async handleSendVerificationCode() {
      const formdata = {
        receiveEmail: this.ruleForm.email,
        type: 'reset'
      }

      await getSendVerificationCode(formdata)
        .then(res => {})
        .catch(error => {
          this.$message.error(error)
        })
    },
    dialogVisibleSucced() {
      this.dialogVisible = false
      this.$router.push('/login')
    },
    handleHttpRequestRegistered() {},

    linkTo() {
      this.$router.push('/login')
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const formdata = {
            email: this.ruleForm.email,
            password: this.ruleForm.password,
            passwordCopy: this.ruleForm.confirmPassword,
            verificationCode: this.ruleForm.emailVerificationCode
          }
          getResetPassword(formdata)
            .then(res => {
              if (res.data.code === '10000') {
                this.$message({
                  message: '重置密码成功',
                  type: 'success'
                })
                this.$router.push('/login')
              }
            })
            .catch(error => {
              this.$message.error(error)
            })
          //   this.$store.dispatch('getRegistered', params).then(res => {
          //      this.dialogVisible = true
          //     this.textHidden = true

          // }).catch(error => {
          //   // this.$message.error(error)
          //     this.dialogVisible = true
          //    this.textHidden = false
          // })
        } else {
          this.$message({
            message: '请查看必填信息是否完善',
            type: 'warning'
          })
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.boxRegistered {
  width: 100%;
  .box-card {
    width: 100%;
    padding: 0;
    .rightBox {
      display: inline-block;
      float: right;
      margin-top: 10px;
      .fontColor {
        color: #ff5338;
        text-decoration: underline;
      }
      .fontColor:hover {
        cursor: pointer;
      }
    }
    .imgBox {
      width: 80%;
      margin: 10px auto;
      height: 48px;
      img {
        width: 290px;
      }
    }
  }
  .main {
    width: 100%;
    .main_container {
      width: 40%;
      margin: 0 auto;

      .fontStyle {
        width: 100%;
        text-align: center;
        color: #ff5338;
      }
    }
  }
  .dialog-footer {
    text-align: center;
  }
  .dialogBox {
    text-align: center;
    img {
      width: 24px;
      vertical-align: middle;
      margin-right: 6px;
    }
    .dialogMT {
      margin-top: 10px;
    }
  }
}
</style>
<style>
.boxRegistered .el-header {
  padding: 0;
}
.boxRegistered .el-card__body {
  padding: 0;
}
.boxRegistered .el-radio__input.is-checked + .el-radio__label {
  color: #ff5338;
}
.boxRegistered .el-radio__input.is-checked .el-radio__inner {
  border-color: #ff5338;
  background: #ff5338;
}
.boxRegistered .el-radio__inner:hover {
  border: 1px solid #ff5338;
}
.boxRegistered .el-cascader {
  width: 100%;
}
</style>
