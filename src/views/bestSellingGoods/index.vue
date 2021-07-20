<template>
  <div>
    <el-row type="flex" justify="end" class="mtb-10">
      <el-button @click="add">新增</el-button>
    </el-row>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        prop="title"
        label="产品名称"
      />
      <el-table-column
        prop="followUserNum"
        label="感兴趣/到店自提人数"
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
          <el-button type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="paging">
      <pagination
        v-if="pager.total > 0"
        :total="pager.total"
        :page.sync="pager.current"
        :limit.sync="pager.size"
        @pagination="_getPageList"
      />
    </div>

    <el-dialog
      width="50%"
      top="5%"
      :title="dialog.title"
      :visible.sync="dialog.visible"
      append-to-body
      @close="dialogClose"
    >
      <el-form ref="formRef" :model="dataForm" :rules="rules" label-width="100px" label-position="right">
        <el-form-item label="产品名称" prop="title">
          <el-input v-model="dataForm.title" placeholder="请输入活动名称" />
        </el-form-item>
        <el-form-item label="产品描述" prop="content">
          <el-input v-model="dataForm.content" type="textarea" placeholder="请输入产品描述" class="review-name" rows="2" maxlength="200" show-word-limit />
        </el-form-item>
        <el-form-item label="市场价" prop="marketPrice">
          <el-input v-model="dataForm.marketPrice" type="number" placeholder="请输入市场价" />
        </el-form-item>
        <el-form-item label="折扣价" prop="discountPrice">
          <el-input v-model="dataForm.discountPrice" type="number" placeholder="请输入折扣价" />
        </el-form-item>
        <el-form-item v-if="dataForm.id" label="产品图片" prop="fileList">
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
        <el-form-item v-else label="产品图片" prop="fileList">
          <el-upload
            action="/"
            list-type="picture-card"
            :auto-upload="false"
            :on-preview="handlePictureCardPreview"
            :on-change="handleChange"
            :file-list="dataForm.fileList"
          >
            <i class="el-icon-plus" />
          </el-upload>
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center" class="dialog-footer">
        <el-button @click="submit">提交</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-row>
    </el-dialog>
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
    <el-dialog :visible.sync="dialogVisible" title="图片预览">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { getShopId } from '@/utils/auth'
