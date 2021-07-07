<template>
  <div class="dashboard-container">
    <div class="task-table">
      <div class="tab-title">数据查询</div>
      <div class="flex-from">
        <div>
          <el-input
            v-model="query.deviceName"
            size="medium"
            placeholder="请输入名称/代码"
            prefix-icon="el-icon-search"
            class="input-with-select w200"
            style="margin-bottom:10px"
            clearable
          />
          <!-- <el-select size="medium" v-model="query.uuid" class="w100 input-with-select" placeholder="请选择">
            <el-option v-for="item in options" :key="item.uuid" :label="item.typeName" :value="item.uuid"></el-option>
          </el-select>-->
          <el-select
            v-model="query.manageClass"
            class="input-with-select w200"
            placeholder="请选择管理类型"
            clearable
          >
            <el-option label="一类" value="一类" />
            <el-option label="二类" value="二类" />
            <el-option label="三类" value="三类" />
          </el-select>
          <div class="add-atlas" @click="_getPageList">
            <span>搜索</span>
          </div>
          <div class="text-btn" @click="requestTable">重置</div>
        </div>
        <div v-permission="'dashboard:add'" class="add-atlas" @click="showUpload">
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
        <el-table-column prop="deviceName" label="产品名称/通用名称" align="left" />
        <!-- <el-table-column prop="deviceSpecification" label="规格型号" align="left"></el-table-column> -->
        <!-- <el-table-column prop="atlasTypeName" label="规格型号" align="left" width="150"></el-table-column> -->
        <el-table-column prop="deviceManageClass" label="管理类别" align="left" />
        <el-table-column prop="deviceProfile" label="产品描述" align="left" />
        <el-table-column prop="deviceStructure" label="结构及组成/主要组成成分" align="left" />
        <!-- <el-table-column prop="deviceTypeUuid" label="器械类别" align="left" /> -->

        <!-- <el-table-column prop="createTime" width="200" label="结构及组成/主要组成成分" align="left" /> -->
        <el-table-column prop="updateTime" label="更新时间" align="center" />
        <el-table-column label="操作" align="left">
          <template slot-scope="scope">
            <div v-permission="'dashboard:send'" class="check-btn" @click="checkTask(scope.row)">报送</div>
            <div v-permission="'dashboard:send'" class="check-btn" @click="check(scope.row,'check')">查看</div>

            <div v-permission="'dashboard:update'" class="check-btn" @click="editDeviceInfo(scope.row)">编辑</div>
            <div v-permission="'dashboard:delete'" class="mark-btn" @click="goMark(scope.row)">删除</div>
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
    <el-dialog
      title="产品信息报送记录"
      :visible.sync="dialogTableVisible"
      width="60%"
      :before-close="handleClose"
    >
      <div class="check-btn" @click="checkTasks(row)">再次报送</div>
      <el-table :data="tabelTwoData" height="500">
        <el-table-column property="hospitalName" label="医疗机构" />
        <el-table-column property="sendDate" label="报送日期" width="200" />
        <el-table-column property="sendName" label="报送人员" />
        <el-table-column prop="deviceMainPrice" label="主体价格" />
        <el-table-column property="deviceAccessoryTotalPrice" label="附件价格" />
        <el-table-column property="deviceServicePrice" label="配套服务费用" />
        <el-table-column property="devicePrice" label="总价" />
        <el-table-column property="comment" label="备注信息" />
        <el-table-column label="操作" align="left">
          <template slot-scope="scope">
            <div class="check-btn" @click="checkTask(scope.row)">查阅</div>
            <!-- <div class="check-btn" @click="checkTask(scope.row)">编辑</div> -->
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      title="产品信息报送"
      :visible.sync="dialogFromVisible"
      width="40%"
      :before-close="handleClose"
    >
      <el-form ref="sendForm" class="adddevBox" label-width="120px" :model="sendForm" :rules="sendRules">
        <el-form-item label="医疗机构" prop="orgUuid">
          <el-select v-model="sendForm.orgUuid" placeholder="请选择" :disabled="disable">
            <el-option
              v-for="item in sendOptions"
              :key="item.uuid"
              :label="item.orgName"
              :value="item.uuid"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="报送日期" prop="sendDate">
          <el-date-picker
            v-model="sendForm.sendDate"
            :disabled="disable"
            value-format="yyyy-MM-dd "
            type="date"
            placeholder="请选择报送日期"
          />
        </el-form-item>
        <el-form-item label="报送人员" prop="sendName">
          <el-input v-model="sendForm.sendName" :disabled="disable" class="upload-select" placeholder="请输入报送人员名称" />
        </el-form-item>
        <el-form-item label="主体价格" prop="deviceMainPrice">
          <el-input
            v-model="sendForm.deviceMainPrice"
            oninput="value=value.replace(/[^\d]/g,'')"
            :disabled="disable"
            class="upload-select"
            placeholder="请输入主体价格"
          />
        </el-form-item>
        <el-form-item label="附件价格" prop="deviceAccessoryTotalPrice">
          <el-input
            v-model="sendForm.deviceAccessoryTotalPrice"
            oninput="value=value.replace(/[^\d]/g,'')"
            :disabled="disable"
            class="upload-select"
            placeholder="请输入附件价格"
          />
        </el-form-item>
        <el-form-item label="配套服务费用" prop="deviceServicePrice">
          <el-input
            v-model="sendForm.deviceServicePrice"
            oninput="value=value.replace(/[^\d]/g,'')"
            :disabled="disable"
            class="upload-select"
            placeholder="请输入配套服务费用"
          />
        </el-form-item>
        <el-form-item label="总价">
          {{ Number(sendForm.deviceMainPrice) + Number(sendForm.deviceAccessoryTotalPrice) + Number(sendForm.deviceServicePrice) }}
        </el-form-item>
      </el-form>
      <div v-if="!disable" class="dialog-footer">
        <div class="btn" @click="sendForms('sendForm')">报 送</div>
        <div class="btn btn-one" @click="dialogFromVisible = false">取 消</div>
      </div>
    </el-dialog>
    <el-dialog
      :title="isEdit?'编辑产品信息':'添加产品信息'"
      class="addDialog"
      :modal="false"
      :visible.sync="dialogVisible"
      width="50%"
      top="0%"
      @close="close"
    >
      <AddData
        :form="form"
        :rules="rules"
        :options="options"
        @submitForm="submitForm"
        @close="close"
      />
    </el-dialog>
    <Review :device-data="reviewDetails" :visible="visible" :check-type="checkType" @close="closeDetails" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import AddData from './AddData'
