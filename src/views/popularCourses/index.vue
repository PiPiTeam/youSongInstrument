<template>
  <!-- 热门课程 -->
  <div class="popular-courses">
    <el-row v-if="!dataForm.id" class="red pl-20">暂无课程，请先创建课程</el-row>
    <el-form ref="formRef" :model="dataForm" :rules="rules" label-width="100px" label-position="right">
      <el-form-item label="课程名称" prop="title">
        <el-input v-model="dataForm.title" placeholder="请输入活动名称" />
      </el-form-item>
      <el-form-item label="授课老师" prop="teacher">
        <el-input v-model="dataForm.teacher" placeholder="请输入授课老师" />
      </el-form-item>
      <el-form-item label="课程介绍" prop="content">
        <el-input v-model="dataForm.content" type="textarea" placeholder="请输入课程介绍" class="review-name" rows="2" maxlength="200" show-word-limit />
      </el-form-item>
      <el-form-item v-if="dataForm.id" label="课程图片" prop="fileList">
        <div>
          <ul class="el-upload-list el-upload-list--picture-card f-l">
            <li v-for="_file in dataForm.fileList" :key="_file.id" class="el-upload-list__item is-ready ">
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
            :on-change="handleChangeUpdata"
          >
            <div v-show="dataForm.fileList.length < 5" slot="default" class="el-upload el-upload--picture-card">
              <i class="el-icon-plus" />
              <input type="file" name="file" class="el-upload__input">
            </div>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item v-else label="课程图片" prop="fileList">
        <el-upload
          action="/"
          list-type="picture-card"
          :auto-upload="false"
          :on-change="handleChange"
          :on-preview="handlePictureCardPreview"
          :file-list="dataForm.fileList"
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
import { getShopId } from '@/utils/auth'
import { getCoursePageList, addCourse, updataCourse, addCourseImg, deleteCourseImg } from '@/api/shop'
export default {
  name: 'PopularCourses',
  data() {
    return {
      shopId: getShopId() || '',
      imgHost: process.env.VUE_APP_IMAGE_HOST,
      dialogVisible: false,
      dialogImageUrl: '',
      dataForm: {
        id: '',
        title: '',
        teacher: '',
        content: '',
        fileList: []
      },
      file: '',
      rules: {
        title: [
          { required: true, message: '请输入课程名称', trigger: 'blur' }
        ],
        teacher: [
          { required: true, message: '请输入授课老师', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入课程介绍', trigger: 'blur' }
        ],
        fileList: [
          { required: true, message: '请上传课程图片', trigger: 'change' }
        ]
      }
    }
  },
  computed: {

  },
  mounted() {
    this._getCoursePageList()
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    async handleRemove(file) {
      const formData = new FormData()
      formData.append('fileIds', file.id)
      const { data } = await deleteCourseImg(this.dataForm.id, formData)
      if (data.code === '10000') {
        for (const i in this.dataForm.fileList) {
          if (this.dataForm.fileList[i].id === file.id) {
            this.dataForm.fileList.splice(i, 1)
            break
          }
        }
      }
    },
    handleChangeUpdata(file) {
      this.file = file.raw
    },
    handleChange(file, fileList) {
      const isIMAGE = (file.raw.type === 'image/jpeg' || file.raw.type === 'image/png')
      // const isLt1M = file.size / 1024 / 1024 < 1
      if (!isIMAGE) {
        this.$message.error('只能上传jpg/png图片!')
        return false
      }
      if (fileList.length && fileList.length >= 1) {
        this.dataForm.fileList = fileList
        /** 引用对象然后验证表单域-这个可以清除上一步不通过时的提示*/
        this.$refs.formRef.validateField('fileList')
      }
    },
    submit() {
      this.$refs.formRef.validate(valid => {
        if (!valid) return
        if (this.dataForm.id) {
          this._updataCourse({
            id: this.dataForm.id,
            title: this.dataForm.title,
            teacher: this.dataForm.teacher,
            content: this.dataForm.content
          })
        } else {
          const formData = new FormData()
          formData.append('storeId', this.shopId)
          formData.append('title', this.dataForm.title)
          formData.append('teacher', this.dataForm.teacher)
          formData.append('content', this.dataForm.content)
          for (const i in this.dataForm.fileList) {
            formData.append(`imgFiles[${i}]`, this.dataForm.fileList[i].raw)
          }
          this._addCourse(formData)
        }
      })
    },
    async _addCourse(formData) {
      const { data } = await addCourse(formData)
      if (data.code === '10000') {
        this.$message.success(data.message)
        this._getCoursePageList()
      }
    },
    async _updataCourse(formData) {
      const { data } = await updataCourse(formData)
      if (data.code === '10000') {
        this.$message.success(data.message)
      }
    },
    async _getCoursePageList() {
      const { data } = await getCoursePageList({ storeId: this.shopId })
      console.log(data.data)
      if (data.data && data.data.length) {
        data.data[0].imgFileList.map(v => {
          v.url = this.imgHost + v.path + v.name
        })
        console.log(data.data[0].imgFileList)
        data.data[0].fileList = data.data[0].imgFileList
        this.dataForm = data.data[0]
      }
    },
    async uploadFile() {
      const formData = new FormData()
      formData.append('files', this.file)
      const { data } = await addCourseImg(this.dataForm.id, formData)
      if (data.code === '10000') {
        data.data.map(v => {
          this.dataForm.fileList.push({
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
.popular-courses {
  margin-top: 20px;
}
</style>

