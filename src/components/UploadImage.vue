<template>
  <div>
    <el-upload
        class="upload-demo"
        ref="upload"
        :action="actUrl"
        :limit="limit"
        :file-list="fileList"
        list-type="picture-card"
        :http-request="UploadImage"
        :before-upload="beforeAvatarUpload"
        :on-success="uploadSuccess"
    >
      <el-button size="small">选取图片</el-button>
      <div slot="file" slot-scope="{file}">
        <img class="el-upload-list__item-thumbnail"  :src="file.url" alt="">
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-delete" @click="handleRemove(file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
  </div>
</template>

<script>
import {uploadFile} from '@/api/index'

export default {
  name: "uploadFileFormData",
  props: {
    value: {
      type: [Array,Object],
      default: () => {
        return []
      }
    },
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
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      fileList: []
    }
  },
  watch: {
    value(val) {
      this.fileList = val
    },
    fileList(val) {
      this.$emit('input', val)
      this.$emit('change', val)
    }
  },
  mounted() {
    this.fileList = this.value
  },
  methods: {
    UploadImage(param) {
      const fd = new FormData()
      fd.append('file', param.file)
      uploadFile(this.actUrl, fd).then((res) => {
        if (res.code === 200) {
          console.log(this.$refs['upload'])
          // this.$refs['upload'].clearFiles()
          this.fileList.push({name: param.name, url: res.data})
          // this.$emit('uploadSuccess')
          this.$baseMessage('上传成功', 'success')
        } else {
          this.$baseMessage(res.message, 'error')
        }
      })
    },
    beforeAvatarUpload(file) {
      console.log(file, file.type)
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isLt2M
    },
    uploadSuccess(file, fileList) {
      // console.log('上传成功', file, fileList)
      // this.fileList = fileList
    },
    handleRemove(file) {
      const index = this.fileList.findIndex((v)=>{return v.uid==file.uid})
      this.fileList.splice(index, 1)
      console.log(this.fileList);
    },
  }
}
</script>

<style scoped>
.upload-demo {

}
/deep/.el-upload-list__item.is-ready {
  display: none;
}
</style>