import { getProductPageList, addProduct, getProductFollowerPage, getProductById, updataProduct, addProductImg, deleteProductImg } from '@/api/shop'
import Pagination from '@/components/Pagination'
export default {
  name: 'BestSellingGoods',
  components: {
    Pagination
  },
  data() {
    return {
      shopId: getShopId() || '',
      imgHost: process.env.VUE_APP_IMAGE_HOST,
      dialogVisible: false,
      dialogImageUrl: '',
      loading: false,
      tableData: [],
      file: '',
      dialog: {
        visible: false,
        title: '新增'
      },
      dataForm: {
        id: '',
        title: '',
        content: '',
        marketPrice: '',
        discountPrice: '',
        fileList: []
      },
      detailDialog: {
        visible: false,
        title: '',
        productId: '',
        tableData: []
      },
      pager: {
        current: 1,
        size: 10,
        total: 1
      },
      followPage: {
        current: 1,
        size: 10,
        total: 0
      },
      rules: {
        title: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入产品描述', trigger: 'blur' }
        ],
        marketPrice: [
          { required: true, message: '请输入市场价', trigger: 'blur' }
        ],
        discountPrice: [
          { required: true, message: '请输入折扣价', trigger: 'blur' }
        ],
        fileList: [
          { required: true, message: '请上传产品图片', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    pages() {
      return { current: this.pager.current, size: this.pager.size }
    },
    queryParameter() {
      return Object.assign(this.pages, { storeId: this.shopId })
    },
    followPages() {
      return { current: this.followPage.current, size: this.followPage.size }
    }
  },
  mounted() {
    this.requestTable()
  },
  methods: {
    requestTable() {
      this.pager.current = 1
      this._getPageList()
    },
    add() {
      this.dialog.title = '新增'
      this.dialog.visible = true
    },
    edit(row) {
      this._getProductById(row.id)
      this.dialog.title = '修改'
      this.dialog.visible = true
    },
    submit() {
      this.$refs.formRef.validate(valid => {
        if (!valid) return
        if (this.dataForm.id) {
          this._updataProduct({
            id: this.dataForm.id,
            title: this.dataForm.title,
            marketPrice: this.dataForm.marketPrice,
            discountPrice: this.dataForm.discountPrice,
            content: this.dataForm.content
          })
        } else {
          const formData = new FormData()
          formData.append('storeId', this.shopId)
          formData.append('title', this.dataForm.title)
          formData.append('marketPrice', this.dataForm.marketPrice)
          formData.append('discountPrice', this.dataForm.discountPrice)
          formData.append('content', this.dataForm.content)
          for (const i in this.dataForm.fileList) {
            formData.append(`imgFiles[${i}]`, this.dataForm.fileList[i].raw)
          }
          this._addProduct(formData)
        }
      })
    },
    dialogClose() {
      this.cancel()
    },
    cancel() {
      this.dialog.visible = false
      this.dataForm = this.$options.data().dataForm
    },
    showReservation(row) {
      this.detailDialog.visible = true
      this.detailDialog.productId = row.id
      this.detailDialog.title = row.title + '销售详情'
      this.requestFollowTable()
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
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    requestFollowTable() {
      this.followPage.current = 1
      this._getProductFollowerPage()
    },
    async _getPageList(pager) {
      try {
        pager && Object.assign(this.pager, pager)
        this.loading = true
        const { data } = await getProductPageList(this.queryParameter)
        console.log(data)
        this.tableData = data.data.records
        this.pager.current = data.data.current
        this.pager.total = data.data.total
        this.loading = false
      } finally {
        this.loading = false
      }
    },
    async _addProduct(formData) {
      const { data } = await addProduct(formData)
      if (data.code === '10000') {
        this.$message.success(data.message)
        this.requestTable()
        this.cancel()
      }
    },
    async _updataProduct(Data) {
      const { data } = await updataProduct(Data)
      if (data.code === '10000') {
        this.$message.success(data.message)
        this.requestTable()
        this.cancel()
      }
    },
    async _getProductFollowerPage(pager) {
      pager && Object.assign(this.followPages, pager)
      const { data } = await getProductFollowerPage(Object.assign(this.followPages, { productId: this.detailDialog.productId }))
      console.log(data)
      this.detailDialog.tableData = data.data.records
      this.followPage.current = data.data.current
      this.followPage.total = data.data.total
    },
    async _getProductById(id) {
      const { data } = await getProductById(id)
      if (data.code === '10000') {
        data.data.imgFileList.map(v => {
          v.url = this.imgHost + v.path + v.name
        })
        data.data.fileList = data.data.imgFileList
        this.dataForm = data.data
      }
    },
    async uploadFile() {
      const formData = new FormData()
      formData.append('files', this.file)
      const { data } = await addProductImg(this.dataForm.id, formData)
      if (data.code === '10000') {
        data.data.map(v => {
          this.dataForm.fileList.push({
            id: v.id,
            name: v.name,
            url: this.imgHost + v.path + v.name
          })
        })
      }
    },
    async handleRemove(file) {
      const formData = new FormData()
      formData.append('fileIds', file.id)
      const { data } = await deleteProductImg(this.dataForm.id, formData)
      if (data.code === '10000') {
        for (const i in this.dataForm.fileList) {
          if (this.dataForm.fileList[i].id === file.id) {
            this.dataForm.fileList.splice(i, 1)
            break
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.mtb-10 {
  margin: 10px 0;
}
.mr-10 {
  margin-right: 10px;
}
.reservation-num {
  color: #409EFF;
  cursor: pointer;
}
</style>
