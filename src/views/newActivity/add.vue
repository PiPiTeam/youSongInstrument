<template>
  <div class="add-active">
    <el-row type="flex" class="m-10">
      <span class="label">活动标题</span>
      <el-input v-model="name" placeholder="请输入活动标题" />
    </el-row>
    <el-row>
      <div id="editor" />
    </el-row>
    <el-row class="m-10" type="flex" justify="center">
      <el-button @click="goback">返回</el-button>
      <el-button type="primary" @click="submit">提交</el-button>
    </el-row>
  </div>
</template>
<script>
import Wangeditor from 'wangeditor'
export default {
  data() {
    return {
      name: '',
      editor: null
    }
  },
  mounted() {
    this.editor = new Wangeditor('#editor')
    this.editor.create()
  },
  methods: {
    goback() {
      this.$router.go(-1)
    },
    submit() {
      console.log(this.editor.txt.html())
    }
  }
}
</script>
<style lang="scss" scoped>
.label {
  width: 100px;
  line-height: 40px;
}
.m-10 {
  margin: 10px 0;
}
</style>
