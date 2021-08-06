<template>
  <div>
    <el-upload
        class="upload-demo"
        ref="upload"
        action="actUrl"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-change="changeFile"
        :limit="limit"
        :file-list="fileList"
        :auto-upload="false"
        :before-upload="beforeAvatarUpload"
        :http-request="UploadImage"
    >
      <el-button size="small" >选取文件</el-button>
<!--      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>-->
<!--      <div v-if="tip" slot="tip" class="el-upload__tip">{{tip}}</div>-->
    </el-upload>
    <div v-if="!isAuto">
      <br/>
      <el-button type="primary" @click="submitBtn">上传</el-button>
    </div>
  </div>
</template>

<script>
import {uploadFile} from '@/api/index'
export default {
  name: "uploadFileFormData",
  props: {
    actUrl: {
      type: String,
      default: ''
    },
    tip: {
      type: String,
      default: ''
    },
    limit: {
      type: Number,
      default: 1
    },
    data: {
      type: Object,
      default:()=>{
        return {}
      }
    },
    isAuto: { // 是否 不显示按钮
      type: Boolean,
      default: false
    },
    fileType: {
      type: Array,
      default: ()=>{
        return []
      }
    }
  },
  data() {
    return {
      fileList: []
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log('handlePreview', file);
    },
    UploadImage(param) {
      console.log('上传', param)
      const fd = new FormData()
      fd.append('file', param.file)
      if(JSON.stringify(this.data)!="{}"){
        for(let key in this.data){
          if(this.data[key]!=='' && this.data[key]!==undefined){
            fd.append(key, this.data[key])
          }
        }
      }
      // console.log(fd)
      uploadFile(this.actUrl, fd).then((res)=>{
        if(res.code===200){
          this.$refs['upload'].clearFiles()
          this.$emit('uploadSuccess')
          if(this.isAuto){

          }else{
            this.$baseMessage('上传成功', 'success')
          }
        }else{
          this.$baseMessage(res.message, 'error')
        }
      })
    },
    submitBtn() {
      console.log('aaaaa')
      console.log(this.fileList)
      if(!this.fileList || this.fileList.length==0){
        this.$baseMessage('请先上传附件', 'error')
        return
      }
      this.$refs.upload.submit();
    },
    beforeAvatarUpload(file) {
      console.log(file, file.type)
    },
    changeFile(file, fileList){
      if(this.fileType && this.fileType.length>0){
        if(file && file.name){
          let str = file.name.split('.')
          str = str[str.length-1]
          console.log(this.fileType.includes(str))
          if(this.fileType.includes(str)){
            this.fileList.push(file)
          }else{
            this.fileList = []
          }
        }
      }
      // console.log(file, fileList)
      // console.log(file, file.raw.type)
    }
  }
}
</script>

<style scoped>
.upload-demo {

}
</style>
