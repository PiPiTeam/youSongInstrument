<template>
  <el-container class="audit-container">
    <el-header>
      <el-card class="box-card">
        <el-row
          class="imgBox"
          type="flex"
          justify="space-between"
          align="middle"
        >
          <h1 @click="$router.push('/login')">优颂乐器</h1>
          <span class="rightBox">
            <span class="fontColor" @click="logoutUser">重新登录</span></span>
        </el-row>
      </el-card>
    </el-header>
    <el-main class="main">
      <div class="main_container">
        <h3 class="fontStyle">入驻审核状态： {{ auditTxt(auditStatus) }}</h3>
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="nickName">
            <el-input
              v-model.number="ruleForm.nickName"
              placeholder="请输入您的用户名"
            />
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input
              v-model.number="ruleForm.mobile"
              placeholder="请输入您的手机号码"
            />
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
            <el-input
              v-model="ruleForm.institutionName"
              placeholder="请输入机构名称(工商注册名称)"
            />
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
              :file-list="ruleForm.fileListShow"
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
              <el-button
                size="small"
                type="primary"
                style="width: 160px;background:#FF5338 ;border:none;"
              >选择文件</el-button>
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
            <el-button
              type="primary"
              style="width:100%;margin:30px 0;background:#FF5338 ;border:none;"
              @click="submitForm('ruleForm')"
            >修改注册信息</el-button>
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
          <img src="../../assets/images/sad.png" alt=""><span
            style="color: red;"
          >操作失败</span>
          <div class="dialogMT">该机构已注册，请联系管理员咨询</div>
        </div>
        <div v-if="textHidden" class="dialogBox">
          <img src="../../assets/images/succeed.png" alt=""><span
            style="color: #1AD66C;"
          >操作成功</span>
          <div class="dialogMT">
            资料将在一个工作日完成审核，并以邮箱形式提示
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button
            v-if="textHidden"
            type="primary"
            style="margin:30px 0;background:#FF5338 ;border:none;"
            @click="dialogVisibleSucced()"
          >确 认</el-button>
          <el-button
            v-if="!textHidden"
            type="primary"
            style="margin:30px 0;background:#FF5338 ;border:none;"
            @click="dialogVisible = false"
          >确 认</el-button>
          <el-button plain @click="dialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import { regionData } from 'element-china-area-data'
import { updataRegistered } from '@/api/login'
import { getUserById } from '@/api/user'