import { getDeviceTypeList, getDeviceList, findUpload, deleteByIds, getHospitalList, getDeviceInfo, updateDevice, sendRecordList, sendDevice } from '@/api/task'
import Review from '@/components/Review'
export default {
  name: 'Dashboard',
  components: {
    Pagination,
    AddData,
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
        // dateArea: '',
        userUuid: localStorage.getItem('uuid'),
        roleCode: localStorage.getItem('roleCode')
      },
      reviewDetails: {},
      visible: false,
      checkType: '',
      dialogTableVisible: false,
      dialogVisible: false,
      tabelTwoData: [],
      loading: false,
      tableData: [], // status 0-未完成 1-已完成
      pager: {
        current: this.$store.state.page.dashboard_page, // 记录页码
        size: 6,
        total: 1
      },
      isEdit: false,
      options: [],
      value1: '',
      form: {
        deviceName: '',
        deviceProfile: '', // 产品描述
        deviceStructure: '', // 结构及组成
        deviceMainPrice: '', // 主体报价
        deviceApprovalDepartment: '', // 审批部门
        deviceQualificationCertification: '', // 资质认证
        deviceRegistLicenseModifyDate: '', // 变更时间
        deviceRegistLicenseModifyInfo: '', // 变更情况
        deviceSecurityInfo: '', // 安全指标
        deviceAdverseEventInfo: '', // 不良情况
        deviceAccessoryTotalPrice: '', // 配件报价
        deviceServicePrice: '', // 配套服务报价
        deviceStoreCondition: '', // 存储条件
        deviceStdEdtion: '', // 产品标准
        deviceStoreValidTime: '', // 有效期
        deviceRegistState: '', // 注册状态
        deviceIsImport: '', // 是否进口
        deviceCountryOfOrigin: '', // 原产地
        deviceTypeUuid: '',
        deviceManageClass: '',
        typeName: '',
        // 医疗器械唯一标识信息
        deviceTypeName: '', // 器械类别
        deviceTypeCode: '', // 器械类别代码（分类编码)
        productTypeName: '', // 产品类别
        deviceRegistLicense: '', // 注册证编号或者备案凭证编号
        deviceUseNumber: '', // 最大重复使用次数
        deviceSuitProductFlag: '', // 是否为包类/组套类产品
        deviceOnceFlag: '', // 是否标记为一次性使用
        deviceMrSecurityInfo: '', // 磁共振(MR)安全相关信息
        deviceProductPublishDate: '', // 产品标识发布日期
        deviceAsepticPackagingFlag: '', // 是否为无菌包装
        deviceNeedDisinfectionPreUseFlag: '', // 使用前是否需要进行灭菌
        deviceDisinfectionType: '', // 灭菌方式
        deviceMinSaleUnitProductId: '', // 最小销售单元产品标识
        deviceMedicalCode: '', // 唯一标识编码体系名称
        deviceHasSelfDirectIdFlag: '', // 是否有本地直接标识
        deviceMinSaleUnitProductNumber: '', // 最小销售单元中使用单元的数量
        deviceUseUnitProductIdFlag: '', // 使用单元产品标识
        // 设备参数性能信息
        parameterList: [],
        deviceParameterUrl: '',
        fileList: [],
        jsonFileList: [],
        excelfileList: [],
        proFileUrl: '',

        userUuid: localStorage.getItem('uuid')
      },
      rules: {
        deviceName: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ],
        deviceTypeUuid: [
          { required: true, message: '请选择管理类型', trigger: 'blur' }
        ],
        deviceManageClass: [
          { required: true, message: '请选择管理类型', trigger: 'blur' }
        ],
        deviceProfile: [
          { required: true, message: '请输入产品描述', trigger: 'blur' }
        ],
        deviceStructure: [
          { required: true, message: '请输入结构及组成', trigger: 'blur' }
        ],
        deviceMainPrice: [
          { required: true, message: '请输入主体报价', trigger: 'blur' }
        ],
        deviceApprovalDepartment: [
          { required: true, message: '请输入审批部门', trigger: 'blur' }
        ],
        deviceQualificationCertification: [
          { required: true, message: '请输入资质认证', trigger: 'blur' }
        ],
        deviceSecurityInfo: [
          { required: true, message: '请输入安全指标', trigger: 'blur' }
        ],
        deviceAdverseEventInfo: [
          { required: true, message: '请输入不良事件情况', trigger: 'blur' }
        ],
        deviceRegistState: [
          { required: true, message: '请选择注册状态', trigger: 'blur' }
        ],

        deviceTypeName: [
          { required: true, message: '请选择器械类别', trigger: 'blur' }
        ],
        deviceTypeCode: [
          { required: true, message: '请选择分类代码', trigger: 'blur' }
        ],
        productTypeName: [
          { required: true, message: '请选择产品类别', trigger: 'blur' }
        ],
        deviceRegistLicense: [
          { required: true, message: '请选择注册证编号或者备案凭证编号', trigger: 'blur' }
        ],
        deviceRegistLicenseApprovalDate: [
          { required: true, message: '请选择批准日期', trigger: 'blur' }
        ],
        fileDesicription: [
          { required: true, message: '请选择附件简要说明', trigger: 'blur' }
        ],
        fileVersion: [
          { required: true, message: '请选择版本号', trigger: 'blur' }
        ],
        fileSource: [
          { required: true, message: '请选择文件来源', trigger: 'blur' }
        ],
        fileType: [
          { required: true, message: '请选择文件类型', trigger: 'blur' }
        ],
        fileName: [
          { required: true, message: '请选择附件名称', trigger: 'blur' }
        ],

        file: [
          { message: '请上传Excel', trigger: 'change' }
        ]

      },
      sendOptions: [],
      sendForm: {
        orgUuid: '',
        sendDate: '',
        sendName: '',
        deviceMainPrice: '',
        deviceAccessoryTotalPrice: '',
        deviceServicePrice: '',
        deviceUuid: '',
        userUuid: ''
      },
      sendRules: {
        orgUuid: [
          { required: true, message: '请选择医疗机构', trigger: 'blur' }
        ],
        sendDate: [
          { required: true, message: '请选择报送日期', trigger: 'blur' }
        ],
        sendName: [
          { required: true, message: '请输入报送人员名称', trigger: 'blur' }
        ],
        deviceMainPrice: [
          { required: true, message: '请输入主体价格', trigger: 'blur' }
        ],
        deviceAccessoryTotalPrice: [
          { required: true, message: '请输入附件价格', trigger: 'blur' }
        ],
        deviceServicePrice: [
          { required: true, message: '请输入配套服务费用', trigger: 'blur' }
        ]
      },
      dialogFromVisible: false,
      disable: false,
      row: {},
      isAgin: false
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
    this._getPageList()
    this._getDeviceTypeList()
    this._getHospitalList()
  },
  methods: {
    handleClose(done) {
      done()
    },
    check(data, type) {
      this.reviewDetails = data
      this.visible = true
      this.checkType = type
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
    // 版本
    checkTasks(row) {
      this.isAgin = true
      this._sendRecordList(row)
      this.disable = false
    },
    checkTask(row) {
      this.row = row
      if (this.dialogTableVisible) {
        this.dialogFromVisible = true
        this.sendForm = {
          orgUuid: row.hospitalName,
          sendDate: row.sendDate,
          sendName: row.sendName,
          deviceMainPrice: row.deviceMainPrice,
          deviceAccessoryTotalPrice: row.deviceAccessoryTotalPrice,
          deviceServicePrice: row.deviceServicePrice,
          deviceUuid: row.uuid,
          userUuid: Number(row.userUuid)
        }
        this.disable = true
      } else {
        this._sendRecordList(row)
        this.disable = false
      }
    },
    async _sendRecordList(row) {
      const { data } = await sendRecordList({ userUuid: row.userUuid, deviceUuid: row.uuid })
      if (data.data.length === 0 || this.isAgin) {
        this.dialogFromVisible = true
        this.sendForm = {
          orgUuid: '',
          sendDate: '',
          sendName: localStorage.getItem('userName'),
          deviceMainPrice: '',
          deviceAccessoryTotalPrice: '',
          deviceServicePrice: '',
          deviceUuid: row.uuid,
          userUuid: Number(row.userUuid)
        }
      } else {
        this.dialogTableVisible = true
        data.data.forEach(e => {
          e.sendDate = e.sendDate.split('T')[0]
          e.devicePrice = Number(e.deviceMainPrice) + Number(e.deviceAccessoryTotalPrice) + Number(e.deviceServicePrice) + '.00'
        })
        this.tabelTwoData = data.data
      }
    },
    async _getHospitalList() {
      const { data } = await getHospitalList()
      console.log(data)
      this.sendOptions = data.data
    },
    sendForms(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this._sendDevice()
        } else {
          return false
        }
      })
    },
    async _sendDevice() {
      const formData = new FormData()
      formData.append('orgUuid', this.sendForm.orgUuid)
      formData.append('sendDate', this.sendForm.sendDate)
      formData.append('sendName', this.sendForm.sendName)
      formData.append('deviceMainPrice', this.sendForm.deviceMainPrice)
      formData.append('deviceAccessoryTotalPrice', this.sendForm.deviceAccessoryTotalPrice)
      formData.append('deviceServicePrice', this.sendForm.deviceServicePrice)
      formData.append('deviceUuid', this.sendForm.deviceUuid)
      formData.append('userUuid', this.sendForm.userUuid)
      console.log(formData)
      const { data } = await sendDevice(formData)
      console.log(data)
      this.$message({
        type: 'success',
        message: data.message
      })
      this.dialogFromVisible = false
      this._sendRecordList(this.row)
      this.isAgin = false
    },
    // 编辑按钮
    editDeviceInfo(row) {
      this.isEdit = true
      this.dialogVisible = true
      this._editDeviceInfo(row.uuid)
    },
    async _editDeviceInfo(uuid) {
      // const { data } = await getDeviceInfo({ deviceUuid: uuid })
      const { data } = await getDeviceInfo({ deviceUuid: Number(uuid), userUuid: Number(localStorage.getItem('uuid')) })
      console.log('编辑详情data: ', data)
      this.form = { ...this.form, ...data.data }
    },

    requestTable() {
      this.query = {
        fileName: '',
        manageClass: '',
        dateArea: '',
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
      this.isEdit = false
      this.dialogVisible = true
      this.form = {
        deviceName: '',
        deviceProfile: '', // 产品描述
        deviceStructure: '', // 结构及组成
        quotedPrice: '', // 主体报价
        deviceApprovalDepartment: '', // 审批部门
        deviceQualificationCertification: '', // 资质认证
        deviceRegistLicenseModifyDate: '', // 变更时间
        deviceRegistLicenseModifyInfo: '', // 变更情况
        deviceSecurityInfo: '', // 安全指标
        deviceAdverseEventInfo: '', // 不良情况
        deviceAccessoryTotalPrice: '', // 配件报价
        deviceServicePrice: '', // 配套服务报价
        deviceStoreCondition: '', // 存储条件
        deviceStdEdtion: '', // 产品标准
        deviceStoreValidTime: '', // 有效期
        deviceRegistState: '', // 注册状态
        deviceIsImport: '', // 是否进口
        deviceCountryOfOrigin: '', // 原产地
        deviceTypeUuid: '',
        deviceManageClass: '',
        typeName: '',
        // 医疗器械唯一标识信息
        deviceTypeName: '', // 器械类别
        deviceTypeCode: '', // 器械类别代码（分类编码)
        productTypeName: '', // 产品类别
        deviceRegistLicense: '', // 注册证编号或者备案凭证编号
        deviceUseNumber: '', // 最大重复使用次数
        deviceSuitProductFlag: '', // 是否为包类/组套类产品
        deviceOnceFlag: '', // 是否标记为一次性使用
        deviceMrSecurityInfo: '', // 磁共振(MR)安全相关信息
        deviceProductPublishDate: '', // 产品标识发布日期
        deviceAsepticPackagingFlag: '', // 是否为无菌包装
        deviceNeedDisinfectionPreUseFlag: '', // 使用前是否需要进行灭菌
        deviceDisinfectionType: '', // 灭菌方式
        deviceMinSaleUnitProductId: '', // 最小销售单元产品标识
        deviceMedicalCode: '', // 唯一标识编码体系名称
        deviceHasSelfDirectIdFlag: '', // 是否有本地直接标识
        deviceMinSaleUnitProductNumber: '', // 最小销售单元中使用单元的数量
        deviceUseUnitProductIdFlag: '', // 使用单元产品标识
        // 设备参数性能信息
        parameterList: [],
        deviceParameterUrl: '',
        jsonFileList: [],
        excelfileList: [],
        fileList: [],
        proFileUrl: '',

        userUuid: localStorage.getItem('uuid')
      }
    },
    closeDetails() {
      this.visible = false
    },
    close() {
      // 重置数据
      this.dialogVisible = false
      this.form = {
        deviceName: '',
        deviceProfile: '', // 产品描述
        deviceStructure: '', // 结构及组成
        quotedPrice: '', // 主体报价
        deviceApprovalDepartment: '', // 审批部门
        deviceQualificationCertification: '', // 资质认证
        deviceRegistLicenseModifyDate: '', // 变更时间
        deviceRegistLicenseModifyInfo: '', // 变更情况
        deviceSecurityInfo: '', // 安全指标
        deviceAdverseEventInfo: '', // 不良情况
        deviceAccessoryTotalPrice: '', // 配件报价
        deviceServicePrice: '', // 配套服务报价
        deviceStoreCondition: '', // 存储条件
        deviceStdEdtion: '', // 产品标准
        deviceStoreValidTime: '', // 有效期
        deviceRegistState: '', // 注册状态
        deviceIsImport: '', // 是否进口
        deviceCountryOfOrigin: '', // 原产地
        deviceTypeUuid: '',
        deviceManageClass: '',
        typeName: '',
        // 医疗器械唯一标识信息
        deviceTypeName: '', // 器械类别
        deviceTypeCode: '', // 器械类别代码（分类编码)
        productTypeName: '', // 产品类别
        deviceRegistLicense: '', // 注册证编号或者备案凭证编号
        deviceUseNumber: '', // 最大重复使用次数
        deviceSuitProductFlag: '', // 是否为包类/组套类产品
        deviceOnceFlag: '', // 是否标记为一次性使用
        deviceMrSecurityInfo: '', // 磁共振(MR)安全相关信息
        deviceProductPublishDate: '', // 产品标识发布日期
        deviceAsepticPackagingFlag: '', // 是否为无菌包装
        deviceNeedDisinfectionPreUseFlag: '', // 使用前是否需要进行灭菌
        deviceDisinfectionType: '', // 灭菌方式
        deviceMinSaleUnitProductId: '', // 最小销售单元产品标识
        deviceMedicalCode: '', // 唯一标识编码体系名称
        deviceHasSelfDirectIdFlag: '', // 是否有本地直接标识
        deviceMinSaleUnitProductNumber: '', // 最小销售单元中使用单元的数量
        deviceUseUnitProductIdFlag: '', // 使用单元产品标识
        // 设备参数性能信息
        parameterList: [],
        deviceParameterUrl: '',
        fileList: [],
        jsonFileList: [],
        excelfileList: [],
        proFileUrl: '',
        userUuid: localStorage.getItem('uuid')
      }
    },
    // 添加的上传
    submitForm(props) {
      console.log('props: ', props)
      // this.$refs.form.validate(valid => {
      //   if (!valid) return
      //   this._findUpload(props)
      // })
      this._findUpload(props)
    },
    async _findUpload(props) {
      console.log('props: ', props)
      const params = {
        deviceData: { ...props, deviceTypeUuid: props.deviceTypeUuid[2], deviceProductPublishDate: null },
        deviceFileList: props.fileList,
        deviceParameterUrl: props.deviceParameterUrl,
        parameterList: props.parameterList,
        deviceProductPublishDate: props.deviceProductPublishDate,
        userUuid: Number(localStorage.getItem('uuid'))
      }
      console.log('params: ', params)
      if (this.isEdit) {
        // 编辑
        const { data } = await updateDevice(params)
        console.log('data: ', data)
        this.$message({
          type: 'success',
          message: data.message
        })
        this.dialogVisible = false
      } else {
        // 新增
        const { data } = await findUpload(params)
        console.log(data)
        this.$message({
          type: 'success',
          message: data.message
        })
        this.dialogVisible = false
      }
      this.requestTable()
      this.form = {
        deviceName: '',
        deviceProfile: '', // 产品描述
        deviceStructure: '', // 结构及组成
        quotedPrice: '', // 主体报价
        deviceApprovalDepartment: '', // 审批部门
        deviceQualificationCertification: '', // 资质认证
        deviceRegistLicenseModifyDate: '', // 变更时间
        deviceRegistLicenseModifyInfo: '', // 变更情况
        deviceSecurityInfo: '', // 安全指标
        deviceAdverseEventInfo: '', // 不良情况
        deviceAccessoryTotalPrice: '', // 配件报价
        deviceServicePrice: '', // 配套服务报价
        deviceStoreCondition: '', // 存储条件
        deviceStdEdtion: '', // 产品标准
        deviceStoreValidTime: '', // 有效期
        deviceRegistState: '', // 注册状态
        deviceIsImport: '', // 是否进口
        deviceCountryOfOrigin: '', // 原产地
        deviceTypeUuid: '',
        deviceManageClass: '',
        typeName: '',
        // 医疗器械唯一标识信息
        deviceTypeName: '', // 器械类别
        deviceTypeCode: '', // 器械类别代码（分类编码)
        productTypeName: '', // 产品类别
        deviceRegistLicense: '', // 注册证编号或者备案凭证编号
        deviceUseNumber: '', // 最大重复使用次数
        deviceSuitProductFlag: '', // 是否为包类/组套类产品
        deviceOnceFlag: '', // 是否标记为一次性使用
        deviceMrSecurityInfo: '', // 磁共振(MR)安全相关信息
        deviceProductPublishDate: '', // 产品标识发布日期
        deviceAsepticPackagingFlag: '', // 是否为无菌包装
        deviceNeedDisinfectionPreUseFlag: '', // 使用前是否需要进行灭菌
        deviceDisinfectionType: '', // 灭菌方式
        deviceMinSaleUnitProductId: '', // 最小销售单元产品标识
        deviceMedicalCode: '', // 唯一标识编码体系名称
        deviceHasSelfDirectIdFlag: '', // 是否有本地直接标识
        deviceMinSaleUnitProductNumber: '', // 最小销售单元中使用单元的数量
        deviceUseUnitProductIdFlag: '', // 使用单元产品标识
        // 设备参数性能信息
        parameterList: [],
        deviceParameterUrl: '',
        fileList: [],
        jsonFileList: [],
        proFileUrl: '',
        userUuid: localStorage.getItem('uuid')
      }
    }

  }
}
</script>

