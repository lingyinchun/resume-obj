<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 表单</el-breadcrumb-item>
        <el-breadcrumb-item>编辑器</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-button>无权限</el-button>
      这里有个权限按钮:
      <el-button v-permission="['sys:role']">有权限</el-button>
      <el-tabs v-model="activeName">
        <el-tab-pane label="Vue-Quill-Editor" name="first">
          <div class="plugins-tips">
            Vue-Quill-Editor：基于Quill、适用于Vue2的富文本编辑器。
            访问地址：<a href="https://github.com/surmon-china/vue-quill-editor" target="_blank">vue-quill-editor</a>
          </div>
          <MyVueEditor v-model="editorVal"/>
          <el-button class="editor-btn" type="primary" @click="submit">提交</el-button>
        </el-tab-pane>
        <el-tab-pane label="tinymce-vue" name="second">
          <MyTinymce v-model="editorVal2"/>
        </el-tab-pane>
      </el-tabs>


    </div>
  </div>
</template>

<script>
import MyVueEditor from "@/components/MyVueEditor"
import MyTinymce from "@/components/MyTinymce"
import permission from '@/directive/permission/index'
import { deepClone } from '@/utils/util'

export default {
  name: 'editor',
  directives: { permission },
  components: {
    MyVueEditor,MyTinymce
  },
  data: function () {
    return {
      editorVal: '',
      editorVal2: '',
      activeName: 'first'
    }
  },
  methods: {
    submit() {
      console.log(deepClone(this.editorVal))
      console.log(this.editorVal)
      var str = '安抚${asAAfasf}按时发${fff}顺${fasfa'
      var reg = /(?<=\$\{)[a-zA-Z]+(?=\})/g;
      console.log(str.match(reg))
      console.log(this.content);
      this.$message.success('提交成功！');
    }
  }
}
</script>
<style scoped>
</style>
