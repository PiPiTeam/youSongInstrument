<template>
  <div>
    <div class="titleArea">数据查询</div>
    <el-form ref="form" class="addDialogBox" label-width="240px" :model="form" :rules="rules">
      <el-form-item label="产品名称/通用名称" prop="deviceName">
        <el-input v-model="form.deviceName" class="upload-select" placeholder="请输入产品名称/通用名称" />
      </el-form-item>
      <el-form-item label="产品类型" prop="deviceTypeUuid">
        <el-cascader
          v-model="form.deviceTypeUuid"
          class="upload-select"
          :options="options"
          filterable
          :props="{value:'uuid',label:'typeName'}"
          :show-all-levels="false"
          @change="changeDevice"
        />
      </el-form-item>
      <el-form-item label="管理类型" prop="deviceManageClass">
        <el-select
          v-model="form.deviceManageClass"
          class="upload-select"
          placeholder="请选择管理类型"
          clearable
        >
          <el-option label="一类" value="一类" />
          <el-option label="二类" value="二类" />
          <el-option label="三类" value="三类" />
        </el-select>
      </el-form-item>
      <el-form-item label="产品描述" prop="deviceProfile">
        <el-input
          v-model="form.deviceProfile"
          type="textarea"
          placeholder="请输入内容"
          maxlength="30"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="结构及组成/主要组成成分" prop="deviceStructure">
        <el-input v-model="form.deviceStructure" placeholder="请输入结构及组成/主要组成成分" />
      </el-form-item>
      <el-form-item label="主体报价" prop="deviceMainPrice">
        <el-input v-model="form.deviceMainPrice" class="upload-select" placeholder="请输入主体报价" />
      </el-form-item>
      <el-form-item label="审批部门" prop="deviceApprovalDepartment">
        <el-input
          v-model="form.deviceApprovalDepartment"
          class="upload-select"
          placeholder="请输入审批部门"
        />
      </el-form-item>
      <el-form-item label="资质认证" prop="deviceQualificationCertification">
        <el-input
          v-model="form.deviceQualificationCertification"
          class="upload-select"
          placeholder="请输入资质认证"
        />
      </el-form-item>
      <el-form-item label="注册状态" prop="deviceRegistState">
        <el-radio-group v-model="form.deviceRegistState">
          <el-radio :label="'1'">已注册</el-radio>
          <el-radio :label="'0'">未注册</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="安全指标" prop="deviceSecurityInfo">
        <el-input v-model="form.deviceSecurityInfo" placeholder="请输入安全指标" />
      </el-form-item>
      <el-form-item label="不良情况" prop="deviceAdverseEventInfo">
        <el-input v-model="form.deviceAdverseEventInfo" placeholder="请输入不良情况" />
      </el-form-item>
      <el-form-item label="批准日期" prop="deviceRegistLicenseApprovalDate">
        <el-date-picker
          v-model="form.deviceRegistLicenseApprovalDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择批准日期"
        />
      </el-form-item>
      <el-form-item label="有效日期" prop="deviceRegistLicenseValidDate">
        <el-date-picker
          v-model="form.deviceRegistLicenseValidDate"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="选择有效日期"
        />
      </el-form-item>
      <el-form-item label="配件报价" prop="deviceAccessoryTotalPrice">
        <el-input v-model="form.deviceAccessoryTotalPrice" placeholder="请输入配件报价" />
      </el-form-item>
      <el-form-item label="配套服务费用" prop="deviceServicePrice">
        <el-input v-model="form.deviceServicePrice" placeholder="请输入配套服务费用" />
      </el-form-item>
      <el-form-item label="存储条件" prop="deviceStoreCondition">
        <el-input v-model="form.deviceStoreCondition" class="upload-select" placeholder="请输入存储条件" />
      </el-form-item>
      <el-form-item label="产品标准" prop="deviceStdEdtion">
        <el-input v-model="form.deviceStdEdtion" class="upload-select" placeholder="请输入产品标准" />
      </el-form-item>
      <el-form-item label="备案变更时间" prop="deviceRegistLicenseModifyDate">
        <el-date-picker
          v-model="form.deviceRegistLicenseModifyDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择变更时间"
        />
      </el-form-item>
      <el-form-item label="变更情况" prop="deviceRegistLicenseModifyInfo">
        <el-input v-model="form.deviceRegistLicenseModifyInfo" placeholder="请输入变更情况" />
      </el-form-item>
      <el-form-item label="有效期" prop="deviceStoreValidTime">
        <el-input v-model="form.deviceStoreValidTime" type="number" placeholder="请输入有效期月数" />
      </el-form-item>
      <el-form-item label="原产地" prop="deviceCountryOfOrigin">
        <el-input v-model="form.deviceCountryOfOrigin" class="upload-select" placeholder="请输入原产地" />
      </el-form-item>
      <el-form-item label="是否进口" prop="deviceIsImport">
        <el-radio-group v-model="form.deviceIsImport">
          <el-radio :label="'1'">是</el-radio>
          <el-radio :label="'0'">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <div class="titleArea">医疗器械唯一标识信息</div>
      <el-form-item label="请上传Json文件" prop="file" class="uploadFileStyle">
        <el-upload
          ref="upload"
          class="upload-demo"
          drag
          :action="href"
          accept="*"
          :auto-upload="false"
          :show-file-list="false"
          :file-list="form.jsonFileList"
          :on-change="beforeUpload"
        >
          <!-- :limit="1" -->
          <el-row type="flex" justify="left">
            <div class="btn btn-one">导入文件</div>
          </el-row>
        </el-upload>

        <el-button class="btn btn-one">
          <a href="https://udi.nmpa.gov.cn/" target="_blank">下载json模板</a>
        </el-button>
      </el-form-item>

      <el-form-item label="器械类别" prop="deviceTypeName">
        <el-input v-model="form.deviceTypeName" placeholder="请输入器械类别及代码" />
      </el-form-item>
      <el-form-item label="分类编码" prop="deviceTypeCode">
        <el-input v-model="form.deviceTypeCode" placeholder="请输入分类编码" />
      </el-form-item>
      <el-form-item label="产品类别" prop="productTypeName">
        <el-input v-model="form.productTypeName" placeholder="请输入产品类别" />
      </el-form-item>
      <el-form-item label="注册证编号或者备案凭证编号" prop="deviceRegistLicense">
        <el-input v-model="form.deviceRegistLicense" placeholder="请输入注册证编号或者备案凭证编号" />
      </el-form-item>
      <el-form-item label="最大重复使用次数" prop="deviceUseNumber">
        <el-input v-model="form.deviceUseNumber" placeholder="请输入最大重复使用次数" />
      </el-form-item>
      <el-form-item label="是否为包类/组套类产品" prop="deviceSuitProductFlag">
        <el-radio-group v-model="form.deviceSuitProductFlag">
          <el-radio :label="'1'">是</el-radio>
          <el-radio :label="'0'">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否标记为一次性使用" prop="deviceOnceFlag">
        <el-radio-group v-model="form.deviceOnceFlag">
          <el-radio :label="'1'">是</el-radio>
          <el-radio :label="'0'">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="磁共振(MR)安全相关信息" prop="deviceMrSecurityInfo">
        <el-input v-model="form.deviceMrSecurityInfo" placeholder="请输入磁共振(MR)安全相关信息" />
      </el-form-item>
      <el-form-item label="产品标识发布日期" prop="deviceProductPublishDate">
        <el-date-picker
          v-model="form.deviceProductPublishDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择产品标识发布时间"
        />
      </el-form-item>
      <el-form-item label="是否为无菌包装" prop="deviceAsepticPackagingFlag">
        <el-radio-group v-model="form.deviceAsepticPackagingFlag">
          <el-radio :label="'1'">是</el-radio>
          <el-radio :label="'0'">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="使用前是否需要进行灭菌" prop="deviceNeedDisinfectionPreUseFlag">
        <el-radio-group v-model="form.deviceNeedDisinfectionPreUseFlag">
          <el-radio :label="'1'">是</el-radio>
          <el-radio :label="'0'">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="灭菌方式" prop="deviceDisinfectionType">
        <el-input
          v-model="form.deviceDisinfectionType"
          placeholder="请输入灭菌方式"
          class="upload-select"
        />
      </el-form-item>
      <el-form-item label="最小销售单元产品标识" prop="deviceMinSaleUnitProductId">
        <el-input v-model="form.deviceMinSaleUnitProductId" placeholder="请输入最小销售单元产品标识" />
      </el-form-item>
      <el-form-item label="唯一标识编码体系名称" prop="deviceMedicalCode">
        <el-input v-model="form.deviceMedicalCode" placeholder="请输入唯一标识编码体系名称" />
      </el-form-item>
      <el-form-item label="是否有本地直接标识" prop="deviceHasSelfDirectIdFlag">
        <el-radio-group v-model="form.deviceHasSelfDirectIdFlag">
          <el-radio :label="'1'">是</el-radio>
          <el-radio :label="'0'">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="最小销售单元中使用单元的数量" prop="deviceMinSaleUnitProductNumber">
        <el-input v-model="form.deviceMinSaleUnitProductNumber" placeholder="请输入最小销售单元中使用单元的数量" />
      </el-form-item>
      <el-form-item label="使用单元产品标识" prop="deviceUseUnitProductIdFlag">
        <el-input v-model="form.deviceUseUnitProductIdFlag" placeholder="请输入使用单元产品标识" />
      </el-form-item>
      <div class="titleArea">设备参数性能信息</div>
      <div class="upload-dev-file">
        <a
          class="btn btn-one btnMargin"
          :href="href+'/kgDevice/downloadDeviceParameterFile'"
          download="模板"
        >下载模板</a>

        <el-upload
          ref="upload-dev"
          class="upload-demo"
          drag
          :action="href"
          accept=".xls, .xlsx"
          :show-file-list="false"
          :file-list="form.excelfileList"
          :auto-upload="false"
          :limit="1"
          :on-change="beforeUploadDev"
        >
          <el-row type="flex" justify="left">
            <div class="btn btn-one btnMargin">导入excel</div>
          </el-row>
        </el-upload>
        <el-button
          class="btn btn-one btnMargin"
          :disabled="form.parameterList.length===0"
          @click="_dialogAddDevice"
        >添加</el-button>
      </div>
      <el-table
        ref="设备参数性能信息"
        v-loading="loading"
        :data="form.parameterList"
        tooltip-effect="dark"
        style="width: 100%;"
        highlight-current-row
      >
        <el-table-column prop="deviceParameterName" label="参数名称" align="left" />
        <!-- <el-table-column prop="atlasTypeName" label="规格型号" align="left" width="150"></el-table-column> -->
        <!--   <el-table-column prop="参数类型" label="参数类型" align="left"></el-table-column> -->
        <!-- <el-table-column prop="createTime" width="200" label="结构及组成/主要组成成分" align="left" /> -->
        <!--  <el-table-column prop="最大误差" label="最大误差" align="left" />
        <el-table-column prop="数据依据" label="数据依据" align="left" />-->
        <el-table-column prop="deviceParameterMain" label="招标参数和性能要求" align="left" />
        <el-table-column prop="comment" label="备注" align="left" />
        <el-table-column label="操作" align="left">
          <template slot-scope="scope">
            <div class="mark-btn" @click="deleteDevInfo(scope.row)">删除</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="titleArea">产品附件信息</div>
      <el-button class="btn btn-one btnMargin" @click="_dialogAddPro">添加</el-button>

      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="form.fileList"
        tooltip-effect="dark"
        style="width: 100%;"
        highlight-current-row
      >
        <el-table-column prop="fileName" label="附件名称" align="left" />
        <el-table-column prop="fileSource" label="文件来源" align="left" />
        <!-- <el-table-column prop="createTime" width="200" label="结构及组成/主要组成成分" align="left" /> -->
        <el-table-column prop="fileVersion" label="版本号" align="left" />
        <el-table-column prop="fileDesicription" label="附件简要说明" align="left" />
        <el-table-column prop="fileType" :formatter="formatter" label="文件类型" align="left" />
        <el-table-column label="操作" align="left">
          <template slot-scope="scope">
            <div class="mark-btn" @click="deleteProInfo(scope.row)">删除</div>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <el-row slot="footer" type="flex" justify="center" class="dialog-footer">
      <div class="btn" @click="submitForm">
        <span>确认</span>
      </div>
      <div class="btn btn-one" @click="close">
        <span>取消</span>
      </div>
    </el-row>
    <el-dialog
      title="添加设备参数信息"
      append-to-body
      class="dialogAddDev"
      :visible.sync="dialogAddDevice"
      width="60%"
      :before-close="handleClose"
    >
      <el-form ref="devform" class="adddevBox" label-width="240px" :model="devform" :rules="rules">
        <el-form-item label="参数名称" prop="deviceParameterName">
          <el-input
            v-model="devform.deviceParameterName"
            class="upload-select"
            placeholder="请输入参数名称"
          />
        </el-form-item>
        <el-form-item label="招标参数和性能要求" prop="deviceParameterMain">
          <el-input
            v-model="devform.deviceParameterMain"
            class="upload-select"
            placeholder="请输入招标参数和性能要求"
          />
        </el-form-item>
        <el-form-item label="备注" prop="comment">
          <el-input v-model="devform.comment" class="upload-select" placeholder="请输入参数名称" />
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <div class="btn" @click="submitAddDeviceInfo">确 定</div>
        <div class="btn btn-one" @click="closeAddDevice">取 消</div>
      </div>
    </el-dialog>
    <el-dialog
      title="添加产品附件信息"
      append-to-body
      class="dialogAddDev"
      :visible.sync="dialogAddPro"
      width="60%"
      :before-close="handleClose"
    >
      <el-form ref="proform" class="adddevBox" label-width="240px" :model="proform" :rules="rules">
        <el-form-item label="添加附件" prop="file" class="uploadProFileStyle">
          <el-upload
            ref="uploadPro"
            class="upload-demo"
            drag
            :action="href"
            accept="*"
            :auto-upload="false"
            :file-list="proform.profileList"
            :limit="1"
            :on-change="beforeUploadPro"
          >
            <el-row type="flex" justify="left">
              <div class="btn btn-one">导入附件</div>
            </el-row>
          </el-upload>
        </el-form-item>
        <el-form-item label="附件名称" prop="fileName">
          <el-input v-model="proform.fileName" class="upload-select" placeholder="请输入参数名称" />
        </el-form-item>
        <el-form-item label="文件类型" prop="fileType">
          <el-select
            v-model="proform.fileType"
            class="upload-select"
            placeholder="请选择文件类型"
            clearable
          >
            <el-option label="参数性能证明文件" value="1" />
            <el-option label="宣传文件" value="2" />
            <el-option label="其他" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="文件来源" prop="fileSource">
          <el-input v-model="proform.fileSource" class="upload-select" placeholder="请输入招标参数和性能要求" />
        </el-form-item>
        <el-form-item label="版本号" prop="fileVersion">
          <el-input v-model="proform.fileVersion" class="upload-select" placeholder="请输入参数名称" />
        </el-form-item>
        <el-form-item label="附件简要说明" prop="fileDesicription">
          <el-input v-model="proform.fileDesicription" class="upload-select" placeholder="请输入参数名称" />
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <div class="btn" @click="submitAddProInfo">确 定</div>
        <div class="btn btn-one" @click="closeAddPro">取 消</div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { deleteDevInfoItem, getDeviceInfoList, getJsonData, getParameterData, downloadDeviceParameterFile, uploadEnclosure } from '@/api/task'

