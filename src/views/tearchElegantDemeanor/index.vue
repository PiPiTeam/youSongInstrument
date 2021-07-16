<template>
  <div class="tearcher-container">
    <el-row type="flex" justify="space-between">
      <h3>名师风采</h3>
      <span>
        <el-button class="mt-13" @click="addTearcher">新增</el-button>
      </span>
    </el-row>
    <div>
      <el-row v-for="(item, index) of tearcher.tearcherList" :key="index" type="flex">
        <el-form :ref="'tearchForm'+index" v-model="tearcher.tearcherList[index]" label-position="left" label-width="120px" style="width:90%;">
          <el-form-item :label="'老师'+(index+1)+'姓名'">
            <el-input v-model="item.name" placeholder="请输入" />
          </el-form-item>
          <el-form-item :label="'老师'+(index+1)+'介绍'">
            <el-input v-model="item.desc" type="textarea" placeholder="请输入" />
          </el-form-item>
          <el-form-item :label="'老师'+(index+1)+'图片'">
            <el-upload
              action="/"
              list-type="picture-card"
              :auto-upload="false"
              :on-preview="handlePictureCardPreview"
              :file-list="item.fileList"
            >
              <i class="el-icon-plus" />
            </el-upload>
          </el-form-item>
        </el-form>
        <div style="width:10%;">
          <el-button type="danger" icon="el-icon-delete" class="f-r" :disabled="tearcher.tearcherList.length <= 1" @click="deleteTearcher(index)" />
        </div>
      </el-row>
    </div>
    <el-row type="flex" justify="center">
      <el-button type="primary">保存</el-button>
    </el-row>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TearchElegantDemeanor',
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: '',
      fileList: [],
      tearcher: {
        tearcherList: [{
          name: '',
          desc: '',
          fileList: []
        }]
      }
    }
  },
  computed: {

  },
  mounted() {

  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    addTearcher() {
      this.tearcher.tearcherList.push({
        name: '',
        desc: '',
        fileList: []
      })
    },
    deleteTearcher(index) {
      this.tearcher.tearcherList.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.mt-13 {
  margin-top: 13px;
}
.f-r {
  float: right;
}
</style>

