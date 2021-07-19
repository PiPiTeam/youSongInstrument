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
        prop="name"
        label="产品名称"
      />
      <el-table-column
        prop="reservation"
        label="感兴趣/到店自提人数"
      >
        <template slot-scope="scope">
          <span class="reservation-num" @click="showReservation(scope.row.reservation)">{{ scope.row.reservation }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="发布时间"
      />
      <el-table-column
        label="操作"
        width="150"
      >
        <template slot-scope="scope">
          <el-button size="mini">修改</el-button>
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
      :title="dialog.title"
      :visible.sync="dialog.visible"
      append-to-body
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
        <el-form-item label="产品图片" prop="picList">
          <el-upload
            action="/"
            list-type="picture-card"
            :auto-upload="false"
            :on-preview="handlePictureCardPreview"
            :file-list="dataForm.picList"
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
          prop="name"
          label="用户名称"
        />
        <el-table-column
          prop="phone"
          label="联系方式"
        />
        <el-table-column
          prop="address"
          label="感兴趣/到店自提"
        />
        <el-table-column
          prop="date"
          label="操作时间"
        />
      </el-table>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { getShopId } from '@/utils/auth'
import { getProductPageList } from '@/api/shop'
import Pagination from '@/components/Pagination'
export default {
  name: 'BestSellingGoods',
  components: {
    Pagination
  },
  data() {
    return {
      shopId: getShopId() || '',
      dialogVisible: false,
      dialogImageUrl: '',
      loading: false,
      tableData: [],
      dialog: {
        visible: false,
        title: '新增产品'
      },
      dataForm: {
        title: '',
        content: '',
        marketPrice: '',
        discountPrice: '',
        picList: []
      },
      detailDialog: {
        visible: false,
        title: '雅马哈吉他销售详情',
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          phone: '18229952439',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          phone: '18229952439',
          address: '上海市普陀区金沙江路 1517 弄'
        }]
      },
      pager: {
        current: 1,
        size: 10,
        total: 1
      },
      rules: {}
    }
  },
  computed: {
    pages() {
      return { current: this.pager.current, size: this.pager.size }
    },
    queryParameter() {
      return Object.assign(this.pages, { storeId: this.shopId })
    }
  },
  mounted() {
    this.pager.current = 1
    this._getPageList()
  },
  methods: {
    add() {
      this.dialog.visible = true
    },
    submit() {

    },
    cancel() {
      this.dialog.visible = false
    },
    showReservation(reservation) {
      this.detailDialog.visible = true
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
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
