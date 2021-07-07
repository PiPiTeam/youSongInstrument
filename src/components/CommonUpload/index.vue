<!--通用上传组件-->
<template>
  <div>
    <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      :title="dialog.title"
      :visible.sync="dialog.visible"
      width="40%"
      class="upload-dialog"
      @close="onClose"
    >
      <el-row type="flex" justify="center">

        <el-upload
          ref="upload"
          class="upload-demo"
          drag
          :action="dialog.upload.action"
          :auto-upload="false"
          :accept="dialog.upload.accept"
          :file-list="fileList"
          :limit="dialog.upload.limit"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :on-error="handleError"
          :on-exceed="handleExceed"
          :before-upload="beforeUpload"
          multiple
        >
          <el-row type="flex" justify="center">
            <div class="el-upload__text">请按照模版填写数据再导入</div>
            <el-button align="right" size="small" type="primary" class="import-btn">导入</el-button>
          </el-row>
        </el-upload>
      </el-row>
      <el-row type="flex" justify="center">
        <div class="downtpl">
          <span v-if="dialog.downloadBtn" align="right" size="small" type="primary" @click="downloadTemplate">下载模板</span>
        </div>
      </el-row>
      <div align="center" class="upload-footer">
        <el-button size="small" @click="submitUpload">确定</el-button>
        <el-button size="small" @click="closeUpload">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { commonUpload } from '@/utils/httpHelper'

export default {
  name: 'ECommonUpload',
  components: {},
  props: {
    // dialog相关属性
    dialog: {
      type: Object,
      default() {
        return {
          title: '', // 标题
          visible: false, // 是否可见
          downloadBtn: false, // 是否需要下载模板按钮
          upload: { // 上传相关属性
            action: '', // 地址,如果需要使用本组件提供上传方法，请提供此参数
            fileForm: FormData, // 如果需要使用本组件提供上传方法，请提供此参数。
            limit: 50, // 限制文件数
            accept: '.*' // 限制文件类型
          }
        }
      }
    }
  },
  data() {
    return {
      fileList: []
    }
  },
  computed: {},
  created() {
  },
  methods: {
    onClose() {
      this.fileList = []
      this.dialog.upload.action = ''
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePreview(file) {
      this.$emit('preview', file)
    },
    // 文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      this.$emit('remove', file, fileList)
    },
    // 文件上传成功时的钩子
    handleSuccess(response, file, fileList) {
      this.$emit('success', response, file, fileList)
    },
    // 文件上传失败时的钩子
    handleError(err, file, fileList) {
      this.$emit('error', err, file, fileList)
    },
    submitUpload() {
      // 判断是否使用自带上传方法
      if (this.dialog.upload.action === '') {
        // 否
        this.$refs.upload.submit()
      } else {
        // 是
        for (const file of this.fileList) {
          commonUpload(this.dialog.upload.action, this.dialog.upload.fileForm, ok => {
            this.handleSuccess(ok, file, this.fileList)
          })
        }
      }
    },
    handleExceed() {
      this.$message.warning('文件数量超出了限制')
    },
    // 如无必要，请在此回调中调用你的上传接口
    beforeUpload(file) {
      this.$emit('beforeUpload', file)
    },
    // 此回调用于下载模板
    downloadTemplate() {
      this.$emit('downloadTemplate')
    },
    closeUpload() {
      this.dialog.visible = false
      this.onClose()
    }
  }
}
</script>

<style lang="scss">
  .el-upload {
    width: 100%;
    .el-upload-dragger {
      width: 300px;
      height: 40px;
      line-height: 40px;
      border: none;
      .el-upload__text {
        background: #faf9f9;
        color: #D1D1D1;
        padding: 0 20px;
      }
    }
  }
  .import-btn {
    height: 40px;
    margin-left: 10px;
  }
  .upload-dialog {
    .el-dialog__body {
      padding-left: 0;
      padding-right: 0;
    }
    .downtpl {
      margin-left: -50%;
    }
    .upload-footer {
      padding: 30px;
      margin-top:20px;
      border-top: 1px solid #eee;
    }
  }
</style>
