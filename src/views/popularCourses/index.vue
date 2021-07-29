<template>
  <!-- 热门课程 -->
  <div class="popular-courses">
    <el-row type="flex" justify="space-between">
      <h3>热门课程</h3>
      <span>
        <el-button class="mt-13" @click="addCourses">新增</el-button>
      </span>
    </el-row>
    <el-row v-if="noCourses" class="red pl-20">暂无课程，请先创建课程</el-row>
    <div v-loading="loading">
      <el-row v-for="(item, index) of courses.coursesList" :key="index" type="flex">
        <el-form :ref="'coursesForm'+index" :model="courses.coursesList[index]" :rules="rules" label-width="100px" label-position="right" style="width:85%;">
          <el-form-item :label="'课程名称'+(index+1)" prop="title">
            <el-input v-model="item.title" placeholder="请输入活动名称" />
          </el-form-item>
          <el-form-item :label="'授课老师'+(index+1)" prop="teacher">
            <el-input v-model="item.teacher" placeholder="请输入授课老师" />
          </el-form-item>
          <el-form-item :label="'课程介绍'+(index+1)" prop="content">
            <el-input v-model="item.content" type="textarea" placeholder="请输入课程介绍" class="review-name" rows="2" maxlength="200" show-word-limit />
          </el-form-item>
          <el-form-item v-if="item.id" :label="'课程图片'+(index+1)" prop="imgFiles">
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
          <el-form-item v-else :label="'课程图片'+(index+1)">
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
          <el-button type="danger" icon="el-icon-delete" class="f-r" @click="_deleteCourse(item, index)" />
          <el-button type="primary" icon="el-icon-check" class="f-r mr-10" @click="submit(item, index)" />
        </div>
      </el-row>
    </div>
    <!-- <el-row type="flex" justify="center">
      <el-button type="primary" @click="submit">保存</el-button>
    </el-row> -->
    <!-- 预览图片 -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="课程图片">
    </el-dialog>
  </div>
</template>

<script>
import { getShopId } from '@/utils/auth'
import { getCoursePageList, addCourse, updataCourse, addCourseImg, deleteCourseImg, deleteCourse } from '@/api/shop'
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
      courses: {
        coursesList: []
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
      },
      uploadData: {
        index: 0,
        id: '',
        file: ''
      },
      noCourses: false,
      loading: false
    }
  },
  computed: {

  },
  mounted() {
    this._getCoursePageList()
  },
  methods: {
    addCourses() {
      this.courses.coursesList.push({
        id: '',
        title: '',
        teacher: '',
        content: '',
        imgFiles: []
      })
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    async handleRemove(file, id, index) {
      const formData = new FormData()
      formData.append('fileIds', file.id)
      const { data } = await deleteCourseImg(id, formData)
      if (data.code === '10000') {
        const item = this.courses.coursesList[index]
        for (const i in item.imgFiles) {
          if (item.imgFiles[i].id === file.id) {
            item.imgFiles.splice(i, 1)
            break
          }
        }
        this.$set(this.courses.coursesList, index, item)
      }
    },
    handleChangeUpdata(file, fileList, item, index) {
      this.uploadData.file = file.raw
      this.uploadData.id = item.id
      this.uploadData.index = index
    },
    handleChange(file, fileList, index) {
      const isIMAGE = (file.raw.type === 'image/jpeg' || file.raw.type === 'image/png')
      // const isLt1M = file.size / 1024 / 1024 < 1
      if (!isIMAGE) {
        this.$message.error('只能上传jpg/png图片!')
        return false
      }
      const item = this.courses.coursesList[index]
      item.imgFiles = fileList
      this.$set(this.courses.coursesList, index, item)
    },
    submit(item, index) {
      if (item.id) {
        this._updataCourse({
          id: item.id,
          title: item.title,
          teacher: item.teacher,
          content: item.content
        })
      } else {
        const formData = new FormData()
        formData.append('storeId', this.shopId)
        formData.append('title', item.title)
        formData.append('teacher', item.teacher)
        formData.append('content', item.content)
        for (const i in item.imgFiles) {
          formData.append(`imgFiles[${i}]`, item.imgFiles[i].raw)
        }
        this._addCourse(formData, index)
      }
    },
    async _addCourse(formData, index) {
      const { data } = await addCourse(formData)
      if (data.code === '10000') {
        if (data.code === '10000') {
          this.$message.success(data.message)
          data.data.imgFileList.map(v => {
            v.url = this.imgHost + v.path + v.name
          })
          data.data.imgFiles = data.data.imgFileList
          this.$set(this.courses.coursesList, index, data.data)
        }
      }
    },
    async _updataCourse(formData) {
      const { data } = await updataCourse(formData)
      this.$message.success(data.message)
    },
    async _getCoursePageList() {
      const { data } = await getCoursePageList({ storeId: this.shopId })

      if (data.data && data.data.length) {
        data.data.map(item => {
          item.imgFileList.map(v => {
            v.url = this.imgHost + v.path + v.name
          })
          item.imgFiles = item.imgFileList
        })
        this.courses.coursesList = data.data
        this.noCourses = false
      } else {
        this.noCourses = true
      }
    },
    async uploadFile() {
      const formData = new FormData()
      formData.append('files', this.uploadData.file)
      const { data } = await addCourseImg(this.uploadData.id, formData)
      if (data.code === '10000') {
        const index = this.uploadData.index
        const item = this.courses.coursesList[index]
        data.data.map(v => {
          item.imgFiles.push({
            id: v.id,
            name: v.name,
            url: this.imgHost + v.path + v.name
          })
        })
        this.$set(this.courses.coursesList, index, item)
      }
    },
    async _deleteCourse(item, index) {
      if (item.id) {
        const { data } = await deleteCourse({ ids: item.id })
        if (data.code === '10000') {
          this.courses.coursesList.splice(index, 1)
        }
      } else {
        this.courses.coursesList.splice(index, 1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.popular-courses {
  margin-top: 20px;
}
.f-r {
  float: right;
}
.mr-10 {
  margin-right: 10px;
}
</style>

