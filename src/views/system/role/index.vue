<template>
  <div class="dashboard-container">
    <div class="task-table">
      <div class="tab-title">数据查询</div>
      <div class="flex-from">
        <div>
          <el-input
            v-model="query.roleName"
            size="medium"
            placeholder="请输入名称"
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
        <div class="add-atlas" @click="showAdd">
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
        <el-table-column prop="roleName" label="角色名称" align="left" />
        <el-table-column prop="roleDescription" label="角色描述" align="left" />
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            {{ scope.row.status? '禁用' : '正常' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="left">
          <template slot-scope="scope">
            <div class="check-btn" @click="checkTask(scope.row)">编辑</div>
            <div class="check-btn" @click="goMark(scope.row)">删除</div>
            <div v-if="scope.row.status" class="mark-btn" @click="goForbidden(scope.row)">启用</div>
            <div v-if="!scope.row.status" class="mark-btn" @click="goForbidden(scope.row)">禁用</div>
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
    <el-dialog :title="isEdit?'编辑':'添加'" :visible.sync="dialogVisible" width="40%" top="10%" @close="close">
      <el-form ref="form" :model="form" :rules="rules" label-position="top">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" class="upload-select" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDescription">
          <el-input
            v-model="form.roleDescription"
            type="textarea"
            :rows="2"
            class="upload-select"
            placeholder="请输入角色描述"
          />
        </el-form-item>
        <el-form-item label="关联菜单" prop="menuId">
          <el-tree
            ref="tree"
            :props="props"
            :data="allMenuTree"
            node-key="menuId"
            :default-expanded-keys="checkedNodes"
            :default-checked-keys="checkedNodes"
            show-checkbox
            @check="handleCheckChange"
          />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center" class="dialog-footer">
        <div class="btn" @click="submitForm">
          <span>确认</span>
        </div>
        <div class="btn btn-one" @click="close">
          <span>取消</span>
        </div>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getSysList, getAllMenuTree, deleteByIds, disableRole, enableRole, addRole, updateRole, findMenusByRoleId } from '@/api/sys'

export default {
  name: 'Role',
  components: {
    Pagination
  },
  data() {
    return {
      query: {
        roleName: ''
      },
      dialogVisible: false,
      loading: false,
      tableData: [],
      pager: {
        current: this.$store.state.page.dashboard_page, // 记录页码
        size: 6,
        total: 1
      },
      form: {
        roleName: '',
        roleDescription: '',
        roleId: '',
        menuId: '',
        code: 'test',
        sysRoleMenus: [
          {
            menuId: '',
            roleId: '',
            roleMenuId: ''
          }
        ]
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'change' }
        ],
        roleDescription: [
          { required: false, message: '请输入角色描述', trigger: 'change' }
        ],
        menuId: [
          { required: true, message: '请选择角色关联的菜单', trigger: 'blur' }
        ]
      },
      props: {
        children: 'childMenu',
        label: 'name'
      },
      allMenuTree: [],
      checkedNodes: [],
      isEdit: false,
      roleId: ''
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
    }
  },
  mounted() {
    this._getPageList()
    this._getAllMenuTree()
  },
  methods: {
    handleClose(done) {
      done()
    },
    goMark(row) {
      this.$confirm('此操作将删除角色以及权限，是否继续?', '提示', {
        cancelButtonClass: 'btn-custom-cancel',
        confirmButtonText: '确定',
        confirmButtonClass: 'btn-custom-confirm',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this._deleteByIds(row.roleId)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    async _deleteByIds(roleId) {
      const { data } = await deleteByIds(roleId)
      this.$message({
        type: 'success',
        message: data.message
      })
      this.requestTable()
    },
    checkTask(row) {
      this.isEdit = true
      this.dialogVisible = true
      this._getDeviceDetail(row)
    },
    async _getDeviceDetail(row) {
      const { data } = await findMenusByRoleId({ roleId: row.roleId })
      const sysRoleMenus = []
      const menuId = []
      this.roleId = row.roleId
      data.data.map(element => {
        sysRoleMenus.push({
          menuId: element.menuId,
          roleId: row.roleId,
          roleMenuId: ''
        })
        menuId.push(element.menuId)
      })
      this.checkedNodes = menuId
      this.$refs.tree.setCheckedNodes(menuId)
      this.form = {
        roleName: row.roleName,
        roleId: row.roleId,
        roleDescription: row.roleDescription,
        menuId: menuId.join(','),
        code: 'test',
        sysRoleMenus: sysRoleMenus
      }
    },
    requestTable() {
      this.query = {
        roleName: ''
      }
      this.pager.current = 1
      this._getPageList()
    },
    async _getPageList(pager) {
      try {
        pager && Object.assign(this.pager, pager)
        this.loading = true
        const { data } = await getSysList(this.queryParameter)
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
    async _getAllMenuTree() {
      const { data } = await getAllMenuTree()
      this.allMenuTree = data.data
    },
    showAdd() {
      this.isEdit = false
      this.dialogVisible = true
      this.checkedNodes = []
      this.form = {
        roleName: '',
        roleDescription: '',
        menuId: '',
        roleId: '',
        code: 'test',
        sysRoleMenus: [
          {
            menuId: '',
            roleId: '',
            roleMenuId: ''
          }
        ]
      }
    },
    close() {
      // 重置数据
      this.dialogVisible = false
      this.checkedNodes = []
      this.$refs.tree.setCheckedNodes([])
      this.form = {
        roleName: '',
        roleDescription: '',
        menuId: '',
        roleId: '',
        code: 'test',
        sysRoleMenus: [
          {
            menuId: '',
            roleId: '',
            roleMenuId: ''
          }
        ]
      }
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (!valid) return
        if (this.isEdit) {
          this._updateRole()
        } else {
          this._addRole()
        }
      })
    },
    goForbidden(row) {
      this.$confirm('此操作将该改变角色状态，是否继续?', '提示', {
        cancelButtonClass: 'btn-custom-cancel',
        confirmButtonText: '确定',
        confirmButtonClass: 'btn-custom-confirm',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.forbidden(row)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    async forbidden(row) {
      if (!row.status) {
        const { data } = await disableRole(row.roleId)
        this.$message({
          type: 'success',
          message: data.message
        })
        this.requestTable()
      } else {
        const { data } = await enableRole(row.roleId)
        this.$message({
          type: 'success',
          message: data.message
        })
        this.requestTable()
      }
    },
    handleCheckChange(checkedNodes, checkedKeys) {
      const menuId = []
      const sysRoleMenus = []
      checkedKeys.checkedNodes.forEach(element => {
        if (element.childMenu.length === 0) {
          sysRoleMenus.push({
            menuId: element.menuId,
            roleId: this.roleId,
            roleMenuId: ''
          })
          menuId.push(element.menuId)
        } else {
          element.childMenu.forEach(ele => {
            if (ele.childMenu.length === 0) {
              sysRoleMenus.push({
                menuId: ele.menuId,
                roleId: this.roleId,
                roleMenuId: ''
              })
              menuId.push(ele.menuId)
            } else {
              element.childMenu.forEach(e => {
                sysRoleMenus.push({
                  menuId: e.menuId,
                  roleId: this.roleId,
                  roleMenuId: ''
                })
                menuId.push(e.menuId)
              })
            }
          })
        }
      })
      this.form.menuId = menuId.join(',')
      this.form.sysRoleMenus = sysRoleMenus
    },
    async _addRole() {
      const { data } = await addRole(this.form)
      this.close()
      this.$message({
        type: 'success',
        message: data.message
      })
      this.requestTable()
    },
    async _updateRole() {
      const { data } = await updateRole(this.form)
      this.close()
      this.$message({
        type: 'success',
        message: data.message
      })
      this.requestTable()
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
  width: 400px;
  margin-left: 12px;
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
