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
        prop="name"
        label="活动名称"
      />
      <el-table-column
        prop="date"
        label="发布时间"
      />

      <el-table-column
        prop="reservation"
        label="预约人数"
      >
        <template slot-scope="scope">
          <span class="reservation-num" @click="showReservation(scope.row.reservation)">{{ scope.row.reservation }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="修改时间"
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
          prop="name"
          label="用户名称"
        />
        <el-table-column
          prop="phone"
          label="联系方式"
        />
        <el-table-column
          prop="date"
          label="操作时间"
        />
        <el-table-column
          prop="address"
          label="预约状态"
        />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
export default {
  name: 'NewActivity',
  components: {
    Pagination
  },
  data() {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        reservation: 200
      }, {
        date: '2016-05-04',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1517 弄',
        reservation: 333
      }],
      detailDialog: {
        visible: false,
        title: '西西活动预约情况',
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
      reviewRules: {}
    }
  },
  methods: {
    add() {
      this.$router.push({ path: 'add', query: { id: 0 }})
    },
    showReservation(reservation) {
      this.detailDialog.visible = true
    },
    _getPageList() {

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
