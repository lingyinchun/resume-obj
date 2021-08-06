<template>
  <div class="form-box" v-loading="loading">
    <el-row>
      <el-col>
        <el-form :model="dataForm" ref="dataForm" label-width="140px" :rules="rules" :disabled="opt==2" >
          <el-divider content-position="left">邮件模版</el-divider>
          <el-form-item label="模版名称" prop="templateName">
            <el-input v-model="dataForm.templateName" class="width360"></el-input>
          </el-form-item>
          <el-form-item label="邮件主题" prop="emailSubject">
            <el-input v-model="dataForm.emailSubject" class="width360"></el-input>
          </el-form-item>
          <el-form-item label="模版内容" prop="templateContent">
            <MyTinymce v-model="dataForm.templateContent" :disabled="opt==2" @getContent="getContent"/>
          </el-form-item>
          <el-form-item label="变量属性" prop="templateContent" v-show="attributesList && attributesList.length>0">
            <el-row v-for="(attr,index) in attributesList" :key="index">
              <el-col :span="4">
                {{attr.name}}
              </el-col>
              <el-col :span="10">
                <el-input v-model="attr.desc" size="small"/>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item v-if="opt!=2">
            <el-button type="primary" @click="submitForm('dataForm')">保存</el-button>
            <el-button @click="closeNode">取消</el-button>
          </el-form-item>
        </el-form>
<!--        <Tinymce v-model="str"/>-->
        <el-button v-if="opt==2" @click="closeNode" style="margin-left:140px;">返回</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import MyVueEditor from "@/components/MyVueEditor";
// import Tinymce from "@/components/Tinymce";
import {uniqueObject} from "@/utils/util"
import Api from "@/api/setting/emailTem"
import closeDeactivatedVNode from "@/mixins/closeDeactivatedVNode";
import MyTinymce from "@/components/MyTinymce";
export default {
  name: 'emailTemplate',
  mixins: [closeDeactivatedVNode],
  components: {
    MyVueEditor,MyTinymce
  },
  data() {
    return {
      str:'',
      opt: this.$route.query.opt,
      loading: false,
      attributesList: [],
      dataForm: {
        id: '',
        templateContent: '',
        emailSubject: '',
        templateName: ''
      },
      rules: {
        templateName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        emailSubject: [
          { required: true, message: '请输入主题', trigger: 'blur' }
        ],
        templateContent: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
      }
    }
  },
  watch:{
    $route(val){
      this.attributesList = []
      if((this.$route.path.indexOf('setting/emailMessage/emailTemplate')>0 && (this.$route.query.id!=this.dataForm.id || (this.opt != this.$route.query.opt)))){
        this.dataForm.templateContent = ''
        this.init()
        this.opt = this.$route.query.opt
      }
    }
  },
  created() {
    if(this.$route.query.id){
      this.init()
    }
  },
  methods: {
    resetData() {
      this.dataForm = {
        id: undefined,
        templateContent: '',
        emailSubject: '',
        templateName: '',
        attributesList: []
      }
    },
    init() {
      if(!this.$route.query.id){
        this.resetData()
        this.$nextTick(()=>{
          this.$refs['dataForm'].clearValidate()
        })
        return
      }
      Api.getEmailTem(this.$route.query.id).then((res)=>{
        // console.log('===', res)
        if(res.code === 200){
          this.dataForm = Object.assign(this.dataForm, res.data)
          this.attributesList = res.data.attributesList
        }
      })
    },
    getContent(event) {
      // console.log('执行了', this.dataForm.templateContent)
      let list = []
      const reg = /(?<=\$\{)[a-zA-Z]+(?=\})/g;
      if(this.dataForm.templateContent){
        let matchList = this.dataForm.templateContent.match(reg)
        // console.log(this.dataForm.templateContent.match(reg))
        list = matchList && matchList.length>0 && matchList.map((v)=>{
          return {'name':v,desc:''}
        })
        list = list && list.length>0 && uniqueObject(list,'name') || []
      }
      if(this.attributesList.length>0 && list.length>0){
        for(let i=0;i<list.length;i++){
          let item = this.attributesList.filter((v2)=>{return v2.name === list[i].name})
          if(item.length>0){
            list[i] = item[0]
          }
        }
      }
      this.attributesList = list
    },
    submitForm(form){
      // console.log(this.dataForm, this.attributesList)
      this.$refs[form].validate((valid) => {
        // console.log(valid)
        if(!valid){
          return
        }
        let isTrue = true
        if(this.attributesList && this.attributesList.length > 0){
          isTrue = this.attributesList.every((v)=>{
            return !!v.desc
          })
        }
        if(!isTrue){
          this.$baseMessage('变量属性数据不完整', 'error')
          return
        }

        const param = Object.assign({},this.dataForm)
        param.attributesList = this.attributesList
        Api.addOrUpdate(param).then((res)=>{
          if (res.code === 200) {
            this.$baseMessage('保存成功', 'success')
            this.closeNode()
          }
        })
      })
    },
    closeNode(){
      this.$router.push('/setting/tempPage?activeName=1')
      this.$store.dispatch('permission/closeTagsByPath', 'setting/emailMessage/emailTemplate')
    }
  }
}
</script>
<style lang="scss" scoped>
.form-box{
  width: 100%;
  padding: 20px;
  background: #ffffff;
  box-sizing: border-box;
}
</style>