export default {
  data() {
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
      let Ancode // 统一社会信用代码的每一个值
      let Ancodevalue // 统一社会信用代码每一个值的权重
      let total = 0
      const weightedfactors = [
        1,
        3,
        9,
        27,
        19,
        26,
        16,
        17,
        20,
        29,
        25,
        13,
        8,
        24,
        10,
        30,
        28
      ] // 加权因子
      // 不用I、O、S、V、Z
      const str = '0123456789ABCDEFGHJKLMNPQRTUWXY'
      for (let i = 0; i < value.length - 1; i++) {
        Ancode = value.substring(i, i + 1)
        Ancodevalue = str.indexOf(Ancode)
        total = total + Ancodevalue * weightedfactors[i]
        // 权重与加权因子相乘之和
      }
      let logiccheckcode = 31 - (total % 31)
      if (logiccheckcode === 31) {
        logiccheckcode = 0
      }
      const Str =
        '0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,T,U,W,X,Y'
      const Array_Str = Str.split(',')
      logiccheckcode = Array_Str[logiccheckcode]

      const checkcode = value.substring(17, 18)
      if (logiccheckcode !== checkcode) {
        return callback(new Error('校验失败，请输入正确的统一社会信用代码！'))
      }
      return callback()
    }

    return {
      userId: localStorage.getItem('youSongUserId'),
      imgHost: process.env.VUE_APP_IMAGE_HOST,
      auditStatus: '',
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
        institutionName: '',
        fileList: null,
        selectedOptions: [],
        fileListShow: []
      },
      rules: {
        nickName: [
          { required: true, message: '请输入您的用户名', trigger: 'change' }
        ],
        mobile: [
          { required: true, validator: checkPhone, trigger: 'blur' },
          { type: 'number', message: '手机号必须为数字值' }
        ],
        institutionName: [
          { required: true, message: '请输入机构名称', trigger: 'change' }
        ],
        institutionCode: [
          {
            required: true,
            message: '请输入社会统一信用代码',
            trigger: 'blur'
          },
          {
            type: 'string',
            len: 18,
            message: '输入有误，统一社会信用代码长度需为18位',
            trigger: 'change'
          },
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
      textHidden: false,
      regionOptions: regionData
    }
  },
  mounted() {
    this._getUserById(this.userId)
  },
  methods: {
    async _getUserById(id) {
      const { data } = await getUserById(id)
      this.ruleForm.nickName = data.data.nickName
      this.ruleForm.mobile = +data.data.mobile
      this.ruleForm.institutionName = data.data.institutionName
      this.ruleForm.selectedOptions = [
        data.data.province,
        data.data.city,
        data.data.district
      ]
      this.ruleForm.fileList = data.data.license
      this.ruleForm.fileListShow = [
        {
          id: '',
          name: data.data.license,
          url: this.imgHost + data.data.license
        }
      ]
      this.auditStatus = data.data.auditStatus
      console.log(this.ruleForm)
    },
    auditTxt(audit) {
      let auditStatusTxt = ''
      if (audit === 1) {
        auditStatusTxt = '通过'
      } else if (audit === 2) {
        auditStatusTxt = '待审核'
      } else {
        auditStatusTxt = '已驳回'
      }
      return auditStatusTxt
    },
    handleChange(value) {
      console.log(value)
    },
    dialogVisibleSucced() {
      this.dialogVisible = false
      this.$router.push('/login')
    },
    handleHttpRequestRegistered() {},
    onUploadChange(file, filelist) {
      console.log(file.raw, filelist)
      const isIMAGE =
        file.raw.type === 'image/jpeg' || file.raw.type === 'image/png'
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
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    submitForm(formName) {
      console.log(this.ruleForm.fileList, '566')
      const formdata = new FormData()

      this.$refs[formName].validate(valid => {
        if (valid) {
          formdata.append('id', this.userId)
          formdata.append('mobile', this.ruleForm.mobile)
          formdata.append('institutionName', this.ruleForm.institutionName)
          formdata.append('nickName', this.ruleForm.nickName)
          // 省市区
          const province = this.ruleForm.selectedOptions[0]
          const city = this.ruleForm.selectedOptions[1]
          const district = this.ruleForm.selectedOptions[2]
          formdata.append('province', province)
          formdata.append('city', city)
          formdata.append('district', district)
          // 文件
          if (
            typeof this.ruleForm.fileList !== 'string' &&
            this.ruleForm.fileList
          ) {
            formdata.append('licenseFile', this.ruleForm.fileList)
          }
          console.log(formdata)
          updataRegistered(formdata)
            .then(res => {
              console.log(res, 'ddd')
              if (res.data.code === '10000') {
                // 成功
                this.dialogVisible = true
                this.textHidden = true
              } else {
                // 异常
                this.dialogVisible = true
                this.textHidden = false
              }
            })
            .catch(error => {
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
    },
    async logoutUser() {
      await this.$store.dispatch('Logout')
      this.$router.push(`/login`) // redirect=${this.$route.fullPath}
      this.$store.dispatch('resetMapRouter')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
.audit-container {
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
      h1 {
        margin: 0;
      }
      .title {
        display: inline;
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
.audit-container .el-header {
  padding: 0;
}
.audit-container .el-card {
  padding: 0;
}
.audit-container .el-card__body {
  padding: 0;
}
.audit-container .el-radio__input.is-checked + .el-radio__label {
  color: #ff5338;
}
.audit-container .el-radio__input.is-checked .el-radio__inner {
  border-color: #ff5338;
  background: #ff5338;
}
.audit-container .el-radio__inner:hover {
  border: 1px solid #ff5338;
}
.audit-container .el-cascader {
  width: 100%;
}
</style>
