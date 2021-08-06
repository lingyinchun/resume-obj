<template>
  <div class="form-box">
    <el-row>
      <el-divider content-position="left">基本信息</el-divider>
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" :disabled="opt==2"
               label-width="110px" style="width:600px">
        <el-form-item label="运费模板名称" prop="templateName">
          <el-input v-model="dataForm.templateName" maxLength="10" placeholder="运费模板名称" style="width: 240px;"></el-input>
        </el-form-item>
<!--        <el-form-item label="是否免邮" prop="freightFlag">-->
<!--          <el-radio-group v-model="dataForm.freightFlag">-->
<!--            <el-radio label="自定义运费"></el-radio>-->
<!--            <el-radio label="卖家承担运费"></el-radio>-->
<!--          </el-radio-group>-->
<!--        </el-form-item>-->
        <el-form-item label="计费方式" prop="chargeWay">
          <el-radio-group v-model="dataForm.chargeWay">
            <el-radio :label="1">按金额</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="配送方式" prop="distribution">
          <el-radio v-model="dataForm.freightTemplateItem.distribution" :label="1">快递物流</el-radio>
        </el-form-item>
        <el-form-item v-if="dataForm.freightTemplateItem.distribution" label="">
          <el-table :data="dataForm.freightTemplateItem.ruleList">
            <el-table-column
              prop="all"
              label="范围">
              <template>
                全国
              </template>
            </el-table-column>
            <el-table-column
                prop="amount"
                label="未满金额(元)">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.amount" :controls="false" style="width: 90px;" />
              </template>
            </el-table-column>
            <el-table-column
                prop="freight"
                label="运费(元)">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.freight" :controls="false" style="width: 90px;" />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item v-if="opt!=2" label="">
          <el-button @click="closeNode">取消</el-button>
          <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        </el-form-item>
      </el-form>
      <el-button v-if="opt==2" @click="closeNode" style="margin-left:110px;">返回</el-button>
    </el-row>
  </div>
</template>

<script>
import Http from '@/api/setting/freight'
import closeDeactivatedVNode from "@/mixins/closeDeactivatedVNode";

export default {
  name: "freightForm",
  mixins: [closeDeactivatedVNode],
  data() {
    return {
      loading: false,
      opt: this.$route.query.opt,
      dataForm: {
        id: undefined,
        templateName: undefined,
        freightFlag: undefined,
        chargeWay: 1,
        freightTemplateItem: {
          distribution: 1,
          ruleList: [{all: true,amount: undefined,freight: undefined}]
        }
      },
      ruleList: [{all: true,amount: undefined,freight: undefined}],
      dataRule: {
        templateName: [
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
        freightFlag: [
          {required: true, message: '请选择', trigger: 'blur'}
        ],
        distribution: [
          {message: '请选择', trigger: 'blur'}
        ],
        amount: [
          {required: true, message: '请输入', trigger: 'blur'}
        ],
        freight: [
          {required: true, message: '请输入', trigger: 'blur'}
        ],
      },
    }
  },
  watch:{
    $route(val){
      if((this.$route.path.indexOf('setting/freightSet/freightForm')>0 && (this.$route.query.id!=this.dataForm.id || (this.opt != this.$route.query.opt)))){
        console.log('setting/freightSet/freightForm刷新')
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
        templateName: undefined,
        freightFlag: undefined,
        chargeWay: '1',
        freightTemplateItem: {
          distribution: 1,
          ruleList: [{all: true,amount: undefined,freight: undefined}]
        }
      }
    },
    init() {
      console.log('init')
      if(!this.$route.query.id){
        this.resetData()
        this.$nextTick(()=>{
          this.$refs['dataForm'].clearValidate()
        })
        return
      }
      Http.freightTemplateGet(this.$route.query.id).then((res)=>{
        console.log('===', res)
        if(res.code === 200){
          this.dataForm = Object.assign(this.dataForm, res.data)
          // this.dataForm.id = res.data.id
          // this.dataForm.templateName = res.data.templateName
          // this.ruleList = res.data.freightTemplateItem.ruleList
        }
      })
    },
    dataFormSubmit() {
      console.log(this.dataForm)
      this.$refs['dataForm'].validate((valid) => {
        if(!valid){
          return
        }
        const params = Object.assign({}, this.dataForm)
        // params.freightTemplateItem = {
        //   distribution: 1,
        //   ruleList: this.ruleList
        // }
        // params.distribution = 1
        // delete params.amount
        // delete params.freight
        // delete params.distribution

        if(this.dataForm.id){
          Http.freightTemplateUpdate(params).then((res)=>{
            if (res.code === 200) {
              this.$baseMessage('更新成功', 'success')
              this.closeNode()
            }
          })
        }else{
          Http.freightTemplateAdd(params).then((res)=>{
            if (res.code === 200) {
              this.$baseMessage('创建成功', 'success')
              this.closeNode()
            }
          })
        }
      })
    },
    closeNode(){
      this.$router.push('/setting/freightSet/list')
      this.$store.dispatch('permission/closeTagsByPath', 'setting/freightSet/freightForm')
    }
  }
}
</script>

<style lang="scss" scoped>
.form-box {
  width: 100%;
  padding: 20px;
  background: #ffffff;
  box-sizing: border-box;
}
</style>
