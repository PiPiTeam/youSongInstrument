<template>
  <div class="issue-container">
    <div class="task-table">
      <div class="tab-title">数据查询</div>
      <div class="flex-from">
        <div>
          <el-select v-model="query.type" placeholder="请选择问题类型" clearable>
            <el-option v-for="item in listQuestionOpt" :key="item.code" :label="item.value" :value="item.code" />
          </el-select>
          <el-input
            v-model="query.description"
            size="medium"
            placeholder="请输入问题描述"
            prefix-icon="el-icon-search"
            class="input-with-select w200"
            clearable
          />
          <div class="add-atlas" @click="_getPageList">
            <span>搜索</span>
          </div>
          <div class="text-btn" @click="requestTable">重置</div>
        </div>
        <div class="add-atlas" @click="showUpload">
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
        <el-table-column prop="questionTypeName" label="问题类型" align="left" />
        <el-table-column prop="questionDescription" label="问题描述" align="left" />
        <el-table-column prop="userName" label="创建人" align="left" />
        <el-table-column prop="phone" label="创建人联系方式" align="left" />
        <el-table-column prop="createTime" label="创建时间" align="left" />
        <el-table-column label="操作" align="left">
          <template slot-scope="scope">
            <el-button v-permission="'help1:deal'" class="check-btn" :disabled="scope.row.status == '1'" @click="dealQuestion(scope.row)">处理</el-button>
            <el-button class="check-btn" @click="viewImg(scope.row, true)">查看附件</el-button>
            <el-button v-permission="'help1:delete'" class="check-btn" @click="deleteQuestion(scope.row)">删除</el-button>
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

    <el-dialog title="添加问题" :visible.sync="dialogVisible" width="40%" top="6%" @close="close">
      <el-form ref="dataFormRef" :model="form" :rules="rules" label-width="100px" label-position="right" auto-complete="off">
        <el-form-item label="问题类型" prop="questionType">
          <el-select v-model="form.questionType" class="upload-select" placeholder="请选择问题类型" clearable>
            <el-option v-for="item in listQuestionOpt" :key="item.code" :label="item.value" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="问题描述" prop="questionDescription">
          <el-input v-model="form.questionDescription" type="textarea" class="upload-select" placeholder="请输入问题描述" rows="3" maxlength="500" show-word-limit />
        </el-form-item>
        <el-form-item label="上传附件" prop="file">
          <el-upload
            ref="upload"
            class="upload-demo"
            action="#"
            :auto-upload="false"
            accept="*"
            :file-list="fileList"
            multiple
            :limit="3"
            :on-change="beforeUpload"
            list-type="picture"
          >
            <el-row type="flex" justify="left">
              <div class="btn btn-import">导入</div>
            </el-row>
            <div slot="tip" class="el-upload__tip">最多上传3个图片，只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center" class="dialog-footer">
        <div class="btn" @click="submitForm">
          <span>确认</span>
        </div>
        <div class="btn btn-one" @click="dialogVisible = false">
          <span>取消</span>
        </div>
      </el-row>
    </el-dialog>
    <el-dialog title="查看附件" :visible.sync="imgDialogVisible" width="50%" top="6%">
      <div class="demo-image__preview">
        <el-image
          v-for="url in srcList"
          :key="url"
          :src="url"
          :preview-src-list="srcList"
          fit="contain"
          style="width: 260px; height: 260px; background-color: #eee;margin-right: 10px;"
        />
        <p v-if="!srcList.length" style="text-align: center;min-height:260px;line-height:260px">暂无附件</p>
      </div>
    </el-dialog>
    <!-- 处理问题 -->
    <el-dialog title="处理问题" :visible.sync="dealDialogVisible" width="40%" top="6%" @close="closeDeal">
      <el-form ref="dealFormRef" :model="dealForm" label-width="100px" label-position="right">
        <el-form-item label="问题类型">{{ dealForm.questionTypeName }}</el-form-item>
        <el-form-item label="问题描述">{{ dealForm.questionDescription }}</el-form-item>
        <el-form-item label="附件">
          <div v-if="srcList.length">
            <el-image
              v-for="url in srcList"
              :key="url"
              :src="url"
              :preview-src-list="srcList"
              fit="contain"
              style="width: 100px; height: 100px; background-color: #eee;margin-right: 10px;"
            />
          </div>
          <div v-else>暂无附件</div>
        </el-form-item>
        <el-form-item label="回复" prop="reply" :rules="[{required:true, message: '请输入回复', trigger: 'blur'}]">
          <el-input v-model="dealForm.reply" type="textarea" class="upload-select" placeholder="请输入回复" rows="3" maxlength="500" show-word-limit />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center" class="dialog-footer">
        <div class="btn" @click="submitDealForm">
          <span>提交</span>
        </div>
        <div class="btn btn-one" @click="dealDialogVisible = false">
          <span>取消</span>
        </div>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getQuestionList, listQuestionTypes, addQuestion, delQuestion, dealQuestionReq } from '@/api/help'