<style lang="scss">
.el-table::before {
  height: 0;
}

.addDialog {
  .el-dialog {
    .el-dialog__body {
      max-height: calc(100vh - 80px);
      overflow: scroll;
    }
  }
}
</style>

<style lang="scss" scoped>
.el-input__prefix,
.el-input__suffix {
  color: #FF5338;
}
.top-bar {
  margin-top: 20px;
  padding-left: 20px;
  width: 100%;
  height: 88px;
  line-height: 88px;
  font-size: 16px;
  color: #636a7d;
  background: #ffffff;
  box-shadow: 2px 2px 12px 4px rgba(130, 80, 66, 0.08);
  border-radius: 8px;
}
.text-tab {
  padding: 0 30px;
  display: inline-block;
}
.selected {
  color: #FF5338;
}
.tab-title {
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: #393f4e;
  line-height: 22px;
  font-weight: 500;
  margin-bottom: 20px;
}
.dialog-title {
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #333333;
  line-height: 24px;
  font-weight: 400;
  margin-bottom: 12px;
}
.dialog-title-two {
  margin-top: 32px;
}
.dialog-footer {
  display: flex;
  margin-top: 12px;
  justify-content: center;
  .btn {
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
  .btn-one {
    margin-left: 20px;
    background: #fff;
    color: #FF5338;
    border: 1px solid #FF5338;
  }
}

.paging {
  padding-bottom: 20px;
}

.btn-one {
  margin-left: 12px;
  background: #fff;
  color: #FF5338;
  box-shadow: none;
  border: 1px solid #FF5338;
}
.input-with-select {
  margin-right: 20px;
}
.add-atlas {
  margin: 8px 0px 0px 20px;
  display: inline-block;
  cursor: pointer;
  width: 74px;
  height: 40px;
  background: #FF5338;
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
.w100 {
  width: 100px;
}
.w150 {
  width: 150px;
}
.text-btn {
  display: inline-block;
  margin-left: 20px;
  color: #FF5338;
  text-decoration-line: underline;
}

.file-upload-btn {
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
.upload-content {
  width: 100px;
}

.upload-select {
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
          background: #FF5338;
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
          background: #FF5338;
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
      box-shadow: 2px 2px 12px 2px rgba(54, 102, 228, 0.24);
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
  box-shadow: 2px 2px 8px 0 rgba(247, 181, 0, 0.55);
  background-image: linear-gradient(270deg, #fcdb00 0%, #f7b500 100%);
}
.manage {
  box-shadow: 2px 2px 8px 0 rgba(0, 113, 247, 0.55);
  background-image: linear-gradient(270deg, #669ff3 0%, #32c5ff 100%);
}
.mark {
  box-shadow: 2px 2px 8px 0 rgba(0, 225, 247, 0.55);
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
    background: #FF5338;
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
    background: #FF5338;
    border: 1px solid #e6e6e6;
    border-radius: 6px;
    color: #ffffff;
  }
}
</style>
