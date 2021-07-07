<template>
  <div class="user-container">
    <div class="task-table">
      <div class="tab-title">数据查询</div>
      <div class="flex-from">
        <div>
          <el-input
            v-model="query.username"
            size="medium"
            placeholder="请输入用户名"
            prefix-icon="el-icon-search"
            class="search-input w368"
            clearable
          />
          <div class="add-atlas" @click="_getPageList">
            <span>搜索</span>
          </div>
          <div class="text-btn" @click="requestTable">重置</div>
        </div>
        <div class="add-atlas" @click="addUser">
          <span>添加</span>
        </div>
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
        <el-table-column prop="userName" label="用户姓名" align="left" />
        <el-table-column prop="userId" label="用户账号" align="left" />
        <el-table-column prop="userSubjection" label="用户隶属" align="left" />
        <el-table-column prop="roleList" label="角色" align="left">
          <template slot-scope="scope">
            <el-tag v-for="item in scope.row.roleList" :key="item.roleCode" class="role-tag">{{ item.roleName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="left" />
        <el-table-column prop="review" label="审核状态" align="left">
          <template slot-scope="scope">
            <span v-if="scope.row.review === 0" size="small">未审核</span>
            <span v-else-if="scope.row.review === 1" size="small" type="info">已审核</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="left">
          <template slot-scope="scope">
            <!-- <div class="check-btn" @click="viewFn(scope.row)">查看</div> -->
            <div class="check-btn" @click="editFn(scope.row)">编辑</div>
            <!-- <div v-if="!scope.row.roleList.length" class="check-btn">分配角色</div> -->
            <div class="mark-btn" @click="deleteFn(scope.row)">删除</div>
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
    <!-- 添加或修改对话框 -->
    <el-dialog :title="operation ? '新增用户' : '编辑用户'" :visible.sync="dialogVisible" center @close="closeDialog">
      <el-form ref="dataFormRef" :model="dataForm" :rules="rules" label-width="80px" size="small" label-position="right" auto-complete="off">
        <input id="userName" type="text" class="hide">
        <input id="passWord" type="password" class="hide">
        <el-form-item label="用户账号" prop="userId" required>
          <el-input v-model="dataForm.userId" auto-complete="off" placeholder="请输入用户名" :disabled="operation?false:true" />
        </el-form-item>

        <el-form-item label="用户姓名" prop="userName" required>
          <el-input v-model="dataForm.userName" auto-complete="off" placeholder="请输入用户姓名" />
        </el-form-item>

        <el-form-item label="密码" prop="password" required>
          <el-input v-model="dataForm.password" auto-complete="off" placeholder="请输入密码" show-password />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword" required>
          <el-input v-model="dataForm.confirmPassword" auto-complete="off" placeholder="请确认密码" show-password />
        </el-form-item>

        <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model="dataForm.userEmail" auto-complete="off" placeholder="请输入邮箱" />
        </el-form-item>

        <el-form-item label="用户隶属" prop="userSubjection" required>
          <el-input v-model="dataForm.userSubjection" auto-complete="off" placeholder="本机构人员请填写部门与职务，外包机构人员请填写机构名称与职务" />
        </el-form-item>

        <!-- <el-form-item label="角色" prop="roleList" required>
          <el-select v-model="dataForm.roleList" :disabled="!operation" multiple placeholder="请分配用户角色" style="width: 100%;">
            <el-option
              v-for="item in roles"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
            />
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getUserList, deleteUser, addUser, updateUser } from '@/api/user'
import { getSysList } from '@/api/sys'

export default {
  name: 'Dashboard',
  components: {
    Pagination
  },
  filters: {},
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.dataForm.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      query: {
        username: '',
        orgUuid: localStorage.getItem('orgUuid') // 机构id
      },
      loading: false,
      tableData: [],
      pager: {
        current: 1,
        size: 10,
        total: 1
      },
      roles: [],
      dialogVisible: false,
      operation: true,
      formLabelWidth: '120px',
      dataForm: {
        orgUuid: localStorage.getItem('orgUuid'), // 机构id
        userId: '', // 账号
        userName: '', // 用户姓名
        password: '',
        confirmPassword: '',
        userEmail: '',
        userSubjection: '' // 用户隶属
        // roleList: []
      },
      rules: {
        // roleList: [{ required: true, message: '请分配角色', trigger: 'change' }],
        userId: [{ required: true, message: '请输入用户账号', trigger: ['blur', 'change'] }],
        userName: [{ required: true, message: '请输入用户姓名', trigger: ['blur', 'change'] }],
        userSubjection: [{ required: true, message: '请输入用户隶属', trigger: ['blur', 'change'] }],
        userEmail: [
          { required: true, message: '请输入邮箱', trigger: ['blur', 'change'] },
          { pattern: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/, message: '输入邮箱不合法' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请输入确认密码', trigger: ['blur', 'change'] },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
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
    this._getPageList()
    this._getSysList()
  },
  methods: {
    closeDialog() {
      this.dataForm = this.$options.data().dataForm
      this.$refs.dataFormRef.clearValidate()
      this.$refs.dataFormRef.resetFields()
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
    addUser() {
      this.dialogVisible = true
      this.operation = true
    },
    // viewFn() {},
    editFn(row) {
      this.dialogVisible = true
      this.operation = false
      row.password = ''
      row.confirmPassword = ''
      this.dataForm = Object.assign({}, row)
      const userRoles = []
      for (let i = 0, len = row.roleList.length; i < len; i++) {
        userRoles.push(row.roleList[i].roleId)
      }
      this.dataForm.roleList = userRoles
    },
    deleteFn(row) {
      this.$confirm('此操作将该用户删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const { data } = await deleteUser({ uuid: row.uuid })
          if (data.code === '200') {
            this.$message.success(data.message)
            this._getPageList()
          }
        })
    },
    submitForm() {
      this.$refs.dataFormRef.validate(async valid => {
        if (!valid) return
        const params = JSON.parse(JSON.stringify(this.dataForm))
        params.password = this.$md5(params.password)
        delete params.confirmPassword
        if (!this.operation) {
          // 编辑用户
          const { data } = await updateUser(params)
          this.submitCallback(data)
        } else {
          // 新增用户
          const { data } = await addUser(params)
          this.submitCallback(data)
        }
      })
    },
    submitCallback(data) {
      if (data.code === '200') {
        this.dialogVisible = false
        this.$message.success(data.message)
        this._getPageList()
      }
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
.user-container {
  background-color: #252737;
}
.hide {
  width: 0;
  height: 0;
  opacity: 0;
  padding: 0;
  border: 0;
  float: left;
}
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
  color: #FFF;
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
    line-height: 40px;
    background: #FF5338;
    border-radius: 6px;
    cursor: pointer;
    text-align: center;
    span {
      display: inline-block;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
    }
}
.text-btn{
  display: inline-block;
  margin-left: 20px;
  color: #FF5338;
  text-decoration-line: underline;
}

.el-input--medium .el-input__inner {
  height: 60px;
  line-height: 60px;
}
.user-container {
  .bg-border {
    width: 100%;
    height: 402px;
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
      padding: 0 14px;
      background: #fff;
      border-radius: 16px;
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
        border: 1px solid #FF5338;
        border-radius: 16px;
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
        border: 1px solid #FF5338;
        border-radius: 16px;
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
