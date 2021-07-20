<template>
  <div>
    <el-row type="flex" justify="end" class="mtb-10">
      <el-button @click="add">新增</el-button>
    </el-row>
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        prop="title"
        label="活动名称"
      />
      <el-table-column
        prop="createTime"
        label="发布时间"
      />

      <el-table-column
        prop="followUserNum"
        label="预约人数"
      >
        <template slot-scope="scope">
          <span class="reservation-num" @click="showReservation(scope.row)">{{ scope.row.followUserNum }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="修改时间"
      />
      <el-table-column
        label="操作"
        width="150"
      >
        <template slot-scope="scope">
          <el-button size="mini" @click="edit(scope.row.id)">修改</el-button>
          <el-button type="danger" size="mini" @click="_deleteActivity(scope.row.id)">删除</el-button>
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
    <!-- 详情 -->
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
          prop="updateTime"
          label="操作时间"
        />
        <el-table-column
          prop="status"
          label="预约状态"
        >
          <template slot-scope="scope">{{ scope.row.status == 1 ? '预约' : '想了解' }}</template>
        </el-table-column>
      </el-table>
      <div class="paging">
        <pagination
          v-if="followPage.total > 0"
          :total="followPage.total"
          :page.sync="followPage.current"
          :limit.sync="followPage.size"
          @pagination="_getActivityFollowPageList"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getShopId } from '@/utils/auth'
import { getActivityPageList, deleteActivity, getActivityFollowPageList } from '@/api/shop'
export default {
  name: 'NewActivity',
  components: {
    Pagination
  },

  data() {
    return {
      shopId: getShopId() || '',
      query: {},
      tableData: [],
      detailDialog: {
        visible: false,
        title: '活动预约情况',
        tableData: []
      },
      pager: {
        current: 1,
        size: 10,
        total: 1
      },
      reviewRules: {},
      followPage: {
        current: 1,
        size: 10,
        total: 0
      },
      activityId: ''
    }
  },
  computed: {
    pages() {
      return { current: this.pager.current, size: this.pager.size }
    },
    queryParameter() {
      return Object.assign(this.query, this.pages, { storeId: this.shopId })
    },
    followPages() {
      return { current: this.followPage.current, size: this.followPage.size }
    }
  },
  mounted() {
    this.pager.current = 1
    this._getPageList()
  },
  methods: {
    add() {
      this.$router.push({ path: 'add', query: { id: '' }})
    },
    edit(id) {
      this.$router.push({ path: 'add', query: { id: id }})
    },
    showReservation(reservation) {
      this.activityId = reservation.id
      this.requestFollowTable()
      this.detailDialog.visible = true
    },
    requestFollowTable() {
      this.followPage.current = 1
      this._getActivityFollowPageList()
    },
    async _getPageList(pager) {
      try {
        pager && Object.assign(this.pager, pager)
        this.loading = true
        const { data } = await getActivityPageList(this.queryParameter)
        console.log(data)
        this.tableData = data.data.records
        this.pager.current = data.data.current
        this.pager.total = data.data.total
        this.loading = false
        if (pager && pager.current) {
          this.$store.dispatch('page/changePage', {
            key: 'dashboard_page',
            value: pager.current
          })
        }
      } finally {
        this.loading = false
      }
    },
    async _deleteActivity(id) {
      const { data } = await deleteActivity({ ids: id })
      if (data.code === '10000') {
        this.$message.success('删除成功')
        this._getPageList()
      }
    },
    async _getActivityFollowPageList(pager) {
      pager && Object.assign(this.followPages, pager)
      const { data } = await getActivityFollowPageList(Object.assign(this.followPages, { activityId: this.activityId }))
      console.log(data)
      this.detailDialog.tableData = data.data.records
      this.followPage.current = data.data.current
      this.followPage.total = data.data.total
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
