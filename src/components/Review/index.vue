<template>
  <div class="review-container">
    <el-dialog
      :title="dialogTitle"
      :visible.sync="visible"
      width="70%"
      top="2%"
      @close="close"
    >
      <div class="basic-info">
        <p class="info-title">设备基本信息</p>
        <div class="row child-3">
          <div><span class="required">产品名称/通用名称：</span>{{ deviceInfo.deviceName }}</div>
          <div><span class="required">规格型号：</span>{{ deviceInfo.deviceSpecification }}</div>
          <div><span class="required">管理类别：</span>{{ deviceInfo.deviceManageClass }}</div>
        </div>
        <div class="row">
          <div>
            <span class="required">产品描述：</span>
            {{ deviceInfo.deviceProfile }}
          </div>
        </div>
        <div class="row child-2">
          <div>
            <span class="required">结构及组成/主要组成成分：</span>
            {{ deviceInfo.deviceStructure }}
          </div>
          <div><span>资质认证：</span>{{ deviceInfo.deviceQualificationCertification }}</div>
        </div>
        <div class="row">
          <div>
            <span class="required">报警及医疗指标：</span>
            {{ deviceInfo.deviceSecurityInfo }}
            <!-- 医疗器械中的报警装置能及时提醒医疗保健人员,患者病情出现了恶化,或者警告设备操作人员,这样操作可能有危险 -->
          </div>
        </div>
        <div class="row">
          <div>
            <span class="required">不良事件情况：</span>
            {{ deviceInfo.deviceAdverseEventInfo }}
          </div>
        </div>
        <div class="row child-2">
          <div><span class="required">主体报价：</span>{{ deviceInfo.deviceMainPrice }}元</div>
          <div><span class="required">配套服务费用：</span>{{ deviceInfo.deviceServicePrice }}元</div>
        </div>
        <div class="row child-3">
          <div><span class="required">注册状态：</span>
            <em v-show="deviceInfo.deviceRegistState=='0'">无效</em>
            <em v-show="deviceInfo.deviceRegistState=='1'">有效</em>
          </div>
          <div><span>是否进口：</span>
            <em v-show="deviceInfo.deviceIsImport=='0'">国产</em>
            <em v-show="deviceInfo.deviceIsImport=='1'">进口</em>
          </div>
          <div><span>原产地：</span>{{ deviceInfo.deviceCountryOfOrigin }}</div>
        </div>
        <div class="row child-3">
          <div><span class="required">审批部门：</span>{{ deviceInfo.deviceApprovalDepartment }}</div>
          <div><span>变更日期：</span>{{ deviceInfo.deviceRegistLicenseModifyDate }}</div>
          <div><span>变更情况：</span>{{ deviceInfo.deviceRegistLicenseModifyInfo }}</div>
        </div>
        <div class="row child-3">
          <div><span>存储条件：</span>{{ deviceInfo.deviceStoreCondition }}</div>
          <div><span>产品标准：</span></div>
          <div><span>有效期：</span>{{ deviceInfo.deviceStoreValidTime }}个月</div>
        </div>
      </div>
      <div class="device-info">
        <p class="info-title">医疗器械唯一标识信息</p>
        <div class="row child-2">
          <div><span class="required">器械类别及代码：</span>{{ deviceInfo.deviceTypeUuid }}</div>
          <div>
            <span class="required">产品类别：{{ deviceInfo.productType }}</span>
          </div>
        </div>
        <div class="row child-3">
          <div>
            <span class="required">注册证编号或者备案凭证编号</span>
            {{ deviceInfo.deviceRegistLicense }}
          </div>
          <div>
            <span>配件报价：</span>
            {{ deviceInfo.deviceAccessoryTotalPrice }}
          </div>
          <div>
            <span class="required">批准日期及有效日期：</span>
            {{ deviceInfo.deviceRegistLicenseApprovalDate }}
          </div>
        </div>
        <div class="row child-3">
          <div>
            <span>最大重复使用次数：</span>
            {{ deviceInfo.deviceUseNumber }}
          </div>
          <div>
            <span>是否为包类/组套类产品：</span>
            <em v-show="deviceInfo.deviceSuitProductFlag == '1'"> 是</em>
            <em v-show="deviceInfo.deviceSuitProductFlag == '0'"> 否</em>
          </div>
          <div>
            <span>是否标记为一次性使用：</span>
            <em v-show="deviceInfo.deviceOnceFlag == '1'"> 是</em>
            <em v-show="deviceInfo.deviceOnceFlag == '0'"> 否</em>
          </div>
        </div>
        <div class="row">
          <div>
            <span>磁共振（MR）安全相关信息：</span>
            {{ deviceInfo.deviceMrSecurityInfo }}
          </div>
        </div>
        <div class="row child-3">
          <div>
            <span>是否为无菌包装：</span>
            <em v-show="deviceInfo.deviceAsepticPackagingFlag == '1'"> 是</em>
            <em v-show="deviceInfo.deviceAsepticPackagingFlag == '0'"> 否</em>
          </div>
          <div>
            <span>使用前是否需要进行灭菌：</span>
            <em v-show="deviceInfo.deviceNeedDisinfectionPreUseFlag == '1'"> 是</em>
            <em v-show="deviceInfo.deviceNeedDisinfectionPreUseFlag == '0'"> 否</em>
          </div>
          <div>
            <span>灭菌方式：</span>
            {{ deviceInfo.deviceDisinfectionType }}
          </div>
        </div>

        <div class="row child-3">
          <div>
            <span>最小销售单元产品标识：</span>
            {{ deviceInfo.deviceMinSaleUnitProductId }}
          </div>
          <div>
            <span>唯一标识编码体系名称：</span>
            {{ deviceInfo.deviceMedicalCode }}
          </div>
          <div>
            <span>产品标识发布日期：</span>
            {{ deviceInfo.deviceProductPublishDate }}
          </div>
        </div>

        <div class="row child-3">
          <div>
            <span>最小销售单元中使用单元的数量：</span>
            {{ deviceInfo.deviceMinSaleUnitProductNumber }}
          </div>
          <div>
            <span>使用单元产品标识：</span>
            <em v-show="deviceInfo.deviceUseUnitProductIdFlag == '1'"> 是</em>
            <em v-show="deviceInfo.deviceUseUnitProductIdFlag == '0'"> 否</em>
          </div>
          <div>
            <span>是否有本体直接标识：</span>
            <em v-show="deviceInfo.deviceHasSelfDirectIdFlag == '1'"> 是</em>
            <em v-show="deviceInfo.deviceHasSelfDirectIdFlag == '0'"> 否</em>
          </div>
        </div>
      </div>
      <div>
        <p class="info-title">设备参数性能信息</p>
        <el-table
          :data="performanceData"
          border
          style="width:100%"
        >
          <el-table-column
            prop="deviceParameterName"
            label="参数名称"
          />
          <el-table-column
            prop="deviceParameterMain"
            label="性能要求"
          />
          <!-- <el-table-column
            prop="deviceUuid"
            label="设备ID"
          />
          <el-table-column
            prop="deviceParameterMaxError"
            label="最大误差"
          />
          <el-table-column
            prop="deviceParameterBasis"
            label="证明依据">
          </el-table-column> -->

          <el-table-column
            prop="comment"
            label="备注"
          />
        </el-table>
      </div>
      <div>
        <p class="info-title">产品附件信息</p>
        <el-table
          :data="adjunctData"
          border
          style="width:100%"
        >
          <el-table-column
            prop="fileName"
            label="附件名称"
          />
          <!-- <el-table-column
            prop="filePath"
            label="文件路径"
          /> -->
          <el-table-column
            prop="fileVersion"
            label="版本号"
          />
          <el-table-column
            prop="fileSource"
            label="文件来源"
          />
          <el-table-column
            prop="fileDesicription"
            label="附件简要说明"
          />
          <el-table-column
            prop="fileType"
            label="文件类型"
          />
          <el-table-column label="操作" align="left">
            <template slot-scope="scope">
              <a
                :href="baseUrl+'/kgDevice/downloadDeviceFile?uuid='+scope.row.uuid"
                :download="baseUrl+'/kgDevice/downloadDeviceFile?uuid='+scope.row.uuid"
                style="color:#409EFF;"
              >下载</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-row slot="footer" type="flex" justify="end" class="dialog-footer">
        <div v-show="checkType=='review'" class="btn" @click="review">
          <span>评审</span>
        </div>
        <div class="btn btn-one" @click="close">
          <span>关闭</span>
        </div>
      </el-row>

    </el-dialog>
    <el-dialog
      width="30%"
      title="评审意见"
      :visible.sync="innerVisible"
      append-to-body
      @close="closeReviewForm"
    >
      <el-form ref="reviewFormRef" :model="reviewForm" :rules="reviewRules" label-width="100px" label-position="right">
        <el-form-item label="评审日期" prop="reviewDate">
          <el-date-picker v-model="reviewForm.reviewDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" />
        </el-form-item>
        <el-form-item label="评审意见" prop="reviewOpinion">
          <el-input v-model="reviewForm.reviewOpinion" type="textarea" placeholder="请输入评审意见" class="review-name" rows="3" maxlength="500" show-word-limit />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center" class="dialog-footer">
        <div class="btn" @click="submit">
          <span>提交</span>
        </div>
        <div class="btn btn-one" @click="cancel">
          <span>取消</span>
        </div>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getDeviceDetail, downloadDeviceFile, reviewDevice } from '../../api/task'
