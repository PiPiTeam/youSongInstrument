<template>
  <div class="tearcher-container">
    <h3>店铺图片展示</h3>
    <el-row>
      <ul class="el-upload-list el-upload-list--picture-card f-l">
        <li v-for="_file in fileList" :key="_file.id" class="el-upload-list__item is-ready ">
          <div>
            <img :src="_file.url" alt="" class="el-upload-list__item-thumbnail">
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(_file)">
                <i class="el-icon-zoom-in" />
              </span>
              <span class="el-upload-list__item-delete" @click="handleRemove(_file)">
                <i class="el-icon-delete" />
              </span>
            </span>
          </div>
        </li>
      </ul>
      <el-upload
        class="f-l"
        action="/"
        :limit="5"
        :show-file-list="false"
        :auto-upload="true"
        :http-request="uploadFile"
        :on-change="handleChange"
      >
        <div v-show="fileList.length < 5" slot="default" class="el-upload el-upload--picture-card">
          <i class="el-icon-plus" />
          <input type="file" name="file" class="el-upload__input">
        </div>
      </el-upload>
    </el-row>
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
import { getIntro, setIntro, addIntroImg, deleteIntroImg } from '@/api/shop'
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
    async handleRemove(file) {
      const formData = new FormData()
      formData.append('fileIds', file.id)
      formData.append('id', this.shopId)
      const { data } = await deleteIntroImg(this.shopId, formData)
      if (data.code === '10000') {
        for (const i in this.fileList) {
          if (this.fileList[i].id === file.id) {
            this.fileList.splice(i, 1)
            break
          }
        }
      }
    },
    handleChange(file) {
      this.file = file.raw
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
      data.data.imgFileList.map(v => {
        v.url = this.imgHost + v.path + v.name
      })
      this.fileList = data.data.imgFileList
    },
    async uploadFile() { // 上传交互动画
      const formData = new FormData()
      formData.append('files', this.file)
      const { data } = await addIntroImg(this.shopId, formData) // 这个接口没给上传返回
      if (data.code === '10000') {
        data.data.map(v => {
          this.fileList.push({
            id: v.id,
            name: v.name,
            url: this.imgHost + v.path + v.name
          })
        })
      }
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

