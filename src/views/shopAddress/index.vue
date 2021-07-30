<template>
  <!-- 店铺地址 -->
  <div class="shop-address">
    <el-row v-if="!dataForm.id" class="red pl-20">暂无店铺，请先创建店铺</el-row>
    <el-form ref="formRef" :model="dataForm" :rules="rules" label-width="100px" label-position="right">
      <el-form-item label="店铺名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入活动名称" />
      </el-form-item>
      <el-form-item label="店铺地址" prop="address">
        <el-input v-model="dataForm.address" placeholder="请输入店铺地址" />
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="dataForm.phone" placeholder="请输入联系电话" />
      </el-form-item>
      <el-form-item label="微信" prop="wechat">
        <el-input v-model="dataForm.wechat" placeholder="请输入微信" />
      </el-form-item>
      <el-form-item label="店铺Logo" prop="picList">
        <el-upload
          action="/"
          list-type="picture-card"
          :limit="1"
          :auto-upload="false"
          :on-preview="handlePictureCardPreview"
          :on-change="handleChange"
          :file-list="dataForm.picList"
        >
          <i class="el-icon-plus" />
        </el-upload>
      </el-form-item>
      <el-form-item label="App Id" prop="appId">
        <el-input v-model="dataForm.appId" placeholder="请输入App Id" />
      </el-form-item>
      <el-form-item label="App Secret" prop="appSecret">
        <el-input v-model="dataForm.appSecret" type="textarea" placeholder="请输入App Secret" />
      </el-form-item>
    </el-form>
    <el-row type="flex" justify="center">
      <el-button :loading="saveLoading" type="primary" @click="submit">保存</el-button>
    </el-row>
    <!-- 预览图片 -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="店铺Logo">
    </el-dialog>
  </div>
</template>

<script>
import { getShopList, addStore, updateStore } from '@/api/shop'
import { setShopId } from '@/utils/auth'
export default {
  name: 'ShopAddress',
  data() {
    return {
      imgHost: process.env.VUE_APP_IMAGE_HOST,
      dialogVisible: false,
      dialogImageUrl: '',
      dataForm: {
        id: '',
        name: '',
        address: '',
        phone: '',
        wechat: '',
        appId: '',
        appSecret: '',
        picList: []
      },
      isEdit: false,
      shopInfo: {},
      saveLoading: false,
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入电话', trigger: 'blur' }
        ],
        wechat: [
          { required: true, message: '请输入微信号', trigger: 'blur' }
        ],
        picList: [
          { required: true, message: '请上传Logo', trigger: 'change' }
        ],
        appId: [
          { required: true, message: '请输入App Id', trigger: 'blur' }
        ],
        appSecret: [
          { required: true, message: '请输入App Secret', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {

  },
  mounted() {
    this._getShopList()
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    submit() {
      this.$refs.formRef.validate(valid => {
        if (!valid) return
        const formData = new FormData()
        formData.append('name', this.dataForm.name)
        formData.append('address', this.dataForm.address)
        formData.append('phone', this.dataForm.phone)
        formData.append('address', this.dataForm.address)
        formData.append('appId', this.dataForm.appId)
        formData.append('appSecret', this.dataForm.appSecret)
        if (this.dataForm.picList.length && this.dataForm.picList[0].raw) {
          formData.append('logoFile', this.dataForm.picList[0].raw)
        }
        if (this.isEdit) {
          formData.append('id', this.dataForm.id)
          this._updateStore(formData)
        } else {
          this._addStore(formData)
        }
      })
    },
    handleChange(file, fileList) {
      this.dataForm.picList = fileList
      console.log(this.dataForm.picList)
    },
    async _getShopList() {
      const { data } = await getShopList()
      if (data.data && data.data.length) {
        this.isEdit = true
        this.dataForm = data.data[0]
        const nameArr = this.dataForm.logo.split('/')
        const filename = nameArr[nameArr.length - 1]
        this.dataForm.picList = [{
          name: filename,
          url: this.imgHost + this.dataForm.logo
        }]
        setShopId(this.dataForm.id)
        console.log(this.dataForm)
      }
    },
    async _addStore(formData) {
      try {
        this.saveLoading = true
        const { data } = await addStore(formData)
        if (data.code === '10000') {
          this.$message.success('保存成功')
          this._getShopList()
        }
      } finally {
        this.saveLoading = false
      }
    },
    async _updateStore(formData) {
      try {
        this.saveLoading = true
        const { data } = await updateStore(formData)
        console.log(data)
        this.$message.success('保存成功')
      } finally {
        this.saveLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.shop-address {
  margin-top: 20px;
}
</style>