export default {
  props: {
    deviceData: {
      type: Object,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    },
    checkType: {
      required: true
    }
  },
  data() {
    return {

      baseUrl: process.env.VUE_APP_BASE_API,

      innerVisible: false,
      dialogTitle: '产品信息查询',
      deviceInfo: {},
      reviewForm: {
        reviewDate: '',
        reviewOpinion: ''
      },
      performanceData: [],
      adjunctData: [],
      reviewRules: {
        reviewDate: [
          { required: true, message: '请选择评审日期', trigger: ['blur', 'change'] }
        ],
        reviewOpinion: [
          { required: true, message: '请输入评审意见', trigger: ['blur', 'change'] }
        ]

      }}
  },
  watch: {
    deviceData(newVal) {
      if (newVal.uuid) {
        const paramas = {
          deviceUuid: newVal.uuid,
          userUuid: localStorage.getItem('uuid')
        }
        getDeviceDetail(paramas).then(res => {
          this.deviceInfo = res.data.data
          this.performanceData = this.deviceInfo.parameterList
          this.adjunctData = this.deviceInfo.fileList
          this.reviewForm.deviceUuid = this.deviceInfo.uuid
        })
      }
    }
  },
  created() {
    console.log()
  },
  methods: {
    close() {
      this.$emit('close')
    },
    cancel() {
      this.innerVisible = false
    },
    review() {
      this.innerVisible = true
    },
    closeReviewForm() {
      this.reviewForm = this.$options.data().reviewForm
      this.$refs.reviewFormRef.clearValidate()
      this.$refs.reviewFormRef.resetFields()
    },
    async _reviewDevice(datas) {
      const { data } = await reviewDevice(datas)
      if (data.code === '200') {
        this.$message.success(data.message)
        this.innerVisible = false
      }
    },
    submit() {
      this.$refs.reviewFormRef.validate(valid => {
        if (!valid) return
        this._reviewDevice(this.reviewForm)
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.dashboard-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  min-height: 88vh;
}
.row {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  font-size: 14px;
  span{
    font-weight:600;
    position: relative;
  }
  em{
    font-style:normal;
  }

}
.child-3 div {
  width: calc(100% / 3);
}
.child-2 > div {
  width: 50%;
}
.info-title{
  border-top:1px #d8d8d8 dashed;
  padding-top:10px;
  font-weight: 600;
  color:#409EFF;
}
.required:before{
    content:'*';
    position:absolute;
    display: block;
    left:-8px;
    font-size:18px;
    color:red;
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
.review-wrp{
  display:flex;
  align-items:center;
  padding:10px 0;
  span{
    display:block;
    width:100px;
  }
}
.review-name{
  flex: 1;
}
</style>
