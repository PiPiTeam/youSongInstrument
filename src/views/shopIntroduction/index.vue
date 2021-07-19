<template>
  <div class="tearcher-container">
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
    <h3>本店介绍</h3>
    <div>
      <el-input v-model="shopDesc" :rows="3" type="textarea" placeholder="请输入店铺介绍" />
    </div>
    <el-row type="flex" justify="center" style="margin-top:10px;">
      <el-button type="primary" @click="_setIntro">保存本店介绍</el-button>
    </el-row>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="店铺图片">
    </el-dialog>
  </div>
</template>

<script>
import { getShopId } from '@/utils/auth'
import { getIntro, setIntro } from '@/api/shop'
export default {
  name: 'ShopIntroduction',
  data() {
    return {
      shopId: getShopId() || '',
      imgHost: process.env.VUE_APP_IMAGE_HOST,
      dialogVisible: false,
      dialogImageUrl: '',
      fileList: [],
      shopDesc: ''
    }
  },
  computed: {

  },
  mounted() {
    this._getIntro()
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handleChange() {

    },
    async _setIntro() {
      if (this.shopDesc) {
        const { data } = await setIntro(this.shopId, { content: this.shopDesc })
        if (data.code === '10000') {
          this.$message.success('操作成功')
        }
      } else {
        this.$message.warning('请输入本店介绍')
      }
    },
    async _getIntro() {
      const { data } = await getIntro(this.shopId)
      this.shopDesc = data.data.content
      console.log(data)
    }

  }
}
</script>

<style lang="scss" scoped>
.mt-13 {
  margin-top: 13px;
}
.f-r {
  float: right;
}
</style>

