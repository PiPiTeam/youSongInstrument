<template>
  <el-container class="boxRegistered">
    <el-header>
      <el-card class="box-card">
        <div class="imgBox">
          <h1 class="title" @click="$router.push('/login')">优颂乐器</h1>
          <span class="rightBox">已有账户, <span class="fontColor" @click="linkTo()">立即登录</span></span>
        </div>
      </el-card>
    </el-header>
    <el-main class="main">
      <div class="main_container">
        <h3 class="fontStyle">申请入驻</h3>
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="nickName">
            <el-input v-model.number="ruleForm.nickName" placeholder="请输入您的用户名" />
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model.number="ruleForm.mobile" placeholder="请输入您的手机号码" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="ruleForm.password" type="password" placeholder="请输入您的密码" show-password />
          </el-form-item>
          <el-form-item label="确认密码" prop="passwordCopy">
            <el-input v-model="ruleForm.passwordCopy" type="password" placeholder="请再次输入您的密码" show-password />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email" placeholder="请输入您的邮箱" style="width: 40%;" />
            <!-- <el-button type="primary" style="margin-left: 6px;background:#FF5338 ;border:none;"  @click="handleSendVerificationCode()">获取验证码</el-button> -->
            <input v-model="codeMsg" type="button" class="getNumber" :disabled="codeDisabled" style="width: 22%;height: 40px; margin-left: 6px;background:#FF5338;border-radius: 4px; border: none; color: #fff;outline:medium;" @click="getCode">
          </el-form-item>
          <el-form-item label="验证码" prop="verificationCode">
            <el-input v-model="ruleForm.verificationCode" placeholder="请输入您的验证码" />
          </el-form-item>
          <el-form-item label="所在城市" prop="selectedOptions">
            <el-cascader
              v-model="ruleForm.selectedOptions"
              size="large"
              :options="regionOptions"
              @change="handleChange"
            />
          </el-form-item>
          <el-form-item label="机构名称" prop="institutionName">
            <el-input v-model="ruleForm.institutionName" placeholder="请输入机构名称(工商注册名称)" />
          </el-form-item>

          <!-- <el-form-item label="机构代码" prop="institutionCode">
            <el-input v-model="ruleForm.institutionCode" placeholder="社会统一信用代码" />
          </el-form-item> -->

          <!-- <el-form-item label="机构地址" prop="InstitutionAddress">
                        <el-cascader
                        v-model="ruleForm.InstitutionAddress"
                          :options="options"
                          :props="props"
                          placeholder="请选择机构地址"
                          clearable>
                     </el-cascader>

                    </el-form-item> -->
          <el-form-item label="机构营业执照" prop="fileList">

            <el-upload
              ref="form"
              class="upload-demo"
              action="#"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :on-change="onUploadChange"
              :on-success="handleAvatarSuccess"
              multiple
              :limit="1"
              :on-exceed="handleExceed"
              list-type="picture"
              :auto-upload="false"
            >
              <el-button size="small" type="primary" style="width: 160px;background:#FF5338 ;border:none;">选择文件</el-button>
            </el-upload>
          </el-form-item>
          <!-- <el-form-item label="机构简介" prop="desc">
            <el-input
              v-model="ruleForm.desc"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入机构简介"
            />
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" style="width:100%;margin:30px 0;background:#FF5338 ;border:none;" @click="submitForm('ruleForm')">注册</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
        :show-close="false"
      >
        <div v-if="!textHidden" class="dialogBox">
          <img src="../../assets/images/sad.png" alt=""><span style="color: red;">注册失败</span>
          <div class="dialogMT">该机构已注册，请联系管理员咨询</div>
        </div>
        <div v-if="textHidden" class="dialogBox">
          <img src="../../assets/images/succeed.png" alt=""><span style="color: #1AD66C;">注册成功</span>
          <div class="dialogMT">资料将在一个工作日完成审核，并以邮箱形式提示</div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button v-if="textHidden" type="primary" style="margin:30px 0;background:#FF5338 ;border:none;" @click="dialogVisibleSucced()">确 认</el-button>
          <el-button v-if="!textHidden" type="primary" style="margin:30px 0;background:#FF5338 ;border:none;" @click="dialogVisible = false">确 认</el-button>
          <el-button plain @click="dialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </el-main>

  </el-container>
</template>

<script>
import { regionData } from 'element-china-area-data'
import { getRegistered, getSendVerificationCode } from '@/api/login'

