<template>
  <div class="user-container">
    <el-row type="flex" class="mt-20">
      <el-form v-model="query" :inline="true">
        <el-form-item label="名称">
          <el-input v-model="query.institutionName" placeholder="请输入名称" clearable />
        </el-form-item>
        <el-form-item label="入驻状态">
          <el-select v-model="query.auditStatus">
            <el-option label="已通过" :value="1" />
            <el-option label="待审核" :value="2" />
            <el-option label="已驳回" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="服务状态">
          <el-select v-model="query.enableStatus">
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="2" />
          </el-select>
        </el-form-item>
        <el-button @click="_getPageList">搜索</el-button>
        <el-button type="text" @click="requestTable">重置</el-button>
      </el-form>
    </el-row>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%;"
      highlight-current-row
    >
      <el-table-column prop="institutionName" label="用户绑定机构名" />
      <el-table-column prop="mobile" label="电话" />
      <el-table-column prop="quarterSales" label="近3个月拿货" sortable />
      <el-table-column prop="monthlySales" label="近1个月拿货" sortable />
      <el-table-column prop="auditStatus" label="入驻状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.auditStatus === 1" class="role-tag" type="success">已通过</el-tag>
          <el-tag v-else-if="scope.row.auditStatus === 2" class="role-tag">待审核</el-tag>
          <el-tag v-else-if="scope.row.auditStatus === 3" class="role-tag" type="danger">已驳回</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="enableStatus" label="服务状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.enableStatus === 1" class="role-tag" type="success">启用</el-tag>
          <el-tag v-else-if="scope.row.enableStatus === 2" class="role-tag" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="serviceId" label="服务ID" />
      <el-table-column prop="createTime" label="入驻时间" />
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button v-show="scope.row.auditStatus !== 1" size="mini" @click="showReview(scope.row.id)">审核</el-button>
          <el-button v-if="scope.row.enableStatus === 1" size="mini" type="danger" @click="_changeEnableStatus(2, scope.row.id)">关闭服务</el-button>
          <el-button v-else size="mini" @click="_changeEnableStatus(1, scope.row.id)">开启服务</el-button>
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
    <!-- 审核弹窗 -->
    <el-dialog
      title="入驻审核"
      :visible.sync="dialogVisible"
      width="50%"
      :show-close="false"
    >
      <el-form v-model="reviewData">
        <el-form-item label="机构名称">
          {{ reviewData.institutionName }}
        </el-form-item>
        <el-form-item label="电话">
          {{ reviewData.mobile }}
        </el-form-item>
        <el-form-item label="机构所在地区">
          <span>{{ CodeToText[reviewData.province] }} </span>
          <span>{{ CodeToText[reviewData.city] }} </span>
          <span>{{ CodeToText[reviewData.district] }}</span>
        </el-form-item>
        <el-form-item label="申请时间">
          {{ reviewData.createTime }}
        </el-form-item>
        <el-form-item label="营业执照">
          <el-image
            style="width: 100px; height: 100px"
            :src="license(reviewData.license)"
            :preview-src-list="[license(reviewData.license)]"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="_changeUserStatus(3)">驳回</el-button>
        <el-button type="primary" @click="_changeUserStatus(1)">通过</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { CodeToText } from 'element-china-area-data'
import { getUserList, getUserById, changeUserStatus, changeEnableStatus } from '@/api/user'

export default {
  name: 'User',
  components: {
    Pagination
  },
  filters: {},
  data() {
    return {
      CodeToText: CodeToText,
      query: {
        institutionName: '',
        auditStatus: '', // 入驻审核状态
        enableStatus: '' // 服务状态
      },
      loading: false,
      tableData: [],
      reviewData: {},
      dialogVisible: false,
      pager: {
        current: 1,
        size: 10,
        total: 1
      }
    }
  },
  computed: {
    pages() {
      return { current: this.pager.current, size: this.pager.size }
    },
    queryParameter() {
      return Object.assign(this.query, this.pages)
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
    showReview(id) {
      this._getUserById(id)
    },
    async _getPageList(pager) {
      try {
        pager && Object.assign(this.pager, pager)
        this.loading = true
        const { data } = await getUserList(this.queryParameter)
        this.tableData = data.data.records
        this.pager.current = data.data.current
        this.pager.total = data.data.total
        this.loading = false
      } finally {
        this.loading = false
      }
    },
    async _getUserById(id) {
      const { data } = await getUserById(id)
      this.reviewData = data.data
      this.dialogVisible = true
    },
    async _changeUserStatus(status) {
      const { data } = await changeUserStatus({ auditStatus: status, id: this.reviewData.id })
      if (data.code === '10000') {
        this.$message.success('入驻状态修改成功')
        this.dialogVisible = false
        this.reviewData = {}
        this._getPageList()
      }
    },
    async _changeEnableStatus(enableStatus, id) {
      const { data } = await changeEnableStatus({ enableStatus, id })
      if (data.code === '10000') {
        this.$message.success('服务状态修改成功')
        this._getPageList()
      }
    },
    license(url) {
      return `http://172.18.10.5:8001/static/${url}`
    }
  }
}
</script>

<style lang="scss" scoped>
.w200 {
  width: 200px;
}
.mt-20 {
  margin-top: 20px;
}
</style>