export default {
  name: 'Issue',
  components: {
    Pagination
  },
  filters: {},
  data() {
    return {
      host: process.env.VUE_APP_IMAGE_HOST,
      query: {
        type: '',
        description: ''
      },
      fileList: [],
      dialogVisible: false,
      loading: false,
      tableData: [], // status 0-未完成 1-已完成
      pager: {
        current: 1, // 记录页码
        size: 10,
        total: 1
      },
      form: {
        questionType: '',
        questionDescription: '',
        file: []
      },
      rules: {
        questionDescription: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ],
        questionType: [
          { required: true, message: '请选择管理类型', trigger: 'blur' }
        ]
      },
      listQuestionOpt: [], // 问题类型
      imgDialogVisible: false,
      srcList: [],
      dealDialogVisible: false,
      dealForm: {}
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
    this._listQuestionTypes()
  },
  methods: {
    viewImg(row, showFile) {
      this.srcList = []
      row.questionImage1 && this.srcList.push(this.host + row.questionImage1)
      row.questionImage2 && this.srcList.push(this.host + row.questionImage2)
      row.questionImage3 && this.srcList.push(this.host + row.questionImage3)
      showFile && (this.imgDialogVisible = true)
    },
    dealQuestion(row) {
      row.reply = ''
      this.dealForm = row
      this.viewImg(row, false)
      this.dealDialogVisible = true
    },
    deleteQuestion(row) {
      this.$confirm('此操作将该条删除，是否继续?', '提示', {
        cancelButtonClass: 'btn-custom-cancel',
        confirmButtonText: '确定',
        confirmButtonClass: 'btn-custom-confirm',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const { data } = await delQuestion({ uuid: row.uuid })
          if (data.code === '200') {
            this.$message.success(data.message)
            this.requestTable()
          }
        })
    },
    requestTable() {
      this.query = {
        fileName: '',
        questionType: '',
        userUuid: localStorage.getItem('uuid'),
        roleCode: localStorage.getItem('roleCode')
      }
      this.pager.current = 1
      this._getPageList()
    },
    showUpload() {
      this.dialogVisible = true
    },
    close() {
      this.form = this.$options.data().form
      this.$refs.dataFormRef.clearValidate()
      this.$refs.dataFormRef.resetFields()
      this.$refs.upload.clearFiles()
    },
    closeDeal() {
      this.dealForm = this.$options.data().dealForm
      this.$refs.dealFormRef.clearValidate()
      this.$refs.dealFormRef.resetFields()
    },
    submitForm() {
      this.$refs.dataFormRef.validate(valid => {
        if (!valid) return
        this._addQuestion()
      })
    },
    submitDealForm() {
      this.$refs.dealFormRef.validate(valid => {
        if (!valid) return
        this._dealQuestionReq({
          status: 1,
          uuid: this.dealForm.uuid,
          reply: this.dealForm.reply
        })
      })
    },
    beforeUpload(file, fileList) {
      this.form.file = fileList
    },
    async _addQuestion() {
      const formData = new FormData()
      formData.append('questionType', this.form.questionType)
      formData.append('questionDescription', this.form.questionDescription)
      for (let i = 0; i < this.form.file.length; i++) {
        formData.append('files', this.form.file[i].raw)
      }
      const { data } = await addQuestion(formData)
      if (data.code === '200') {
        this.$message.success(data.message)
        this.requestTable()
        this.dialogVisible = false
      }
    },
    async _dealQuestionReq(datas) {
      const { data } = await dealQuestionReq(datas)
      if (data.code === '200') {
        this.$message.success(data.message)
        this.requestTable()
      }
    },
    async _getPageList(pager) {
      try {
        pager && Object.assign(this.pager, pager)
        this.loading = true
        const { data } = await getQuestionList(this.queryParameter)
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
    async _listQuestionTypes() {
      const { data } = await listQuestionTypes()
      this.listQuestionOpt = data.data
    }
  }
}
</script>

<style lang="scss">
.el-table::before {
  height: 0;
}

.issue-container .el-upload__tip {
  margin: 10px 0 0 0;
  line-height: 14px;
  color: #999;
}
</style>

<style lang="scss" scoped>
.el-input__prefix,.el-input__suffix{
  color: #FF5338;
}
.tab-title {
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
.btn-import {
  margin-left: 0;
  margin-top: 4px;
  background: #fff;
  color: #FF5338;
  border: 1px solid #FF5338;
}
.input-with-select{
  margin-left: 20px;
}
.add-atlas {
    margin: 8px 0px 0px 16px;
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

.issue {
  &-container {
    .bg-border {
      width: 100%;
      height: 402px;
      background: rgba(255, 255, 255, 1);
    }
    .task-table {
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
        &.is-disabled, &.is-disabled:hover {
          color: #C0C4CC;
          cursor: not-allowed;
          background-image: none;
          background-color: #FFF;
          border-color: #EBEEF5;
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
