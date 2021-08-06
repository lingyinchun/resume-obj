<template>
  <div class="form-box" v-loading="loading">
    <el-row v-show="steps==1">
      <el-col :span="15">
        <el-form :model="dataForm" ref="dataForm" label-width="140px" :rules="rules" :disabled="opt==2" >
          <el-divider content-position="left">基本信息</el-divider>
          <el-form-item prop="couponName" label="券名称">
            <el-input v-model="dataForm.couponName" style="width: 240px;"></el-input>
          </el-form-item>

          <el-form-item prop="couponType" label="券类型">
            <el-radio-group v-model="dataForm.couponType">
              <el-radio :label="2">满减券</el-radio>
              <el-radio :label="3">满折券</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item prop="orderFullAmountFlag" label="使用门槛">
            <el-select v-model="dataForm.orderFullAmountFlag" style="width: 100px;">
              <el-option label="无门槛" value="1"></el-option>
              <el-option label="订单满" value="2"></el-option>
            </el-select>
            <span v-if="dataForm.orderFullAmountFlag==2" style="margin-left: 8px;">
              <el-form-item prop="orderFullAmount" label="" style="display: inline-block">
                <el-input-number v-model="dataForm.orderFullAmount" :controls="false" style="width: 100px;" />
              </el-form-item> 元
            </span>
          </el-form-item>

          <el-form-item v-if="dataForm.couponType==2" prop="promotionAmount" label="优惠内容减">
            <el-input-number v-model="dataForm.promotionAmount" :controls="false" style="width: 100px;" /> 元
          </el-form-item>

          <el-form-item v-if="dataForm.couponType==3" prop="discountAmount" label="优惠内容打">
            <el-input-number v-model="dataForm.discountAmount" :controls="false" style="width: 100px;" /> 折
          </el-form-item>

          <el-form-item label="优惠券活动时间" prop="time">
            <ElDatePickerCom v-model="dataForm.time" :disabledDate="true" :default-time="['00:00:00', '23:59:59']"/>
          </el-form-item>

          <el-form-item prop="useCouponTimeType" label="用券时间">
            <el-radio-group v-model="dataForm.useCouponTimeType">
              <el-radio :label="1">
                领取当日起
                <el-form-item v-if="dataForm.useCouponTimeType==1" prop="useDays" label="" style="display: inline-block">
                   <el-input-number size="mini" v-model="dataForm.useDays" :controls="false" style="width: 60px;" /> 天内可用
                </el-form-item>
              </el-radio>
