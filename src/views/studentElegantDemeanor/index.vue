<template>
  <div class="student-container">
    <el-row type="flex" justify="space-between">
      <h3>学员风采</h3>
      <span>
        <el-button class="mt-13" @click="addTearcher">新增</el-button>
      </span>
    </el-row>
    <div>
      <el-row v-for="(item, index) of student.studentList" :key="index" type="flex">
        <el-form :ref="'tearchForm'+index" v-model="student.studentList[index]" label-position="left" label-width="120px" style="width:85%;">
          <el-form-item :label="'学员'+(index+1)+'姓名'">
            <el-input v-model="item.title" placeholder="请输入" />
          </el-form-item>
          <el-form-item :label="'学员'+(index+1)+'介绍'">
            <el-input v-model="item.content" type="textarea" placeholder="请输入" />
          </el-form-item>
          <el-form-item v-if="item.id" :label="'学员'+(index+1)+'图片'" prop="imgFiles">
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
          <el-form-item v-else :label="'学员'+(index+1)+'图片'">
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
import { getStudentList, addStudent, deleteStudent, updataStudent, addStudentImg, deleteStudentImg } from '@/api/shop'
export default {
  name: 'StudentElegantDemeanor',
  data() {
    return {
      shopId: getShopId() || '',
      imgHost: process.env.VUE_APP_IMAGE_HOST,
      dialogVisible: false,
      dialogImageUrl: '',
      student: {
        studentList: [{
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
      this.student.studentList.push({
        title: '',
        content: '',
        imgFiles: []
      })
    },
    handleChange(file, fileList, index) {
      const item = this.student.studentList[index]
      item.imgFiles = fileList
      this.$set(this.student.studentList, index, item)
    },
    async deleteTearcher(item, index) {
      if (item.id) {
        const { data } = await deleteStudent({ ids: item.id })
        if (data.code === '10000') {
          this.student.studentList.splice(index, 1)
        }
      } else {
        this.student.studentList.splice(index, 1)
      }
    },
    submit(item, index) {
      console.log('提交', item, index)
      if (item.id) {
        // 编辑
        this._updataStudent({
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
        this._addStudent(formData, index)
      }
    },
    handleChangeUpdata(file, fileList, item, index) {
      this.uploadData.file = file.raw
      this.uploadData.id = item.id
      this.uploadData.index = index
    },
    async _addStudent(dataForm, index) {
      const { data } = await addStudent(dataForm)
      console.log(data)
      if (data.code === '10000') {
        this.$message.success(data.message)
        data.data.imgFileList.map(v => {
          v.url = this.imgHost + v.path + v.name
        })
        data.data.imgFiles = data.data.imgFileList
        this.$set(this.student.studentList, index, data.data)
      }
    },
    async _updataStudent(dataForm) {
      const { data } = await updataStudent(dataForm)
      console.log(data)
    },
    async _getTearchList() {
      const { data } = await getStudentList({ storeId: this.shopId })
      console.log(data)
      if (data.code === '10000') {
        data.data.map(item => {
          item.imgFileList.map(v => {
            v.url = this.imgHost + v.path + v.name
          })
          item.imgFiles = item.imgFileList
        })
      }
      this.student.studentList = data.data
      console.log(this.student.studentList)
    },
    async uploadFile() {
      const formData = new FormData()
      formData.append('files', this.uploadData.file)
      const { data } = await addStudentImg(this.uploadData.id, formData)
      if (data.code === '10000') {
        const index = this.uploadData.index
        const item = this.student.studentList[index]
        data.data.map(v => {
          item.imgFiles.push({
            id: v.id,
            name: v.name,
            url: this.imgHost + v.path + v.name
          })
        })
        this.$set(this.student.studentList, index, item)
      }
    },
    async handleRemove(file, id, index) {
      const formData = new FormData()
      formData.append('fileIds', file.id)
      const { data } = await deleteStudentImg(id, formData)
      if (data.code === '10000') {
        const item = this.student.studentList[index]
        for (const i in item.imgFiles) {
          if (item.imgFiles[i].id === file.id) {
            item.imgFiles.splice(i, 1)
            break
          }
        }
        this.$set(this.student.studentList, index, item)
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

