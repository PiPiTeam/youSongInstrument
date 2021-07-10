<template>
  <div>
    <el-row type="flex" justify="end" class="mtb-10">
      <el-button @click="add">新增</el-button>
    </el-row>
    <el-table
      :data="tableData"
      border
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
          <el-button type="text" size="small" @click="handleClick(scope.row)">查看</el-button>
          <el-button type="text" size="small">修改</el-button>
          <el-button type="text" size="small" class="red-txt">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      width="30%"
      :title="dialog.title"
      :visible.sync="dialog.visible"
      append-to-body
    >
      <el-form ref="formRef" :model="dataForm" :rules="reviewRules" label-width="100px" label-position="right">
        <el-form-item label="活动名称" prop="activeName">
          <el-input v-model="dataForm.activeName" placeholder="请输入活动名称" />
        </el-form-item>
        <el-form-item label="发布时间" prop="pushDate">
          <el-date-picker v-model="dataForm.pushDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" />
        </el-form-item>
        <el-form-item label="预约人数" prop="likePeople">
          <el-input v-model="dataForm.likePeople" type="number" placeholder="请输入初始预约人数" />
        </el-form-item>
        <!-- <el-form-item label="评审意见" prop="reviewOpinion">
          <el-input v-model="dataForm.reviewOpinion" type="textarea" placeholder="请输入评审意见" class="review-name" rows="3" maxlength="500" show-word-limit />
        </el-form-item> -->
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
export default {

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
      dialog: {
        visible: false,
        title: '新增活动'
      },
      dataForm: {
        activeName: '',
        pushDate: '',
        likePeople: 0
      },
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
      reviewRules: {}
    }
  },
  methods: {
    handleClick(row) {
      console.log(row)
    },
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
