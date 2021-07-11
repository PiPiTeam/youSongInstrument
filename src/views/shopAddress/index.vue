<template>
  <!-- 店铺地址 -->
  <div class="shop-address">
    <el-form ref="formRef" :model="dataForm" :rules="rules" label-width="100px" label-position="right">
      <el-form-item label="店铺名称" prop="shopName">
        <el-input v-model="dataForm.shopName" placeholder="请输入活动名称" />
      </el-form-item>
      <el-form-item label="店铺地址" prop="address">
        <el-input v-model="dataForm.address" placeholder="请输入店铺地址" />
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="dataForm.phone" placeholder="请输入联系电话" />
      </el-form-item>
      <el-form-item label="微信" prop="wx">
        <el-input v-model="dataForm.wx" placeholder="请输入微信" />
      </el-form-item>
      <el-form-item label="店铺Logo" prop="picList">
        <el-upload
          action="/"
          list-type="picture-card"
          :limit="1"
          :auto-upload="false"
          :on-preview="handlePictureCardPreview"
          :file-list="dataForm.picList"
        >
          <i class="el-icon-plus" />
        </el-upload>
      </el-form-item>
    </el-form>
    <el-row type="flex" justify="center">
      <el-button type="primary">保存</el-button>
    </el-row>
    <!-- 预览图片 -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="课程图片">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ShopAddress',
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: '',
      dataForm: {
        shopName: '',
        address: '',
        phone: '',
        wx: '',
        picList: []
      },
      rules: {}
    }
  },
  computed: {

  },
  mounted() {

  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.shop-address {
  margin-top: 20px;
}
</style>