export default {
  name: 'AddData',
  props: {
    form: {
      type: Object,
      default: {}
    },
    options: {
      type: Array,
      default: []
    },
    rules: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      userUuid: localStorage.getItem('uuid'),
      href: process.env.VUE_APP_BASE_API,
      devform: {},
      proform: {
        profileList: [],
        filePath: ''

      },
      jsonfile: '',
      excelFile: '',
      profile: '',
      dialogAddDevice: false,
      dialogAddPro: false

    }
  },
  computed: {

  },
  watch: {
    form(newData, oldData) {
      this.form = newData
    }
  },
  created() {
    console.log('created', this.href)
  },
  mounted() {
    console.log('mounted', this.form)
  },
  methods: {

    formatter(row, column) {
      const text = { 1: '参数性能证明文件', 2: '宣传文件', 3: '其他' }
      return text[row.fileType]
    },
    changeDevice(e) {
      console.log(e, 'r')
    },

    beforeUpload(file, fileList) {
      console.log('上传json文件')
      this.jsonfile = file.raw
      this._getJsonData()
    },

    async _getJsonData() {
      const formData = new FormData()
      formData.append('file', this.jsonfile)
      formData.append('userUuid', localStorage.getItem('uuid'))
      await getJsonData(formData).then((res) => {
        console.log('res: ', res)
        const data = res.data
        this.$message({
          type: 'success',
          message: data.message
        })
        const newForm = JSON.parse(JSON.stringify(data.data))
        const newFormValue = {
          deviceTypeName: newForm.qxlb, // 器械类别
          deviceTypeCode: newForm.flbm, // 器械类别代码（分类编码)
          productTypeName: newForm.cplb, // 产品类别
          deviceRegistLicense: newForm.zczbhhzbapzbh, // 注册证编号或者备案凭证编号
          deviceUseNumber: newForm.zdcfsycs, // 最大重复使用次数
          deviceSuitProductFlag: newForm.sfwblztlcp, // 是否为包类/组套类产品
          deviceOnceFlag: newForm.sfbjwycxsy, // 是否标记为一次性使用
          deviceMrSecurityInfo: newForm.cgzmraqxgxx, // 磁共振(MR)安全相关信息
          deviceProductPublishDate: newForm.cpbsfbrq, // 产品标识发布日期
          deviceAsepticPackagingFlag: newForm.sfwwjbz, // 是否为无菌包装
          deviceNeedDisinfectionPreUseFlag: newForm.syqsfxyjxmj, // 使用前是否需要进行灭菌
          deviceDisinfectionType: newForm.mjfs, // 灭菌方式
          deviceMinSaleUnitProductId: newForm.zxxsdycpbs, // 最小销售单元产品标识
          deviceMedicalCode: newForm.cpbsbmtxmc, // 唯一标识编码体系名称
          deviceHasSelfDirectIdFlag: newForm.sfybtzjbs, // 是否有本地直接标识
          deviceMinSaleUnitProductNumber: newForm.zxxsdyzsydydsl, // 最小销售单元中使用单元的数量
          deviceUseUnitProductIdFlag: newForm.sydycpbs// 使用单元产品标识
        }
        this.form = { ...this.form, ...newFormValue }
        console.log('this.form333', this.form)
      })
      console.log('this.form', this.form)
    },

    _dialogAddDevice() {
      this.dialogAddDevice = true
    },
    beforeUploadDev(file) {
      console.log('上传excel文件')
      this.excelFile = file.raw
      this._getExcelTableList()
    },
    async _getExcelTableList() {
      const formData = new FormData()
      formData.append('file', this.excelFile)
      formData.append('userUuid', localStorage.getItem('uuid'))
      await getParameterData(formData).then((res) => {
        console.log('res: ', res)
        const data = res.data || {}
        const { deviceParameterUrl, parameterList } = data.data
        console.log('parameterList: ', parameterList)
        this.$message({
          type: 'success',
          message: data.message
        })
        this.form = { ...this.form, deviceParameterUrl: deviceParameterUrl, parameterList: [...parameterList].concat(this.form.parameterList) }
        console.log('this.form', this.form)
      })
    },
    deleteDevInfo(row) {
      this.$confirm('此操作将该条删除，是否继续?', '提示', {
        cancelButtonClass: 'btn-custom-cancel',
        confirmButtonText: '确定',
        confirmButtonClass: 'btn-custom-confirm',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this._deleteByIds(row)
      })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    async _deleteByIds(row) {
      const newTableList = this.form.parameterList.filter(e => e.deviceParameterName !== row.deviceParameterName)
      console.log('newTableList: ', newTableList)
      this.form.parameterList = newTableList
      // const { data } = await deleteDevInfoItem(uuid)
      // this.$message({
      //   type: 'success',
      //   message: data.message
      // })
      // this.requestTable()
    },

    submitAddDeviceInfo() {
      console.log('提交添加设备参数')
      console.log('this.form: ', this.form)
      console.log('this.devform: ', this.devform)
      this.form.parameterList.unshift(this.devform)
      // this.form = { ...this.form, parameterList: this.form.parameterList.push(this.devform) }
      this.dialogAddDevice = false
      this.devform = {}
    },
    closeAddDevice() {
      console.log('关闭')
      this.dialogAddDevice = false
    },

    deleteProInfo(row) {
      this.$confirm('此操作将该条删除，是否继续?', '提示', {
        cancelButtonClass: 'btn-custom-cancel',
        confirmButtonText: '确定',
        confirmButtonClass: 'btn-custom-confirm',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this._deleteProIds(row)
      })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    _dialogAddPro() {
      this.dialogAddPro = true
    },
    beforeUploadPro(file, fileList) {
      console.log('上传附件文件')
      this.profile = file.raw
      this.proform.profileList = [file.raw]
      this._getProData()
    },
    async _getProData() {
      const formData = new FormData()
      formData.append('file', this.profile)
      formData.append('userUuid', localStorage.getItem('uuid'))
      // const { data } = await getJsonData(formData)
      await uploadEnclosure(formData).then((res) => {
        console.log('res: ', res)
        const data = res.data
        console.log('data: ', data)
        this.$message({
          type: 'success',
          message: data.message
        })
        this.form = { ...this.form, filePath: data.data }
        this.proform.filePath = data.data
        console.log('this.proform.filePath: ', this.proform.filePath)
        console.log('this.form444', this.form)
      })
    },
    submitAddProInfo() {
      console.log('提交添加附件信息')
      if (this.proform.profileList.length === 0) {
        this.$message({
          type: 'warning',
          message: '请先导入产品附件'
        })
      } else {
        this.$refs.proform.validate(valid => {
          if (!valid) return
          this.form.fileList.unshift(this.proform)
          this.dialogAddPro = false
          this.proform = {}
          console.log('this.form提交添加附件信息: ', this.form)
        })
      }
    },
    closeAddPro() {
      console.log('关闭')
      this.dialogAddPro = false
    },
    async _deleteProIds(row) {
      const newTableList = this.form.fileList.filter(e => e.filePath !== row.filePath)
      console.log('newTableList: ', newTableList)
      this.form.fileList = newTableList
    },
    submitForm(val) {
      if (this.form.parameterList.length === 0 || this.form.fileList.length === 0) {
        this.$message({
          type: 'warning',
          message: '请先导入设备参数性能信息和产品附件信息'
        })
      }
      this.$refs.form.validate(valid => {
        if (!valid) return
        console.log('符合条件')
        this.$emit('submitForm', this.form)
      })
    },
    close(val) {
      this.$emit('close', {})
    }
  }

}
</script>

<style rel="stylesheet/scss" lang="scss">
.titleArea {
  padding-bottom: 10px;
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: #393f4e;
  line-height: 22px;
  font-weight: 500;
  border-bottom: 1px dashed #e6e6e6;
}
.addDialogBox {
  .el-form-item {
    margin: 20px;
    .el-form-item__content {
      width: 50%;
      height: 40px;
      line-height: 40px;
    }
    .upload-select {
      width: 100%;
    }
  }
  .el-date-editor.el-input {
    width: 100%;
  }
  .uploadFileStyle {
    .el-form-item__content {
      display: flex;
    }

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
      &:hover {
        color: #fff;
        background: #FF5338;
      }
    }
    .upload-demo {
      height: 40px;
      line-height: 40px;
    }
  }
  .upload-demo,
  .el-upload-dragger {
    width: 120px;
    border: none;
  }
  .upload-dev-file {
    display: flex;
    .el-upload .el-upload-dragger {
      height: 46px;
    }
  }
  .mark-btn,
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
  .mark-btn,
  .btn-one {
    margin-left: 20px;
    background: #fff;
    color: #FF5338;
    border: 1px solid #FF5338;
    &:hover {
      color: #fff;
      background: #FF5338;
    }
  }
  .mark-btn {
    line-height: 32px;
  }
}
.dialogAddDev {
  .adddevBox {
    .el-form-item {
      margin: 20px;
      .el-form-item__content {
        width: 50%;
        // height: 40px;
        // line-height: 40px;
      }
      .upload-select {
        width: 100%;
      }
    }
    .upload-demo,
    .el-upload-dragger {
      border: none;
      height: 50px;
    }
  }
  .dialog-footer {
    display: flex;
    margin-top: 12px;
    justify-content: center;
    .mark-btn,
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
    .mark-btn,
    .btn-one {
      margin-left: 20px;
      background: #fff;
      color: #FF5338;
      border: 1px solid #FF5338;
      &:hover {
        color: #fff;
        background: #FF5338;
      }
    }
  }
}
.dialog-footer {
  display: flex;
  margin-top: 12px;
  justify-content: center;
}
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
  &:hover {
    color: #fff;
    background: #FF5338;
  }
}

.btnMargin {
  margin: 10px 10px;
}
</style>
