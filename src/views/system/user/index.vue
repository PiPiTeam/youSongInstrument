<template>
  <div class="user-container">
    <el-row type="flex" class="mt-20">
      <el-form v-model="query" :inline="true">
        <el-form-item label="名称">
          <el-input v-model="query.username" placeholder="请输入名称" clearable />
        </el-form-item>
        <el-form-item label="入驻状态">
          <el-select v-model="query.enterStatus">
            <el-option label="已通过" value="1" />
            <el-option label="待审核" value="2" />
            <el-option label="已驳回" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="服务状态">
          <el-select v-model="query.serveStatus">
            <el-option label="开启" value="1" />
            <el-option label="关闭" value="2" />
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
      <el-table-column prop="name" label="用户绑定机构名" />
      <el-table-column prop="phone" label="电话" />
      <el-table-column prop="threeMonth" label="近3个月拿货" sortable />
      <el-table-column prop="oneMonth" label="近1个月拿货" sortable />
      <el-table-column prop="enterStatus" label="入驻状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.enterStatus === '1'" class="role-tag">已通过</el-tag>
          <el-tag v-else-if="scope.row.enterStatus === '2'" class="role-tag">待审核</el-tag>
          <el-tag v-else-if="scope.row.enterStatus === '3'" class="role-tag">已驳回</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="serveStatus" label="服务状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.serveStatus === '1'" class="role-tag">开启</el-tag>
          <el-tag v-else-if="scope.row.serveStatus === '2'" class="role-tag">关闭</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="serveCode" label="服务ID" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini">审核</el-button>
          <el-button size="mini" type="danger">关闭服务</el-button>
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
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getUserList } from '@/api/user'
import { getSysList } from '@/api/sys'

export default {
  name: 'User',
  components: {
    Pagination
  },
  filters: {},
  data() {
    return {
      query: {
        username: '',
        enterStatus: '',
        serveStatus: ''
      },
      loading: false,
      tableData: [
        {
          name: 'xxx琴行',
          phone: '13166665555',
          threeMonth: 120,
          oneMonth: 40,
          enterStatus: '1',
          serveStatus: '1',
          serveCode: 'adabadfa2234'
        }
      ],
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
    // this._getPageList()
    // this._getSysList()
  },
  methods: {
    requestTable() {

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
    async _getSysList() {
      const { data } = await getSysList({ size: 9999 })
      this.roles = data.data.records
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
