<template>
  <div class="user-container">
    <div class="task-table">
      <div class="tab-title">数据查询</div>
      <div class="flex-from">
        <div>
          <el-input
            v-model="pager.userName"
            size="medium"
            placeholder="请输入用户名"
            prefix-icon="el-icon-search"
            class="input-with-select w200"
            style="margin-bottom:10px"
            clearable
          />
          <div class="add-atlas" @click="_getPageList">
            <span>搜索</span>

          </div>
          <div class="text-btn" @click="requestTable">重置</div>
        </div>
        <!-- <div class="add-atlas" @click="addUser">
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
        <el-table-column prop="userId" label="用户账号" />
        <el-table-column prop="userEmail" label="邮箱" />
        <el-table-column prop="userSubjection" label="机构类型">
          <template slot-scope="scope">
            <span v-if="scope.row.orgType === '0'">器械厂商</span>
            <span v-if="scope.row.orgType === '1'">医疗机构</span>
            <span v-if="scope.row.orgType === '2'">监管机构</span>

          </template>

        </el-table-column>
        <el-table-column prop="orgName" label="机构名称" />
        <el-table-column prop="orgCode" label="机构代码" />
        <el-table-column prop="createTime" label="机构营业执照">
          <template slot-scope="scope">

            <img :src=" basurl + '/static'+ scope.row.orgLicenseFile" alt="" width="60">
          </template>

        </el-table-column>
        <el-table-column prop="orgProfiles" label=" 机构简介" />
        <!-- <el-table-column prop="createTime" label=" 英文名称"  /> -->
        <!-- <el-table-column prop="status" label="状态"  /> -->
        <el-table-column label="操作">
          <template slot-scope="scope">

            <div class="check-btn" @click="openBox(scope.row)">操作</div>

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
    <el-dialog
      title="用户审核"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <div>
        <h4 style="display: inline-block;">审核状态：</h4> <el-select v-model="valueSelect" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <h4> 审核意见：</h4> <el-input
          v-model="textarea"
          type="textarea"
          placeholder="请输入内容"
          :rows="3"
          maxlength="50"
          show-word-limit
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="getreviewUser()">确 定</el-button>

        <el-button @click="dialogVisible = false">取 消</el-button>

      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getReviewUserList, getreviewUser } from '@/api/user'

export default {
  name: 'Dashboard',
  components: {
    Pagination
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
      options: [{
        value: '1',
        label: '审核通过'
      }, {
        value: '2',
        label: '审核不通过'
      }],
      textarea: '',
      valueSelect: '',
      dialogVisible: false,
      valueBox: null,
      basurl: process.env.VUE_APP_BASE_API,
      query: {
        username: '',
        userUuid: localStorage.getItem('uuid'),
        roleCode: localStorage.getItem('roleCode')
      },
      loading: false,
      tableData: [],
      pager: {
        current: 1,
        size: 10,
        total: 100,
        userName: ''
      },
      roles: [],
      operation: true,
      formLabelWidth: '120px',
      dataForm: {
        email: '',
        username: '', // 用户姓名
        password: '',
        confirmPassword: '',
        userEmail: '',
        userSubjection: '', // 用户隶属
        roleList: []
      },
      rules: {}
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
      return Object.assign(this.pager)
    }
  },
  mounted() {
    this._getPageList()
  },
  methods: {
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
    addUser() {
      this.dialogVisible = true
      this.operation = true
    },

    async _getPageList(pager) {
      console.log(pager, '///')
      try {
        // pager && Object.assign(this.pager, pager)
        this.loading = true
        this.queryParameter.userName = this.pager.userName

        const { data } = await getReviewUserList(this.queryParameter)
        this.tableData = data.data.records
        this.pager.current = data.data.current
        this.pager.total = data.data.total
        this.loading = false
      } finally {
        this.loading = false
      }
    },
    openBox(value) {
      this.dialogVisible = true
      this.valueBox = value
      console.log(this.valueBox, 'tyty')
    },
    async getreviewUser(value) {
      if (this.valueSelect) {
        const formdata = new FormData()
        formdata.append('targetEmailAddress', this.valueBox.userEmail)
        formdata.append('uuid', this.valueBox.uuid)
        formdata.append('webUrl', window.location.host)
        formdata.append('orgName', this.valueBox.orgName)
        formdata.append('reviewStatus', this.valueSelect)
        formdata.append('reviewOpinion', this.textarea)
        const { data } = await getreviewUser(formdata)
        if (data.code === '200') {
          this.$message({
            message: '审核通过！',
            type: 'warning'
          })
          this._getPageList()
          this.dialogVisible = false
        } else {
          this.$message.error(data.message)
        }
      } else {
        this.$message({
          message: '请选择审核状态',
          type: 'warning'
        })
      }
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
.w100{
  width: 100px;
}
.w150{
  width: 150px;
}
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
.btn-one{
  margin-left: 12px;
  background: #fff;
  color: #FF5338;
  box-shadow: none;
  border: 1px solid #FF5338;
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
.text-btn{
  display: inline-block;
  margin-left: 20px;
  color: #FF5338;
  text-decoration-line: underline;
}

.user-container {
  .bg-border {
    width: 100%;
    height: 402px;
    background: rgba(255, 255, 255, 1);
  }
  .task-table {
    min-height: 544px;
    left: 30px;
    margin-top: 20px;
    width: 100%;
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
.role-tag {
  margin: 0 3px;
  color: #FF5338;
  background-color: rgba(254, 136, 102, 0.1);
  border-color: rgba(254, 136, 102, 0.2);
}
</style>
