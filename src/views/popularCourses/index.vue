<template>
  <!-- 热门课程 -->
  <div class="popular-courses">
    <el-row type="flex" justify="space-between" class="mtb-10">
      <div>
        <el-select v-model="query.coursesClassify" placeholder="课程分类筛选">
          <el-option label="全部" value="" />
          <el-option v-for="item in sortDialog.tableData" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </div>
      <div>
        <el-button @click="sortList">课程分类</el-button>
        <el-button @click="add">新增课程</el-button>
      </div>
    </el-row>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        prop="title"
        label="课程名称"
      />
      <el-table-column
        prop="courseSortId"
        label="课程分类"
      />
      <el-table-column
        prop="followUserNum"
        label="感兴趣人数"
      >
        <template slot-scope="scope">
          <span class="reservation-num" @click="showReservation(scope.row)">{{ scope.row.followUserNum }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="发布时间"
      />
      <el-table-column
        label="操作"
        width="150"
      >
        <template slot-scope="scope">
          <el-button size="mini" @click="edit(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <div class="paging">
      <pagination
        v-if="pager.total > 0"
        :total="pager.total"
        :page.sync="pager.current"
        :limit.sync="pager.size"
        @pagination="_getPageList"
      />
    </div> -->
    <el-dialog
      width="50%"
      top="5%"
      :title="dialog.title"
      :visible.sync="dialog.visible"
      append-to-body
      @close="dialogClose"
    >
      <el-form ref="formRef" :model="dataForm" :rules="rules" label-width="100px" label-position="right">
        <el-form-item label="课程名称" prop="title">
          <el-input v-model="dataForm.title" placeholder="请输入课程名称" />
        </el-form-item>
        <el-form-item label="课程分类" prop="courseSortId">
          <el-select v-model="dataForm.courseSortId" placeholder="请选择课程分类">
            <el-option v-for="item in sortDialog.tableData" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
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
    </el-dialog>
    <!-- 预览图片 -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="课程图片">
    </el-dialog>
    <!-- 课程关注列表 -->
    <el-dialog
      width="50%"
      :title="detailDialog.title"
      :visible.sync="detailDialog.visible"
      append-to-body
    >
      <el-table
        :data="detailDialog.tableData"
        style="width: 100%"
      >
        <el-table-column
          prop="nickname"
          label="用户名称"
        />
        <el-table-column
          prop="mobile"
          label="联系方式"
        />
        <el-table-column
          prop="status"
          label="兴趣状态"
        >
          <template slot-scope="scope">{{ scope.row.status == 1 ? '感兴趣' : '到店自提' }}</template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="操作时间"
        />
      </el-table>
      <div class="paging">
        <pagination
          v-if="followPage.total > 0"
          :total="followPage.total"
          :page.sync="followPage.current"
          :limit.sync="followPage.size"
          @pagination="_getProductFollowerPage"
        />
      </div>
    </el-dialog>
    <!-- 课程分类列表 -->
    <el-dialog
      width="50%"
      :title="sortDialog.title"
      :visible.sync="sortDialog.visible"
      append-to-body
    >
      <el-button @click="addsort">新建分类</el-button>
      <el-table
        :data="sortDialog.tableData"
        style="width: 100%"
        max-height="500"
      >
        <el-table-column
          prop="id"
          label="ID"
        />
        <el-table-column
          prop="name"
          label="分类名称"
        />
        <el-table-column
          prop="coverImage"
          label="封面"
        >
          <template slot-scope="scope"><el-image :src="imgHost + scope.row.coverImage" fit="contain" class="classify-img" /></template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="150"
        >
          <template slot-scope="scope">
            <el-button size="mini" @click="editSort(scope.row)">修改</el-button>
            <el-button type="danger" size="mini" @click="removeSort(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 课程分类列表弹窗 -->
    <el-dialog
      v-loading="courseSortLoading"
      width="50%"
      top="5%"
      :title="sortDialogs.title"
      :visible.sync="sortDialogs.visible"
      append-to-body
      @close="sortDialogsClose"
    >
      <el-form ref="formRefs" :model="dataForms" :rules="sortRules" label-width="100px" label-position="right">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="dataForms.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="分类图片" prop="fileList">
          <el-upload
            action="/"
            list-type="picture-card"
            :limit="1"
            :auto-upload="false"
            :on-change="handleChanges"
            :on-preview="handlePictureCardPreview"
            :file-list="dataForms.fileList"
          >
            <i class="el-icon-plus" />
          </el-upload>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center">
        <el-button type="primary" @click="submits">保存</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getShopId } from '@/utils/auth'
