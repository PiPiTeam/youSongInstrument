<template>
  <div class="dashboard-container">
    <div class="task-table">
      <div class="tab-title">数据查询</div>
      <div class="flex-from">
        <div>
          <el-input
            v-model="query.fileName"
            size="medium"
            placeholder="请输入名称/代码"
            prefix-icon="el-icon-search"
            class="input-with-select w200"
            style="margin-bottom:10px"
            clearable
          />
          <!-- <el-select size="medium" v-model="query.uuid" class="w100 input-with-select" placeholder="请选择">
            <el-option v-for="item in options" :key="item.uuid" :label="item.typeName" :value="item.uuid"></el-option>
          </el-select> -->
          <el-select v-model="query.manageClass" class="input-with-select w200" placeholder="请选择管理类型" clearable>
            <el-option label="一类" value="一类" />
            <el-option label="二类" value="二类" />
            <el-option label="三类" value="三类" />
          </el-select>
          <!-- <el-date-picker
            v-model="query.dateArea"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          /> -->
          <!-- <el-date-picker v-model="value1" type="date" size="medium" placeholder="有效日期范围" prefix-icon="el-icon-date" class="w150 selected"></el-date-picker> -->
          <div class="add-atlas" @click="_getPageList">
            <span>搜索</span>
          </div>
          <div class="text-btn" @click="requestTable">重置</div>
        </div>
        <!-- <div class="add-atlas" @click="showUpload">
          <span>添加</span>
        </div> -->
      </div>
      <div class="tab-title">数据列表</div>
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%;"
        highlight-current-row
      >
        <el-table-column prop="deviceName" label="产品名称/通用名称" align="left" />
        <el-table-column prop="deviceSpecification" label="规格型号" align="left" />
        <!-- <el-table-column prop="atlasTypeName" label="规格型号" align="left" width="150"></el-table-column> -->
        <el-table-column prop="deviceManageClass" label="管理类别" align="left" />
        <el-table-column prop="deviceProfile" label="产品描述" align="left" />
        <el-table-column prop="deviceStructure" label="结构及组成/主要组成成分" align="left" />
        <el-table-column label="注册状态" align="left">
          <template slot-scope="scope">
            {{ scope.row.deviceRegistState=='1' ? '有效':'无效' }}
          </template>
        </el-table-column>

        <!-- <el-table-column prop="createTime" width="200" label="结构及组成/主要组成成分" align="left" /> -->
        <el-table-column prop="updateTime" label="更新时间" align="center" />
        <el-table-column label="操作" align="left">
          <template slot-scope="scope">
            <div v-permission="'datas:review'" class="check-btn" @click="check(scope.row,'review')">评审</div>
            <div v-permission="'datas:view'" class="check-btn" @click="check(scope.row,'check')">查阅</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="paging">
        <pagination
          v-if="pager.total > 0"
          :total="pager.total"
          :page.sync="pager.current"
          :limit.sync="pager.size"
          :page-sizes="[6, 20, 30, 40]"
          @pagination="_getPageList"
        />
      </div>
    </div>

    <Review :device-data="reviewDetails" :visible="visible" :check-type="checkType" @close="close" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import Review from '@/components/Review'
import { getDeviceTypeList, getDeviceList, findUpload, deleteByIds, getDeviceDetail } from '@/api/task'

