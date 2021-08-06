<template>
  <div class="form-box" v-loading="loading">
    <el-row>
      <el-col :span="10">
        <el-form :model="dataForm" ref="dataForm" label-width="100px" :rules="rules" :disabled="opt==2" >
          <el-divider content-position="left">任务</el-divider>
          <el-form-item label="任务名称" prop="taskName">
            <el-input v-model="dataForm.taskName" ></el-input>
          </el-form-item>
          <el-form-item label="邮件模版" prop="emailTemplateId">
            <el-select v-model="dataForm.emailTemplateId" placeholder="请选择" @change="changeEmail">
              <el-option
                  v-for="item in emailList"
                  :key="item.id"
                  :label="item.templateName"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="定时发送">
            <el-switch v-model="dataForm.isTimingSend"></el-switch>
          </el-form-item>
          <el-form-item v-if="dataForm.isTimingSend" label="发送时间" prop="sendTime">
            <el-date-picker
                v-model="dataForm.sendTime"
                type="datetime"
                placeholder="选择发送时间"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
          <el-form-item v-show="opt!=2" label="上传文件" required>
            <UploadFileFormData ref="uploadFormData" :is-auto="true" :actUrl="uploadUrl" :fileType="fileType" :data="dataForm" @uploadSuccess="callBackFn"/>
          </el-form-item>
          <el-form-item v-if="dataForm.emailTemplateId">
            <el-button type="primary" plain @click="downTemp">下载模版</el-button>
          </el-form-item>

          <el-form-item v-if="opt!=2">
            <el-button type="primary" @click="submitForm('dataForm')">保存</el-button>
            <el-button @click="closeNode">取消</el-button>
          </el-form-item>
        </el-form>
        <el-button v-if="opt==2" @click="closeNode" style="margin-left:100px;">返回</el-button>
      </el-col>
      <el-col :span="13" :offset="1" v-show="emailInfo && emailInfo.id">
        <el-divider content-position="left">模版内容</el-divider>
        <p>{{emailInfo.templateName}}</p>
        <br/>
        <HtmlContent :content="emailInfo.templateContent"/>
        <br/>
        <div></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Api from "@/api/setting/task"
import closeDeactivatedVNode from "@/mixins/closeDeactivatedVNode";
import EmailApi from "@/api/setting/emailTem"
import UploadFileFormData from "@/components/UploadFileFormData";
import HtmlContent from "@/components/HtmlContent";
export default {
  name: 'taskInfo',
  components: {UploadFileFormData,HtmlContent},
  mixins: [closeDeactivatedVNode],
  data() {
    return {
      str:'',
      uploadUrl: '/mall-api/operation-m/m/emailTask/add',
      fileType: ['xls','xlsx'],
      opt: this.$route.query.opt,
      loading: false,
      emailInfo: {},
      attributesList: [],
      emailList: [],
      dataForm: {
        id: '',
        taskName: '',
        emailTemplateId: '',
        isTimingSend: false,
        sendTime: ''
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()-(24*60*60*1000);
        }
      },
      rules: {
        taskName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        emailTemplateId: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        sendTime: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
      }
    }
  },
  watch:{
    $route(val){
      if((this.$route.path.indexOf('setting/taskModule/taskInfo')>0 && (this.$route.query.id!=this.dataForm.id || (this.opt != this.$route.query.opt)))){
        this.init()
        this.opt = this.$route.query.opt
      }
    }
  },
  created() {
    if(this.$route.query.id){
      this.init()
    }
    EmailApi.queryEmailTem({pageNo:1,pageSize:100}).then((res)=>{
      if(res.code===200){
        this.emailList = res.data && res.data.records
      }
    })
  },
  methods: {
    resetData() {
      this.dataForm = {
        id: undefined,
        emailTemplateId: '',
        taskName: '',
        isTimingSend: false,
        sendTime: ''
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
      Api.getTask(this.$route.query.id).then((res)=>{
        if(res.code === 200){
          this.dataForm = Object.assign(this.dataForm, res.data)
          this.changeEmail(this.dataForm.emailTemplateId)
        }
      })
    },
    submitForm(form){
      this.$refs[form].validate((valid) => {
        if(!valid){
          return
        }
        this.$refs.uploadFormData.submitBtn()
      })
    },
    callBackFn() {
      this.$baseMessage('保存成功', 'success')
      this.closeNode()
    },
    changeEmail(event) {
      console.log(event)
      EmailApi.getEmailTem(event).then((res)=>{
        if(res.code === 200){
          this.emailInfo = res.data
          this.attributesList = res.data.attributesList
        }
      })
    },
    downTemp() {
      Api.downTemp(this.dataForm.emailTemplateId).then((res)=>{
        if(res instanceof Blob){
          let url = window.URL.createObjectURL(new Blob([res]));
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download",`${this.emailInfo.templateName}-模版.xlsx`);
          document.body.appendChild(link);
          link.click()
        }
      })
    },
    closeNode(){
      this.$router.push('/setting/tempPage?activeName=2')
      this.$store.dispatch('permission/closeTagsByPath', 'setting/taskModule/taskInfo')
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
.html_disabled{
  padding: 5px 10px;
  border: 1px solid #eeeeee;
  background: #f5f7fa87;
  border-radius: 4px;
}
</style>
