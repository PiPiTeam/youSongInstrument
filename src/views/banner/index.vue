<template>
  <div class="banner-container">
    <h3>轮播图设置</h3>
    <el-upload
      action="/"
      list-type="picture-card"
      :limit="5"
      :auto-upload="true"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :file-list="fileList"
      :http-request="uploadFile"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <!-- <el-row type="flex" justify="center">
      <el-button type="primary" @click="submit">保存</el-button>
    </el-row> -->
    <el-dialog :visible.sync="dialogVisible" title="预览大图">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { getShopId } from '@/utils/auth'
import { getBannerList, addBanner, deleteBanner } from '@/api/shop'
export default {
  name: 'Atlas',
  data() {
    return {
      shopId: getShopId() || '',
      imgHost: process.env.VUE_APP_IMAGE_HOST,
      dialogVisible: false,
      dialogImageUrl: '',
      fileList: [],
      file: ''
    }
  },
  computed: {

  },
  mounted() {
    this._getBannerList()
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemove(file, fileList) {
      this._deleteBanner(file)
    },
    handleChange(file, fileList) {
      this._addBanner(file.raw)
    },
    async uploadFile() { // 上传交互动画
      const formData = new FormData()
      formData.append('files', this.file)
      formData.append('id', this.shopId)
      const { data } = await addBanner(this.shopId, formData)
      if (data.code === '10000') {
        console.log(this.fileList)
        data.data.map(v => {
          this.fileList.push({
            id: v.id,
            name: v.name,
            url: this.imgHost + v.path + v.name
          })
        })
      }
    },
    async _getBannerList() { // 获取已设置的banner
      const { data } = await getBannerList(this.shopId)
      const fileList = []
      data.data.map(v => {
        fileList.push({
          id: v.id,
          name: v.name,
          url: this.imgHost + v.path + v.name
        })
      })
      this.fileList = fileList
    },
    async _addBanner(file) {
      this.file = file
    },
    async _deleteBanner(file) {
      const formData = new FormData()
      formData.append('fileIds', file.id)
      formData.append('id', this.shopId)
      const { data } = await deleteBanner(this.shopId, formData)
      if (data.code === '10000') {
        for (const i in this.fileList) {
          if (this.fileList[i].id === file.id) {
            this.fileList.splice(i, 1)
            break
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