import { getCoursePageList, addCourse, updataCourse, addCourseImg, deleteCourseImg,
  deleteCourse, getCourseFollowerPage, getCourseSortList, addCourseSort, updateCourseSort, deleteCourseSort } from '@/api/shop'
export default {
  name: 'PopularCourses',
  data() {
    return {
      shopId: getShopId() || '',
      imgHost: process.env.VUE_APP_IMAGE_HOST,
      dialogVisible: false,
      dialogImageUrl: '',
      loading: false,
      tableData: [],
      coursesClassifyList: [],
      query: {
        coursesClassify: ''
      },
      dialog: {
        visible: false,
        title: '新增'
      },
      dataForm: {
        id: '',
        title: '',
        teacher: '',
        content: '',
        courseSortId: '',
        fileList: []
      },
      detailDialog: {
        visible: false,
        title: '',
        courseId: '',
        tableData: []
      },
      sortDialog: {
        visible: false,
        title: '',
        courseId: '',
        tableData: []
      },
      sortDialogs: {
        visible: false,
        title: '新增'
      },
      dataForms: {
        id: '',
        name: '',
        storeId: '',
        imageFile: '',
        fileList: []
      },
      followPage: {
        current: 1,
        size: 10,
        total: 0
      },
      file: '',
      courseSortLoading: false,
      sortRules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ],
        fileList: [
          { required: true, message: '请上传分类封面', trigger: 'blur' }
        ]
      },
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
        courseSortId: [
          { required: true, message: '请选择课程分类', trigger: 'change' }
        ],
        fileList: [
          { required: true, message: '请上传课程图片', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    // pages() {
    //   return { current: this.pager.current, size: this.pager.size }
    // },
    // queryParameter() {
    //   return Object.assign(this.pages, { storeId: this.shopId })
    // },
    followPages() {
      return { current: this.followPage.current, size: this.followPage.size }
    }
  },
  mounted() {
    this._getCoursePageList()
    this._getCourseSortList()
  },
  methods: {
    sortList() {
      this.sortDialog.title = '课程分类列表'
      this.sortDialog.visible = true
      this.followPage.current = 1
      this._getCourseSortList()
    },
    async _getCourseSortList() {
      try {
        this.courseSortLoading = true
        const { data } = await getCourseSortList({ storeId: this.shopId })
        this.sortDialog.tableData = data.data
      } finally {
        this.courseSortLoading = false
      }
    },
    addsort() {
      this.sortDialogs.title = '新增分类'
      this.sortDialogs.visible = true
    },
    sortDialogsClose() {
      this.sortDialogs.visible = false
      this.dataForms = this.$options.data().dataForms
    },
    editSort(row) {
      row.fileList = [
        {
          id: '',
          name: row.name,
          url: this.imgHost + row.coverImage
        }
      ]
      this.dataForms = { ...row }
      this.sortDialogs.title = '修改分类'
      this.sortDialogs.visible = true
    },
    async removeSort(row) {
      const formData = new FormData()
      formData.append('ids', row.id)
      const { data } = await deleteCourseSort(formData)
      if (data.code === '10000') {
        this._getCourseSortList()
      }
    },
    handleChanges(file, fileList) {
      const isIMAGE = (file.raw.type === 'image/jpeg' || file.raw.type === 'image/png')
      // const isLt1M = file.size / 1024 / 1024 < 1
      if (!isIMAGE) {
        this.$message.error('只能上传jpg/png图片!')
        return false
      }
      if (fileList.length && fileList.length >= 1) {
        this.dataForms.fileList = fileList
        /** 引用对象然后验证表单域-这个可以清除上一步不通过时的提示*/
        this.$refs.formRefs.validateField('fileList')
      }
    },
    submits() {
      this.$refs.formRefs.validate(valid => {
        if (!valid) return
        if (this.dataForms.id) {
          const formData = new FormData()
          formData.append('id', this.dataForms.id)
          formData.append('name', this.dataForms.name)
          if (this.dataForms.fileList.length && this.dataForms.fileList[0].raw) {
            formData.append(`imageFile`, this.dataForms.fileList[0].raw)
          }
          this._updateCourseSort(formData)
        } else {
          const formData = new FormData()
          formData.append('storeId', this.shopId)
          formData.append('name', this.dataForms.name)
          formData.append(`imageFile`, this.dataForms.fileList[0].raw)
          this._addCourseSort(formData)
        }
      })
    },
    async _addCourseSort(formData) {
      const { data } = await addCourseSort(formData)
      if (data.code === '10000') {
        this.$message.success(data.message)
        this.sortDialogsClose()
        this._getCourseSortList()
      }
    },
    async _updateCourseSort(formData) {
      const { data } = await updateCourseSort(formData)
      if (data.code === '10000') {
        this.$message.success(data.message)
        this.sortDialogsClose()
        this._getCourseSortList()
      }
    },
    add() {
      this.dialog.title = '新增'
      this.dialog.visible = true
    },
    edit(row) {
      row.imgFileList.map(v => {
        v.url = this.imgHost + v.path + v.name
      })
      row.fileList = row.imgFileList
      this.dataForm = { ...row }
      this.dialog.title = '修改'
      this.dialog.visible = true
    },
    async remove(row) {
      const formData = new FormData()
      formData.append('ids', row.id)
      const { data } = await deleteCourse(formData)
      if (data.code === '10000') {
        this._getCoursePageList()
      }
    },
    showReservation(row) {
      this.detailDialog.visible = true
      this.detailDialog.productId = row.id
      this.detailDialog.title = row.title + '课程详情'
      this.requestFollowTable()
    },
    requestFollowTable() {
      this.followPage.current = 1
      this._getProductFollowerPage()
    },
    async _getProductFollowerPage(pager) {
      pager && Object.assign(this.followPages, pager)
      const { data } = await getCourseFollowerPage(Object.assign(this.followPages, { productId: this.detailDialog.productId }))
      console.log(data)
      this.detailDialog.tableData = data.data.records
      this.followPage.current = data.data.current
      this.followPage.total = data.data.total
    },
    dialogClose() {
      this.cancel()
    },
    cancel() {
      this.dialog.visible = false
      this.dataForm = this.$options.data().dataForm
    },
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
            content: this.dataForm.content,
            courseSortId: this.dataForm.courseSortId
          })
        } else {
          const formData = new FormData()
          formData.append('storeId', this.shopId)
          formData.append('title', this.dataForm.title)
          formData.append('teacher', this.dataForm.teacher)
          formData.append('content', this.dataForm.content)
          formData.append('courseSortId', this.dataForm.courseSortId)
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
        this.cancel()
        this._getCoursePageList()
      }
    },
    async _updataCourse(formData) {
      const { data } = await updataCourse(formData)
      if (data.code === '10000') {
        this.$message.success(data.message)
        this.cancel()
      }
    },
    async _getCoursePageList() {
      try {
        this.loading = true
        const { data } = await getCoursePageList({ storeId: this.shopId })
        this.tableData = data.data
      } finally {
        this.loading = false
      }
      // if (data.data && data.data.length) {
      //   data.data[0].imgFileList.map(v => {
      //     v.url = this.imgHost + v.path + v.name
      //   })
      //   console.log(data.data[0].imgFileList)
      //   data.data[0].fileList = data.data[0].imgFileList
      //   this.dataForm = data.data[0]
      // }
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
.reservation-num {
  color: #409EFF;
  cursor: pointer;
}
.classify-img {
  width: 50px;
  height: 50px;
}
</style>
