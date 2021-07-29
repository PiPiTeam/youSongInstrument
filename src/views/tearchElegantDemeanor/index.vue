<template>
  <div class="tearcher-container">
    <el-row type="flex" justify="space-between">
      <h3>名师风采</h3>
      <span>
        <el-button class="mt-13" @click="addTearcher">新增</el-button>
      </span>
    </el-row>
    <div v-loading="loading">
      <el-row v-for="(item, index) of tearcher.tearcherList" :key="index" type="flex">
        <el-form :ref="'tearchForm'+index" v-model="tearcher.tearcherList[index]" label-position="left" label-width="120px" style="width:85%;">
          <el-form-item :label="'老师'+(index+1)+'姓名'">
            <el-input v-model="item.title" placeholder="请输入" />
          </el-form-item>
          <el-form-item :label="'老师'+(index+1)+'介绍'">
            <el-input v-model="item.content" type="textarea" placeholder="请输入" />
          </el-form-item>
          <el-form-item v-if="item.id" :label="'老师'+(index+1)+'图片'" prop="imgFiles">
            <div>
              <ul class="el-upload-list el-upload-list--picture-card f-l">
                <li v-for="_file in item.imgFiles" :key="_file.id" class="el-upload-list__item is-ready ">
                  <div>
                    <img :src="_file.url" alt="" class="el-upload-list__item-thumbnail">
                    <span class="el-upload-list__item-actions">
                      <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(_file)">
                        <i class="el-icon-zoom-in" />
                      </span>
                      <span class="el-upload-list__item-delete" @click="handleRemove(_file, item.id, index)">
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
                :on-change="(file, fileList) => {handleChangeUpdata(file, fileList, item, index)}"
              >
                <div v-show="item.imgFiles.length < 5" slot="default" class="el-upload el-upload--picture-card">
                  <i class="el-icon-plus" />
                  <input type="file" name="file" class="el-upload__input">
                </div>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item v-else :label="'老师'+(index+1)+'图片'">
            <el-upload
              action="/"
              list-type="picture-card"
              :auto-upload="false"
              :on-preview="handlePictureCardPreview"
              :on-change="(file, fileList) => {handleChange(file, fileList, index)}"
              :file-list="item.imgFiles"
            >
              <i class="el-icon-plus" />
            </el-upload>
          </el-form-item>
        </el-form>
        <div style="width:15%;">
          <el-button type="danger" icon="el-icon-delete" class="f-r" @click="deleteTearcher(item, index)" />
          <el-button type="primary" icon="el-icon-check" class="f-r mr-10" @click="submit(item, index)" />
        </div>
      </el-row>
    </div>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { getShopId } from '@/utils/auth'
import { getTearchList, addTeacher, deleteTeacher, updataTeacher, addTeacherImg, deleteTeacherImg } from '@/api/shop'
export default {
  name: 'TearchElegantDemeanor',
  data() {
    return {
      shopId: getShopId() || '',
      imgHost: process.env.VUE_APP_IMAGE_HOST,
      dialogVisible: false,
      dialogImageUrl: '',
      loading: true,
      tearcher: {
        tearcherList: [{
          title: '',
          content: '',
          imgFiles: []
        }]
      },
      uploadData: {
        index: 0,
        id: '',
        file: ''
      }
    }
  },
  computed: {

  },
  mounted() {
    this._getTearchList()
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    addTearcher() {
      this.tearcher.tearcherList.push({
        title: '',
        content: '',
        imgFiles: []
      })
    },
    handleChange(file, fileList, index) {
      const item = this.tearcher.tearcherList[index]
      item.imgFiles = fileList
      this.$set(this.tearcher.tearcherList, index, item)
    },
    async deleteTearcher(item, index) {
      if (item.id) {
        const { data } = await deleteTeacher({ ids: item.id })
        if (data.code === '10000') {
          this.tearcher.tearcherList.splice(index, 1)
        }
      } else {
        this.tearcher.tearcherList.splice(index, 1)
      }
    },
    submit(item, index) {
      console.log('提交', item, index)
      if (item.id) {
        // 编辑
        this._updataTeacher({
          id: item.id,
          title: item.title,
          content: item.content
        })
      } else {
        const formData = new FormData()
        formData.append('storeId', this.shopId)
        formData.append('title', item.title)
        formData.append('content', item.content)
        for (const i in item.imgFiles) {
          formData.append(`imgFiles[${i}]`, item.imgFiles[i].raw)
        }
        this._addTeacher(formData, index)
      }
    },
    handleChangeUpdata(file, fileList, item, index) {
      this.uploadData.file = file.raw
      this.uploadData.id = item.id
      this.uploadData.index = index
    },
    async _addTeacher(dataForm, index) {
      const { data } = await addTeacher(dataForm)
      if (data.code === '10000') {
        this.$message.success(data.message)
        data.data.imgFileList.map(v => {
          v.url = this.imgHost + v.path + v.name
        })
        data.data.imgFiles = data.data.imgFileList
        this.$set(this.tearcher.tearcherList, index, data.data)
      }
    },
    async _updataTeacher(dataForm) {
      const { data } = await updataTeacher(dataForm)
      this.$message.success(data.message)
    },
    async _getTearchList() {
      try {
        this.loading = true
        const { data } = await getTearchList({ storeId: this.shopId })
        if (data.code === '10000') {
          data.data.map(item => {
            item.imgFileList.map(v => {
              v.url = this.imgHost + v.path + v.name
            })
            item.imgFiles = item.imgFileList
          })
        }
        this.tearcher.tearcherList = data.data
      } finally {
        this.loading = false
      }
    },
    async uploadFile() {
      const formData = new FormData()
      formData.append('files', this.uploadData.file)
      const { data } = await addTeacherImg(this.uploadData.id, formData)
      if (data.code === '10000') {
        const index = this.uploadData.index
        const item = this.tearcher.tearcherList[index]
        data.data.map(v => {
          item.imgFiles.push({
            id: v.id,
            name: v.name,
            url: this.imgHost + v.path + v.name
          })
        })
        this.$set(this.tearcher.tearcherList, index, item)
      }
    },
    async handleRemove(file, id, index) {
      const formData = new FormData()
      formData.append('fileIds', file.id)
      const { data } = await deleteTeacherImg(id, formData)
      if (data.code === '10000') {
        const item = this.tearcher.tearcherList[index]
        for (const i in item.imgFiles) {
          if (item.imgFiles[i].id === file.id) {
            item.imgFiles.splice(i, 1)
            break
          }
        }
        this.$set(this.tearcher.tearcherList, index, item)
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
.mr-10 {
  margin-right: 10px;
}
</style>

