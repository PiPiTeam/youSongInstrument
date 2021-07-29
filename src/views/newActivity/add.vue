<template>
  <div class="add-active">
    <el-row type="flex" class="m-10">
      <span class="label">活动标题</span>
      <el-input v-model="title" placeholder="请输入活动标题" />
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
import { getShopId } from '@/utils/auth'
import { addActivity, getActivityDetail, updataActivity } from '@/api/shop'
export default {
  data() {
    return {
      shopId: getShopId() || '',
      id: '',
      title: '',
      editor: null
    }
  },
  mounted() {
    console.log(this.$route.query)
    this.editor = new Wangeditor('#editor')
    this.editor.create()
    if (this.$route.query && this.$route.query.id) {
      this.id = this.$route.query.id
      this._getActivityDetail()
    }
  },
  methods: {
    goback() {
      this.$router.go(-1)
    },
    submit() {
      const contentText = this.editor.txt.text()
      const contentJson = this.editor.txt.getJSON()
      let imgSrc = ''
      for (const item of contentJson) {
        if (imgSrc) break
        if (item.tag === 'p') {
          for (const innerItem of item.children) {
            if (innerItem.tag === 'img') {
              // 获取src
              imgSrc = innerItem.attrs[0].value
              break
            }
          }
        }
      }
      console.log(imgSrc)
      console.log(contentText)
      if (this.id) {
        this._updataActivity({
          id: this.id,
          title: this.title,
          content: this.editor.txt.html()
        })
      } else {
        this._addActivity({
          storeId: this.shopId,
          title: this.title,
          content: this.editor.txt.html()
        })
      }
    },
    async _getActivityDetail() {
      const { data } = await getActivityDetail(this.id)
      this.title = data.data.title
      this.editor.txt.html(data.data.content)
    },
    async _addActivity(data) {
      const res = await addActivity(data)
      if (res.data.code === '10000') {
        this.$message.success('新增成功')
        this.goback()
      }
    },
    async _updataActivity(data) {
      const res = await updataActivity(data)
      if (res.data.code === '10000') {
        this.$message.success('修改成功')
        this.goback()
      }
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