export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.passwordCopy !== '') {
          this.$refs.ruleForm.validateField('passwordCopy')
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
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        console.log(reg.test(value))
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    const validlegalbizLicNum = (rule, value, callback) => {
      let Ancode// 统一社会信用代码的每一个值
      let Ancodevalue// 统一社会信用代码每一个值的权重
      let total = 0
      const weightedfactors = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28]// 加权因子
      // 不用I、O、S、V、Z
      const str = '0123456789ABCDEFGHJKLMNPQRTUWXY'
      for (let i = 0; i < value.length - 1; i++) {
        Ancode = value.substring(i, i + 1)
        Ancodevalue = str.indexOf(Ancode)
        total = total + Ancodevalue * weightedfactors[i]
        // 权重与加权因子相乘之和
      }
      let logiccheckcode = 31 - total % 31
      if (logiccheckcode === 31) {
        logiccheckcode = 0
      }
      const Str = '0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,T,U,W,X,Y'
      const Array_Str = Str.split(',')
      logiccheckcode = Array_Str[logiccheckcode]

      const checkcode = value.substring(17, 18)
      if (logiccheckcode !== checkcode) {
        return callback(new Error('校验失败，请输入正确的统一社会信用代码！'))
      }
      return callback()
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
        nickName: '',
        mobile: '',
        password: '',
        passwordCopy: '',
        email: '',
        verificationCode: '',
        institutionName: '',
        fileList: null,
        selectedOptions: []
      },
      rules: {
        nickName: [
          { required: true, message: '请输入您的用户名', trigger: 'change' }
        ],
        mobile: [
          { required: true, validator: checkPhone, trigger: 'blur' },
          { type: 'number', message: '手机号必须为数字值' }
        ],
        password: [
          { validator: validatePass, required: true, trigger: 'blur' }
        ],
        passwordCopy: [
          { validator: validatePass2, required: true, trigger: 'blur' }
        ],
        institutionName: [
          { required: true, message: '请输入机构名称', trigger: 'change' }
        ],
        institutionCode: [
          { required: true, message: '请输入社会统一信用代码', trigger: 'blur' },
          {
            type: 'string', len: 18, message: '输入有误，统一社会信用代码长度需为18位', trigger: 'change' },
          {
            type: 'string',
            /*
              统一社会信用代码由十八位的阿拉伯数字或大写英文字母（不使用I、O、Z、S、V）组成。
              第1位：登记管理部门代码（共一位字符）登记管理部门代码：使用阿拉伯数字或大写英文字母表示。
              第2位：机构类别代码（共一位字符）
              第3位~第8位：登记管理机关行政区划码（共六位阿拉伯数字）
              第9位~第17位：主体标识码（组织机构代码）（共九位字符）
              第18位：校验码（共一位字符）
              */
            /* pattern: /[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}/g,*/
            pattern: /^([1,5,9][1,2,3,9]|[2,3,4,6,7,8,A,B,C,D,E,G,Y]1)\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/,
            message: '请输入正确的统一社会信用代码',
            trigger: 'blur'
          },
          { validator: validlegalbizLicNum, trigger: 'blur' }

        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        verificationCode: [
          { required: true, message: '请输入邮箱验证码', trigger: 'change' }
        ],
        //   InstitutionAddress: [
        //     { type: 'array',  required: true, message: '请填写机构地址', trigger: 'blur' }
        //   ],
        fileList: [
          { required: true, message: '请上传机构营业执照', trigger: 'change' }
        ],
        selectedOptions: [
          { required: true, message: '请选择所在城市', trigger: 'change' }
        ]
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
      options: [{
        value: 'zhinan',
        label: '指南',
        children: [{
          value: 'shejiyuanze',
          label: '设计原则',
          children: [{
            value: 'yizhi',
            label: '一致'
          }, {
            value: 'fankui',
            label: '反馈'
          }, {
            value: 'xiaolv',
            label: '效率'
          }, {
            value: 'kekong',
            label: '可控'
          }]
        }, {
          value: 'daohang',
          label: '导航',
          children: [{
            value: 'cexiangdaohang',
            label: '侧向导航'
          }, {
            value: 'dingbudaohang',
            label: '顶部导航'
          }]
        }]
      }],
      textHidden: false,
      regionOptions: regionData
    }
  },
  methods: {
    handleChange(value) {
      console.log(value)
    },
    getCode() {
      // 验证码60秒倒计时
      if (!this.timer) {
        this.timer = setInterval(() => {
          if (this.countdown > 0 && this.countdown <= 60) {
            this.countdown--
            if (this.countdown !== 0 && this.ruleForm.email) {
              this.codeMsg = '重新发送(' + this.countdown + 's )'
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
        type: 'register'
      }
      await getSendVerificationCode(formdata).then(res => {
        console.log(res)
      }).catch(error => {
        if (this.ruleForm.email === '') {
          this.$message({
            message: '请输入邮箱',
            type: 'warning'
          })
        }
        this.$message.error(error)
      })
    },
    dialogVisibleSucced() {
      this.dialogVisible = false
      this.$router.push('/login')
    },
    handleHttpRequestRegistered() {

    },
    onUploadChange(file, filelist) {
      console.log(file.raw, filelist)
      const isIMAGE = (file.raw.type === 'image/jpeg' || file.raw.type === 'image/png')
      // const isLt1M = file.size / 1024 / 1024 < 1

      if (!isIMAGE) {
        this.$message.error('只能上传jpg/png图片!')
        return false
      }
      // if (!isLt1M) {
      //   this.$message.error('上传文件大小不能超过 1MB!');
      //   return false;
      // }

      if (filelist.length && filelist.length >= 1) {
        this.ruleForm.fileList = file.raw
        /** 引用对象然后验证表单域-这个可以清除上一步不通过时的提示*/
        this.$refs.ruleForm.validateField('fileList')
      }
    },
    handleAvatarSuccess(file, fileList) {
      console.log('rrff', file)
      this.ruleForm.fileList = file.raw
      // 上传成功后，手动验证一次表单
      this.$refs.ruleForm.validateField('fileList')
    },
    handleRemove(file, fileList) {
      this.ruleForm.fileList = null
      this.$refs.ruleForm.validateField('fileList')
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    linkTo() {
      this.$router.push('/login')
    },
    submitForm(formName) {
      console.log(this.ruleForm.fileList, '566')
      const formdata = new FormData()

      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm.fileList, 'licenseFile')
          formdata.append('mobile', this.ruleForm.mobile)
          // formdata.append('orgCode', this.ruleForm.institutionCode)
          formdata.append('licenseFile', this.ruleForm.fileList)
          formdata.append('institutionName', this.ruleForm.institutionName)
          formdata.append('password', this.ruleForm.password)
          formdata.append('passwordCopy', this.ruleForm.passwordCopy)
          formdata.append('email', this.ruleForm.email)
          formdata.append('verificationCode', this.ruleForm.verificationCode)
          formdata.append('nickName', this.ruleForm.nickName)
          // 省市区
          const province = this.ruleForm.selectedOptions[0]
          const city = this.ruleForm.selectedOptions[1]
          const district = this.ruleForm.selectedOptions[2]
          formdata.append('province', province)
          formdata.append('city', city)
          formdata.append('district', district)
          getRegistered(formdata).then(res => {
            console.log(res, 'ddd')
            if (res.data.code === '10000') { // 成功
              this.dialogVisible = true
              this.textHidden = true
            } else { // 异常
              this.dialogVisible = true
              this.textHidden = false
            }
          }).catch(error => {
            this.$message.error(error)
          })
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
 .boxRegistered{
    width: 100%;
    .box-card{
      width: 100%;
      padding: 0;
      .rightBox{
       display: inline-block;
       float: right;
       margin-top: 10px;
       .fontColor{
           color: #FF5338;
           text-decoration: underline;
       }
       .fontColor:hover {
           cursor: pointer;
       }
      }
      .imgBox{
          width: 80%;
          margin: 10px auto;

          .title {
            display: inline;
          }
      }
  }
  .main {
      width: 100%;
      .main_container{
          width: 40%;
          margin: 0 auto;

          .fontStyle {
                  width: 100%;
                 text-align: center;
                 color: #FF5338;
          }
      }
  }
  .dialog-footer{
      text-align: center;
  }
  .dialogBox{
      text-align: center;
      img {
         width: 24px;
         vertical-align: middle;
         margin-right: 6px;

      }
      .dialogMT{
          margin-top: 10px;
      }
  }
 }

</style>
<style >
 .boxRegistered .el-header{
      padding: 0;
  }
  .boxRegistered .el-card__body{
        padding: 0;
  }
  .boxRegistered .el-radio__input.is-checked+.el-radio__label{
      color: #FF5338;
  }
 .boxRegistered .el-radio__input.is-checked .el-radio__inner{
     border-color: #FF5338;
    background: #FF5338;
  }
 .boxRegistered .el-radio__inner:hover{
      border: 1px solid #FF5338;
  }
  .boxRegistered .el-cascader {
      width: 100%;
  }
</style>
