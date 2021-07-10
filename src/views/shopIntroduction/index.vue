<template>
  <div class="banner-container">
    <h3>店铺图片展示</h3>
    <el-upload
      action="/"
      list-type="picture-card"
      :auto-upload="false"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :file-list="fileList"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <h3>店铺图片展示</h3>
    <div>
      <el-input v-model="shopDesc" type="textarea" placeholder="请输入店铺介绍" />
    </div>
    <h3>名师风采</h3>
    <div>
      <!--  -->
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Atlas',
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: '',
      fileList: [],
      shopDesc: ''
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
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handleChange() {}
  }
}
</script>

<style lang="banner" scoped>

</style>