export default {
  name: 'Dashboard',
  components: {
    Pagination,
    Review
  },
  filters: {
    ellipsis(value) {
      if (!value) return ''
      if (value.length > 11) {
        return value.slice(0, 11) + '...'
      }
      return value
    }
  },
  data() {
    return {

      query: {
        deviceName: '',
        manageClass: '',
        dateArea: '',

        userUuid: localStorage.getItem('uuid'),
        roleCode: localStorage.getItem('roleCode')
      },
      reviewDetails: {},
      visible: false,
      checkType: '',
      tabelTwoData: [],
      loading: false,
      tableData: [], // status 0-未完成 1-已完成
      pager: {
        current: this.$store.state.page.dashboard_page, // 记录页码
        size: 6,
        total: 1
      },
      options: [],
      value1: ''
    }
  },
  computed: {
    pages() {
      return {
        current: this.pager.current,
        size: this.pager.size
      }
    },
    queryParameter() {
      return Object.assign(this.query, this.pager)
    },
    uploaded() {
      for (const key in this.progressObj) {
        if (this.progressObj[key].isUploading) return false
      }
      return true
    }
  },
  mounted() {
    console.log(localStorage.getItem('uuid'))
    this._getPageList()
    this._getDeviceTypeList()
  },
  methods: {
    fiterState(value, row) {
      const state = value === '1' ? '有效' : '无效'
      return state
    },
    handleClose(done) {
      done()
    },
    goMark(row) {
      this.$confirm('此操作将该条删除，是否继续?', '提示', {
        cancelButtonClass: 'btn-custom-cancel',
        confirmButtonText: '确定',
        confirmButtonClass: 'btn-custom-confirm',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this._deleteByIds(row.uuid)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    async _deleteByIds(uuid) {
      const { data } = await deleteByIds(uuid)
      this.$message({
        type: 'success',
        message: data.message
      })
      this.requestTable()
    },
    check(data, type) {
      this.reviewDetails = data
      this.visible = true
      this.checkType = type
    },
    async _getDeviceDetail(uuid) {
      const { data } = await getDeviceDetail({ deviceUuid: uuid })
      console.log(data)
      this.tabelTwoData = data.data.parameterList
    },
    requestTable() {
      this.query = {
        fileName: '',
        manageClass: '',
        userUuid: localStorage.getItem('uuid'),
        roleCode: localStorage.getItem('roleCode')
      }
      this.pager.current = 1
      this._getPageList()
    },
    async _getPageList(pager) {
      try {
        pager && Object.assign(this.pager, pager)
        this.loading = true
        const { data } = await getDeviceList(this.queryParameter)
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
    async _freeFilesUser(taskId, receiver) {
    },
    async _getDeviceTypeList(value) {
      const { data } = await getDeviceTypeList()

      data.data.forEach((item) => {
        item.children.forEach((ite) => {
          ite.children.forEach((i) => {
            delete i.children
          })
        })
      })
      this.options = data.data
    },
    showUpload() {
      this.dialogVisible = true
      this.form = {
        deviceName: '',
        deviceTypeUuid: '',
        file: '',
        manageClass: '',
        typeName: '',
        userUuid: localStorage.getItem('uuid')
      }
    },
    close() {
      this.visible = false
      this.dialogVisible = false
      this.form = {
        deviceName: '',
        deviceTypeUuid: '',
        file: '',
        manageClass: '',
        typeName: '',
        userUuid: localStorage.getItem('uuid')
      }
    },
    // 添加的上传
    submitForm() {
      this.$refs.form.validate(valid => {
        if (!valid) return
        this._findUpload()
      })
    },
    async _findUpload() {
      const formData = new FormData()
      formData.append('deviceName', this.form.deviceName)
      formData.append('deviceTypeUuid', this.form.deviceTypeUuid)
      formData.append('file', this.form.file)
      formData.append('manageClass', this.form.manageClass)
      formData.append('typeName', this.form.typeName)
      formData.append('userUuid', localStorage.getItem('uuid'))
      const { data } = await findUpload(formData)
      console.log(data)
      this.$message({
        type: 'success',
        message: data.message
      })
      this.requestTable()
      this.dialogVisible = false
      this.form = {
        deviceName: '',
        deviceTypeUuid: '',
        file: '',
        manageClass: '',
        typeName: '',
        userUuid: localStorage.getItem('uuid')
      }
    },

    changeDevice(e) {
      console.log(e, 'r')

      this.form.deviceTypeUuid = e.join(',')[3]
    }
  }
}
</script>

<style lang="scss">
.el-table::before {
  height: 0;
}

</style>

<style lang="scss" scoped>
.el-input__prefix,.el-input__suffix{
  color: #FF5338;
}
.top-bar{
  margin-top: 20px;
  padding-left: 20px;
  width: 100%;
  height: 88px;
  line-height: 88px;
  font-size: 16px;
  color: #636A7D;
  background: #FFFFFF;
  box-shadow: 2px 2px 12px 4px rgba(130,80,66,0.08);
  border-radius: 8px;
}
.text-tab{
  padding: 0 30px;
  display: inline-block;
}
.selected{
  color: #FF5338;
}
.tab-title{
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: #393F4E;
  line-height: 22px;
  font-weight: 500;
  margin-bottom: 20px;
}
.dialog-title{
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #333333;
  line-height: 24px;
  font-weight: 400;
  margin-bottom: 12px;
}
.dialog-title-two{
  margin-top: 32px;
}
.dialog-footer{
  display: flex;
  margin-top: 12px;
  justify-content: center;
  .btn{
    width: 120px;
    height: 32px;
    border-radius: 8px;
    color: #fff;
    box-shadow: none;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    text-align: center;
    line-height: 16px;
    font-weight: 500;
  }
  .btn-one{
    margin-left: 20px;
    background: #fff;
    color: #FF5338;
    border: 1px solid #FF5338;
  }
}

.paging{
  padding-bottom: 20px;
}

.btn-one{
  margin-left: 12px;
  background: #fff;
  color: #FF5338;
  box-shadow: none;
  border: 1px solid #FF5338;
}
.input-with-select{
  margin-right: 20px;
}
.add-atlas {
    margin: 8px 0px 0px 20px;
    display: inline-block;
    cursor: pointer;
    width: 74px;
    height: 40px;
    background: #FF5338 ;
    border-radius: 6px;
    cursor: pointer;
    text-align: center;
    line-height: 40px;
    span {
      display: inline-block;
      width: 52px;
      height: 20px;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 34px;
    }
}
.w100{
  width: 100px;
}
.w150{
  width: 150px;
}
.text-btn{
  display: inline-block;
  margin-left: 20px;
  color: #FF5338;
  text-decoration-line: underline;
}

.file-upload-btn{
  width: 70px;
  height: 32px;
  border-radius: 8px;
  font-family: PingFangSC-Medium;
  font-size: 14px;
  text-align: center;
  line-height: 4px;
  font-weight: 500;
  margin-left: 20px;
  background: #fff;
  color: #FF5338;
  border: 1px solid #FF5338;
}
.upload-content{
  width: 100px;
}

.upload-select{
  width: 100%;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 4px;
}
.dashboard {
  &-container {
    .bg-border {
      width: 100%;
      background: rgba(255, 255, 255, 1);
    }
    .task-table {
      left: 30px;
      width: 100%;
      margin-top: 20px;
      min-height: calc(100vh - 40px);
      border-radius: 5px;
      padding: 20px 20px 0 20px;
      .size1 {
        width: 10px;
        height: 5px;
        border-radius: 50%;
      }
      .selectItem {
        margin-left: 10px;
        width: 124px;
        height: 22px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(24, 28, 47, 1);
        line-height: 22px;
      }
      .status {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        display: inline-block;
        background: rgba(75, 243, 166, 1);
        margin-right: 4px;
      }
      .mark-btn,
      .check-btn {
        cursor: pointer;
        display: inline-block;
        height: 32px;
        padding: 0 10px;
        background: #fff;
        border-radius: 6px;
        border: 1px solid #FF5338;
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FF5338;
        line-height: 32px;
        text-align: center;
        &:hover {
          display: inline-block;
          height: 32px;
          line-height: 32px;
          background: #FF5338 ;
          border: 1px solid #e6e6e6;
          border-radius: 6px;
          color: #ffffff;
        }
      }
      .check-btn {
        cursor: pointer;
        margin-right: 5px;
        &:hover {
          display: inline-block;
          height: 32px;
          line-height: 32px;
          background: #FF5338 ;
          border: 1px solid #e6e6e6;
          border-radius: 6px;
          color: #ffffff;
        }
      }
    }
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
    width: 100%;
    background: rgba(255, 255, 255, 1);
    border-radius: 6px;
    margin-top: 20px;
    padding-bottom: 20px;
    .sub-title {
      width: 100px;
      height: 22px;
      font-size: 18px;
      font-family: PingFangSC-Medium;
      font-weight: 900;
      color: rgba(0, 0, 0, 0.81);
      line-height: 22px;
      padding-left: 20px;
    }
    .sub-name {
      width: 231px;
      height: 22px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(41, 47, 76, 1);
      line-height: 22px;
    }
    .date-time {
      top: 10px;
      width: 150px;
      height: 20px;
      background: rgba(250, 250, 250, 1);
    }
    .el-row {
      margin-top: 30px;
      margin-bottom: 20px;
      padding-left: 20px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .el-col {
      border-radius: 4px;
    }
    .grid-content {
      width: 460px; // 520px;
      height: 230px; // 260px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 2px 2px 12px 2px rgba(54,102,228,0.24);
      background: #ffffff;
      border-radius: 6px;
    }
    .row-bg {
      padding: 10px 0;
      background-color: #f9fafc;
      top: 30px;
    }
  }
}
.super {
  box-shadow: 2px 2px 8px 0 rgba(247,181,0, 0.55);
  background-image: linear-gradient(270deg, #fcdb00 0%, #f7b500 100%);
}
.manage {
  box-shadow: 2px 2px 8px 0 rgba(0,113,247, 0.55);
  background-image: linear-gradient(270deg, #669ff3 0%, #32c5ff 100%);
}
.mark {
  box-shadow: 2px 2px 8px 0 rgba(0,225,247, 0.55);
  background-image: linear-gradient(270deg, #66c3f3 0%, #32ffa6 100%);
}
.super,
.manage,
.mark {
  width: 82px;
  height: 24px;
  border-radius: 12px;
  border-radius: 12px;
  font-size: 12px;
  color: #ffffff;
  text-align: center;
  float: right;
  margin-top: 15px;
  line-height: 24px;
  span {
    font-family: PingFangSC-Medium;
    font-size: 12px;
    color: #ffffff;
  }
}
.flex-item {
  flex: 1;
  font-size: 20px;
  .item-line {
    line-height: 1;
    .title {
      font-size: 16px;
      color: #aeaeae;
    }
  }
  .num-line {
    text-indent: 30px;
    margin-top: 15px;
    margin-bottom: 10px;
    color: #333;
  }
  .circle {
    display: inline-block;
    width: 12px;
    height: 12px;
    background: #9a47ff;
    margin-right: 15px;
    border-radius: 2px;
    &.blue {
      background: #FF5338;
    }
    &.gradient {
      background: linear-gradient(224deg, #0190ff 0%, #7868ff 100%);
    }
  }
  /** 今日进度 */
  .charts-txt {
    color: #aeaeae;
    font-size: 22px;
    text-align: center;
    position: absolute;
    top: 142px;
    width: 100%;
    line-height: 22px;
    .text {
      font-size: 14px;
      margin-top: 10px;
    }
  }
}
.statistics-box {
  margin-top: 30px;
}
.atlas-type-name {
  white-space: nowrap;
  height: 40px;
  line-height: 40px;
  .atlastype-text {
    padding: 6px 10px;
    background: #ffffff;
    border: 1px solid #FF5338;
    border-radius: 6px;
    border-radius: 6px;
    cursor: pointer;
    &.ml-6 {
      margin-left: 6px;
    }
  }
}

</style>
