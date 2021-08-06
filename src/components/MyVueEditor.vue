<template>
  <div>
    <div class="container-editor" >
      <div id="myeditor">
        <el-upload
            class="avatar-uploader"
            ref="upload"
            :action="actUrl"
            :limit="1"
            :show-file-list="false"
            :http-request="UploadImage"
            :before-upload="beforeAvatarUpload"
        >
          <el-button size="small" >选取图片</el-button>
        </el-upload>
      </div>
      <quill-editor ref="myQuillEditor" v-model="content" :disabled="disabled" :options="editorOption"
                    @blur="onEditorBlur($event)"
                    @focus="onEditorFocus($event)"
                    @ready="onEditorReady($event)"
                    @change="onEditorChange($event)"></quill-editor>
<!--      <el-button class="editor-btn" type="primary" @click="submit">提交</el-button>-->
    </div>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor, Quill } from 'vue-quill-editor'
import {uploadFile} from "@/api";
import imageResize from 'quill-image-resize-module'
Quill.register('modules/imageResize', imageResize)

export default {
  name: 'MyVueEditor',
  components: {
    quillEditor
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      actUrl: '/mall-api/file-m/m/file/upload',
      content: this.value,
      editorOption: {
        placeholder: '请输入内容',
        modules: {
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'],    //加粗，斜体，下划线，删除线
              ['blockquote', 'code-block'],     //引用，代码块
              [{'header': 1}, {'header': 2}],        // 标题，键值对的形式；1、2表示字体大小
              [{'list': 'ordered'}, {'list': 'bullet'}],     //列表
              [{'script': 'sub'}, {'script': 'super'}],   // 上下标
              [{'indent': '-1'}, {'indent': '+1'}],     // 缩进
              [{'direction': 'rtl'}],             // 文本方向
              [{'size': ['small', false, 'large', 'huge']}], // 字体大小
              [{'header': [1, 2, 3, 4, 5, 6, false]}],     //几级标题
              [{'color': []}, {'background': []}],     // 字体颜色，字体背景颜色
              [{'font': []}],     //字体
              [{'align': []}],    //对齐方式
              ['clean'],    //清除字体样式
              ['image']    //上传图片、上传视频
            ],
            handlers: {
              'image': function (value) {
                if (value) {
                  document.querySelector('#myeditor .avatar-uploader input').click()
                } else {
                  this.quill.format('image', false);
                }
              }
            }
          },
          imageResize: {
            displayStyles: {
              backgroundColor: 'black',
              border: 'none',
              color: 'white'
            },
            modules: ['Resize', 'DisplaySize', 'Toolbar']
          }
        }
      }
    }
  },
  watch: {
    value(val) {
      this.content = val
    },
    content(val) {
      this.$emit('input', val)
      // this.$emit('change', val)
    }
  },
  methods: {
    UploadImage(param) {
      const fd = new FormData()
      fd.append('file', param.file)
      uploadFile(this.actUrl, fd).then((res)=>{
        if(res.code===200){
          try{
            let quill = this.$refs.myQuillEditor.quill
            let length = quill.getSelection().index;
            quill.insertEmbed(length, 'image', res.data)
            quill.setSelection(length + 1)
            this.$refs['upload'].clearFiles()
          }catch (even){

          }
          // this.$baseMessage('上传成功', 'success')
        }else{
          this.$baseMessage(res.message, 'error')
        }
      })
    },
    beforeAvatarUpload(file) {
      console.log(file, file.type)
      const isImg = file.type.indexOf('image') > -1
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isImg) {
        this.$message.error('只能上传图片');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isLt2M
    },
    onEditorBlur(event){
      console.log('onEditorBlur', event)
      this.$emit('getContent', this.content)
    },
    onEditorFocus(event){
      console.log('onEditorFocus', event)
    },
    onEditorReady(event){
      console.log('onEditorReady', event)
    },
    onEditorChange(event){
      // console.log('change改变', event)
      // this.$emit('input', event.html)
    }
  }
}
</script>
<style scoped lang="scss">
.container-editor{
  .editor-btn{
    margin-top: 20px;
  }
  #myeditor{
    display: none;
  }
}
</style>