<!--              <div style="height:10px;width:100%;"></div>-->

              <el-radio :label="2">
                固定时间
                <el-form-item v-if="dataForm.useCouponTimeType==2" prop="time2" label="" style="display: inline-block">
                  <ElDatePickerCom v-model="dataForm.time2" :disabledDate="true" :default-time="['00:00:00', '23:59:59']"/>
                </el-form-item>
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item prop="inventory" label="发行张数">
            <el-input-number v-model="dataForm.inventory" :controls="false" style="width: 100px;" /> 张
          </el-form-item>

          <el-form-item prop="couponDesc" label="券说明">
            <el-input
                type="textarea"
                placeholder="请输入"
                v-model="dataForm.couponDesc"
                maxlength="50"
                show-word-limit
            >
            </el-input>
          </el-form-item>

          <el-divider content-position="left">用券规则</el-divider>
          <el-form-item prop="personLimitFlag" label="领取条件">
            <el-radio-group v-model="dataForm.personLimitFlag">
              <el-radio label="1">领取不限次数</el-radio>
              <el-radio label="2">
                每个id可领
                <el-form-item v-if="dataForm.personLimitFlag==2" prop="personLimit" label="" style="display: inline-block">
                  <el-input-number v-model="dataForm.personLimit" :controls="false" style="width: 100px;" /> 次
                </el-form-item>
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="userLimit" label="领取人限制">
            <el-radio-group v-model="dataForm.userLimit">
              <el-radio :label="0">全部用户</el-radio>
              <el-radio :label="1">指定用户</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="dataForm.userLimit == 1 && gradeList && gradeList.length>0" label="" prop="marketingUserDTOS">
            <el-checkbox-group v-model="dataForm.marketingUserDTOS">
              <el-checkbox v-for="grade in gradeList" :label="grade.levelCode" :key="grade.id">{{grade.levelName}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="优惠叠加">
            <el-checkbox :value="true" disabled>可与满减/折活动同时使用</el-checkbox>
            <el-checkbox :value="true" disabled>可与满赠活动同时使用</el-checkbox><br/>
            <span class="span_tip">如果未勾选则参与满减等促销商品不可使用优惠券；勾选后需在对应类型对促销配置中同时设置与优惠券叠加才可生效</span>
          </el-form-item>
<!--          <el-divider content-position="left">适用商品</el-divider>-->
<!--          <MarketingCom/>-->
<!--          <GoodsList/>-->
          <el-form-item v-if="opt!=2">
            <el-button type="primary" @click="submitForm('dataForm')">下一步</el-button>
            <el-button @click="resetForm('dataForm')">重置</el-button>
          </el-form-item>
        </el-form>
        <el-button v-if="opt==2" @click="steps=2" style="margin-left:150px;">下一步</el-button>
      </el-col>
      <el-col :span="8" :offset="1">
        <div class="coupon_div_show">
          <div class="c_title">
            <div class="c_title2">
              <div class="c_title_left">
                <span v-show="dataForm.couponType==2" class="price">¥{{dataForm.promotionAmount}}</span>
                <span v-show="dataForm.couponType==3" class="price">{{dataForm.discountAmount}}折</span>
                <br/>
                <span v-show="dataForm.orderFullAmountFlag!=2">无门槛</span>
                <span v-show="dataForm.orderFullAmountFlag==2">订单满{{dataForm.orderFullAmount}}元</span>
              </div>
              <div class="c_title_right">
                <span class="overhidden_sp1">{{dataForm.couponName}}</span><br/>
                <span class="huise">(全部可用)</span>
              </div>
            </div>
            <div class="c_date huise" v-show="dataForm.useCouponTimeType==1">领取当日起{{dataForm.useDays}}天内可用</div>
            <div class="c_date huise" v-show="dataForm.useCouponTimeType==2">有效时间：{{dataForm.time2 && dataForm.time2[1]}}</div>
          </div>
          <div class="c_btn">立即领取</div>
        </div>
        <div class="coupon_div2">
          使用说明：{{dataForm.couponDesc}}
        </div>
      </el-col>
    </el-row>

    <el-row v-show="steps==2">
      <el-col :span="24" v-if="dataForm.id">
        <MarketingCom key="1" @back="goSteps" :marketingId="dataForm.id" :coupon="dataForm" marketingType="1" @close="closeNode"/>
      </el-col>
      <el-button v-if="opt==2" @click="closeNode" style="margin-left:150px;">回到列表</el-button>
    </el-row>

  </div>
</template>

<script>
import MarketingCom from "@/components/MarketingCom";
import ElDatePickerCom from '@/components/ElDatePickerCom'
import {
  getList
} from '@/api/vip/grade'
import { add, getById, update } from '@/api/marketing/coupon'
import closeDeactivatedVNode from '@/mixins/closeDeactivatedVNode'

export default {
  name: "couponForm",
  components:{ MarketingCom, ElDatePickerCom },
  mixins: [closeDeactivatedVNode],
  data() {
    return {
      steps: 1,
      loading: false, //
      opt: this.$route.query.opt,
      dataForm: {
        couponName: '',
        couponType: undefined,
        orderFullAmountFlag: '',
        orderFullAmount: undefined, // 门槛金额
        promotionAmount: undefined, // 减金额
        discountAmount: undefined, // 打折
        time: [],
        useCouponTimeType: undefined, // 用券时间 1.领券后几天可用2.固定时间可用
        useDays: undefined,
        time2: [],
        inventory: undefined, // 库存，发行张数
        personLimitFlag: '',
        personLimit: undefined,
        userLimit:[], // 用户限制 0.全部 1.指定
        marketingUserDTOS: [],
        couponDesc: ''
        // couponScope: 0, // 0.全部 1.指定商品 2.指定类目
      },
      gradeList: [],
      rules: {
        couponName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        couponType: [
          { required: true, message: '请选择券类型', trigger: 'change' }
        ],
        orderFullAmountFlag: [
          { required: true, message: '请设定使用门槛', trigger: 'change' }
        ],
        orderFullAmount: [
          { required: true, message: '请输入金额', trigger: 'blur' }
        ],
        promotionAmount: [
          { required: true, message: '请输入金额', trigger: 'blur' }
        ],
        discountAmount: [
          { required: true, message: '请输入金额', trigger: 'blur' }
        ],
        time: [
          { type: 'array', required: true, message: '请选择时间', trigger: 'change' }
        ],
        useCouponTimeType: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        useDays: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        time2: [
          { type: 'array', required: true, message: '请选择时间', trigger: 'change' }
        ],
        inventory: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        personLimitFlag: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        personLimit: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        userLimit: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        marketingUserDTOS:[
          { type: 'array', required: true, message: '请至少选择一项', trigger: 'change' }
        ]
      }
    }
  },
  watch:{
    $route(val){
      if((this.$route.path.indexOf('coupon/couponForm')>0 && (this.$route.query.id!=this.dataForm.id || (this.opt != this.$route.query.opt)))){
        console.log('coupon/couponForm刷新')
        this.init()
        this.opt = this.$route.query.opt
      }
    }
  },
  created(){
    console.log(this.$route.query)
    if(this.$route.query.id){
      this.init()
    }
    getList({}).then((response) => {
      if(response.code == 200){
        this.gradeList = response.data.records || []
      } else {
        this.gradeList = []
      }
    })
  },
  methods:{
    resetData(){
      this.dataForm = {
        id: null,
        couponName: '',
        couponType: undefined,
        orderFullAmountFlag: '',
        orderFullAmount: undefined, // 门槛金额
        promotionAmount: undefined, // 减金额
        discountAmount: undefined, // 打折
        time: [],
        useCouponTimeType: undefined, // 用券时间 1.领券后几天可用2.固定时间可用
        useDays: undefined,
        time2: null,
        inventory: undefined, // 库存，发行张数
        personLimitFlag: '',
        personLimit: undefined,
        userLimit:[], // 用户限制 0.全部 1.指定
        marketingUserDTOS: [],
        couponScope: 0, // 0.全部 1.指定商品 2.指定类目
      }
    },
    init(){
      this.steps = 1
      if(!this.$route.query.id){
        this.resetData()
        this.$nextTick(()=>{
          this.$refs['dataForm'].clearValidate()
        })
        return
      }
      this.loading = true
      getById(this.$route.query.id).then((res)=>{
        this.loading = false
        if(res.code === 200){
          this.dataForm = Object.assign(this.dataForm, res.data)
          this.dataForm.time = [res.data.startTime,res.data.endTime]
          this.dataForm.personLimitFlag = !res.data.personLimit ? '1' : '2'
          if(!res.data.orderFullAmount){
            this.dataForm.orderFullAmountFlag = '1'
          }else{
            this.dataForm.orderFullAmountFlag = '2'
          }
          if(res.data.userLimit == 1){
            const marketingUserDTOS = []
            res.data.marketingUserVOS.forEach((v)=>{
              marketingUserDTOS.push(v.levelCode)
            })
            this.dataForm.marketingUserDTOS = marketingUserDTOS
          }
          if(res.data.useCouponTimeType==2){
            this.dataForm.time2 = [res.data.useStartTime,res.data.useEndTime]
          }
        }
      })
    },
    submitForm(form){
      console.log(this.dataForm)

      // console.log(this.marketingUserDTOS)
      this.$refs[form].validate((valid) => {
        console.log(valid)
        if(!valid){
          return
        }
        const params = Object.assign({},this.dataForm)
        params.startTime = params.time[0]
        params.endTime = params.time[1]

        // 满减-有门槛时
        if(params.couponType == 2 && params.orderFullAmountFlag == 2){
          if(params.orderFullAmount <= params.promotionAmount){
            this.$baseMessage('满减门槛不能小于减金额', 'error')
            return
          }
        }
        if(params.useCouponTimeType==2){
          params.useStartTime = params.time2[0]
          params.useEndTime = params.time2[1]
        }
        // 领取次数
        params.personLimit = params.personLimitFlag == 1 ? 0 : params.personLimit

        const marketingUserDTOS = []
        this.dataForm.marketingUserDTOS.forEach((v)=>{
          marketingUserDTOS.push({levelCode: v})
        })
        params.marketingUserDTOS = marketingUserDTOS
        // params.couponScope = 0
        if(this.dataForm.id){
          update(params).then((res)=>{
            if(res.code === 200){
              this.$baseMessage('更新成功', 'success')
              this.goSteps(2)
            }
          })
        }else{
          add(params).then((res)=>{
            if(res.code === 200){
              this.$baseMessage('创建成功', 'success')
              // this.resetData()
              if(res.data){
                this.dataForm.id = res.data
                this.goSteps(2)
              }
            }
          })
        }
      })
    },
    resetForm(){
      this.$refs['dataForm'].resetFields();
    },
    goSteps(flag){
      console.log('goSteps', flag)
      this.steps = flag
    },
    closeNode(){
      this.$router.push('/marketing/coupon/couponList')
      this.$store.dispatch('permission/closeTagsByPath', 'marketing/coupon/couponForm')
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
.coupon_div_show{
  width: 310px;
  height: 100px;
  //border: 1px solid #2d8cf0;
  box-sizing: border-box;
  display: block;
  overflow: hidden;
  .c_title{
    width: 230px;
    height: 100%;
    box-sizing: border-box;
    float: left;
    border: 1px solid #ddd;
    border-right: 0;
    .c_title2{
      width: 100%;
      height: 70px;
      display: flex;
      text-align: center;
      font-size: 13px;
      line-height: 22px;
      .c_title_left{
        width: 100px;
        padding-top: 18px;
        .price{
          color: Red;
          font-size: 18px;
        }
      }
      .c_title_right{
        width: 128px;
        padding-top: 18px;
        line-height: 20px;
      }
    }
    .c_date{
      width: 100%;
      height: 30px;
      font-size: 12px;
      color: #bbbbbb;
      padding-left: 10px;
      line-height: 28px;
    }
  }
  .c_btn{
    width: 80px;
    height: 100%;
    box-sizing: border-box;
    float: left;
    line-height: 95px;
    background: #ee1918;
    color: #ffffff;
    text-align: center;
    font-size: 14px;
  }
}
.coupon_div2{
  width: 310px;
  //height: 100px;
  //border: 1px solid #2d8cf0;
  box-sizing: border-box;
  display: block;
  padding: 5px 10px 8px 10px;
  font-size: 12px;
  border: 1px solid #ddd;
  border-top: 0;
  color: #9d9d9d;
}
</style>
