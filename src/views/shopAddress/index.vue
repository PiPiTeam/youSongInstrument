<template>
  <!-- 店铺地址 -->
  <div class="shop-address">
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
    </el-form>
    <el-row type="flex" justify="center">
      <el-button type="primary" @click="submit">保存</el-button>
    </el-row>
    <!-- 预览图片 -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="课程图片">
    </el-dialog>
  </div>
</template>

<script>
import { getShopList, addStore, updateStore } from '@/api/shop'
export default {
  name: 'ShopAddress',
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: '',
      dataForm: {
        id: '',
        name: '',
        address: '',
        phone: '',
        wechat: '',
        picList: []
      },
      isEdit: false,
      shopInfo: {},
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
        if (this.isEdit) {
          this._updateStore()
        } else {
          this._addStore()
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
        console.log(this.dataForm)
      }
    },
    async _addStore() {
      const formData = new FormData()
      formData.append('name', this.dataForm.name)
      formData.append('address', this.dataForm.address)
      formData.append('phone', this.dataForm.phone)
      formData.append('wechat', this.dataForm.wechat)
      formData.append('logoFile', this.dataForm.picList[0].raw)
      const { data } = await addStore(formData)
      console.log(data)
    },
    async _updateStore() {
      const { data } = await updateStore()
      console.log(data)
    }
  }
}
</script>

<style lang="scss" scoped>
.shop-address {
  margin-top: 20px;
}
</style>

