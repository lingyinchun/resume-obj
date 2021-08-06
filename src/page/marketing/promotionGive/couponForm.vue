<template>
  <div class="form-box" v-loading="loading">
    <el-row v-show="steps==1">
      <el-col :span="24">
        <el-form :model="dataForm" ref="dataForm" label-width="140px" :rules="rules" :disabled="opt==2" >
          <el-divider content-position="left">基本信息</el-divider>
          <el-form-item prop="promotionName" label="活动名称">
            <el-input v-model="dataForm.promotionName" style="width: 240px;"></el-input>
          </el-form-item>

          <el-form-item prop="promotionType" label="活动类型">
            <el-radio-group v-model="dataForm.promotionType">
              <el-radio :label="5">满额赠</el-radio>
              <el-radio :label="6">满量赠</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="活动时间" prop="time">
            <ElDatePickerCom v-model="dataForm.time" :disabledDate="true" :default-time="['00:00:00', '23:59:59']"/>
          </el-form-item>

          <el-form-item prop="promotionDesc" label="活动文案">
            <el-input
                type="textarea"
                placeholder="请输入"
                v-model="dataForm.promotionDesc"
                maxlength="50"
                show-word-limit
            >
            </el-input>
          </el-form-item>

          <el-divider content-position="left">活动规则</el-divider>
          <el-form-item prop="discountType" label="优惠设置">
            <el-radio-group v-model="dataForm.discountType">
              <el-radio :label="3">阶梯满赠</el-radio>
              <el-radio :label="4">
                循环满赠
                <el-form-item v-if="dataForm.discountType==4" prop="discountLimit" label="" style="display: inline-block;margin-left:15px;">
                  上限 <el-input-number v-model="dataForm.discountLimit" :controls="false" size="small" style="width: 80px;"></el-input-number> 次
                </el-form-item>
              </el-radio>
            </el-radio-group><br/>
            <span class="span_tip" style="margin-top:15px">阶梯：每级优惠不叠加。如：满足二级优惠条件后则不再享有一级优惠。最多支持五级优惠&nbsp;&nbsp;&nbsp;循环：每满一级优惠使用一次</span>
          </el-form-item>

          <el-form-item label="" v-if="dataForm.discountType">
            <el-table ref="multipleTable"
                      :data="dataForm.discountType == 3 ? discountSettingDTOS3 : discountSettingDTOS4"
                      row-key="index"
                      border
                      size="small">
              <el-table-column
                  width="30"
                  type="index">
              </el-table-column>
              <el-table-column
                  label="使用门槛"
                  width="180">
                <template slot-scope="{row}">
                    满 <el-input-number v-model="row.discountThreshold" size="small" :controls="false" style="width: 80px;" /> {{promotionTypeStr2}}
                </template>
              </el-table-column>
              <el-table-column
                  label="优惠内容"
                  width="180">
                <template slot-scope="{row}">
                  赠 <el-input-number v-model="row.discountContent" size="small" :controls="false" style="width: 80px;" /> 件
                </template>
              </el-table-column>
              <el-table-column
                  label="赠送商品">
                <template slot-scope="{row}">
                  <span v-if="row.goodsName">{{row.goodsName}}</span>
                </template>
              </el-table-column>
              <el-table-column
                  label="市场价(元)"
                  width="100">
                <template slot-scope="{row}">
                  <span v-if="row.price">{{row.price}}</span>
                </template>
              </el-table-column>
              <el-table-column
                  label="操作"
                  width="180">
                <template v-if="dataForm.discountType==3" slot="header" slot-scope="scope">
                  <el-button type="text" @click="addDiscount">新增</el-button>
                </template>
                <template slot-scope="scope">
                  <el-button size="small" @click="selectOpen(scope.row)">选择商品</el-button>
                  <el-button v-if="scope.$index!=0" size="small" @click="deleteDis(scope.row, dataForm.discountType)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>

          <el-form-item label="优惠叠加">
            <el-switch :value="true"></el-switch>
            <span class="span_tip" style="margin-left:15px;">勾选后需在优惠券中同时设置参与促销活动叠加才可生效</span>
          </el-form-item>

          <el-form-item prop="takeLimitFlag" label="参与次数">
            <el-radio-group v-model="dataForm.takeLimitFlag">
              <el-radio label="1">不限次数</el-radio>
              <el-radio label="2">
                限
                <el-form-item v-if="dataForm.takeLimitFlag==2" prop="takeLimit" label="" style="display: inline-block">
                  <el-input-number v-model="dataForm.takeLimit" :controls="false" style="width: 100px;" />
                </el-form-item>
                次
              </el-radio>
            </el-radio-group>
            <br/>
            <span v-if="dataForm.takeLimitFlag==2" class="span_tip">超出优惠次数的订单将按原价购买</span>
          </el-form-item>

          <el-form-item v-if="opt!=2">
            <el-button type="primary" @click="submitForm('dataForm')">下一步</el-button>
            <el-button v-if="opt!=3" @click="resetForm('dataForm')">重置</el-button>
          </el-form-item>
        </el-form>
        <el-button v-if="opt==2" @click="steps=2" style="margin-left:150px;">下一步</el-button>
      </el-col>
    </el-row>

    <el-row v-show="steps==2">
      <el-col :span="24" v-if="dataForm.id">
        <MarketingCom key="2" @back="goSteps" :marketingId="dataForm.id" :coupon="dataForm" marketingType="2" @close="closeNode"/>
      </el-col>
      <el-button v-if="opt==2" @click="closeNode" style="margin-left:150px;">回到列表</el-button>
    </el-row>

    <el-dialog title="选择商品" :visible.sync="openDialog" width="1000px" append-to-body :close-on-click-modal="false"
               :close-on-press-escape="false">
      <SelectGoodsList :checkMore="false" @selectItem="selectItem" @close="openDialog=false"/>
    </el-dialog>

  </div>
</template>

<script>
import MarketingCom from "@/components/MarketingCom";
import ElDatePickerCom from '@/components/ElDatePickerCom'
import SelectGoodsList from "@/components/SelectGoodsList";
import {getPickerOptions} from "@/utils";
import {deepClone} from "@/utils/util";
import {
  getList
} from '@/api/vip/grade'
import { add, getById, update } from '@/api/marketing/promotion'
import closeDeactivatedVNode from '@/mixins/closeDeactivatedVNode'

const dataObj = {
  id: null,
  promotionName: '',
  promotionType: undefined,
  time: [],
  discountType: '',
  takeLimit: undefined,
  takeLimitFlag: '', // 用户限制 0.全部 1.指定
  couponScope: 0, // 0.全部 1.指定商品 2.指定类目
}

const discountSetting = { index:0,discountContent:undefined,discountLimit:undefined,discountThreshold:undefined,discountType:undefined,skuCode:undefined,sortNum:undefined }

export default {
  name: "promotionGive",
  components:{ MarketingCom, ElDatePickerCom, SelectGoodsList },
  mixins: [closeDeactivatedVNode],
  data() {
    return {
      disIndex3: 0,
      disIndex4: 0,
      steps: 1,
      loading: false, //
      openDialog: false,
      istrue: true,
      discountSettingDTOS3: [deepClone(discountSetting)],
      discountSettingDTOS4: [deepClone(discountSetting)],
      row: null,
      opt: this.$route.query.opt,
      dataForm: deepClone(dataObj),
      gradeList: [],
      pickerOptions: getPickerOptions(),
      rules: {
        promotionName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        promotionType: [
          { required: true, message: '请选择活动类型', trigger: 'change' }
        ],
        time: [
          { type: 'array', required: true, message: '请选择时间', trigger: 'change' }
        ],
        discountType: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        discountLimit: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        takeLimit: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        takeLimitFlag: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
      }
    }
  },
  watch:{
    $route(val){
      if((this.$route.path.indexOf('promotionGive/couponForm')>0 && ((this.$route.query.id!=this.dataForm.id) || this.opt != this.$route.query.opt))){
        console.log('promotionGive/couponForm刷新')
        this.init()
        this.opt = this.$route.query.opt
      }
    }
  },
  computed: {
    promotionTypeStr2() {
      let str1 = '元'
      if(this.dataForm.promotionType == 5){
        str1 = '元'
      }else{
        str1 = '件'
      }
      return str1
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
      }
    })
  },
  methods:{
    resetData(){
      this.dataForm = deepClone(dataObj)
    },
    init(){
      this.steps = 1
      this.discountSettingDTOS3 = [deepClone(discountSetting)]
      this.discountSettingDTOS4 = [deepClone(discountSetting)]
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
          this.dataForm.takeLimitFlag = !res.data.takeLimit ? '1' : '2'
          let discountSettingDTOSList = res.data.discountSettingDTOS
          this.dataForm.discountType = discountSettingDTOSList[0].discountType
          this[`discountSettingDTOS${this.dataForm.discountType}`] = discountSettingDTOSList
          this.dataForm.discountLimit = discountSettingDTOSList[0].discountLimit
          this[`disIndex${this.dataForm.discountType}`] = this[`discountSettingDTOS${this.dataForm.discountType}`].length
        }
      })
    },
    submitForm(form){
      console.log(this.dataForm)
      console.log(this.discountSettingDTOS3, this.discountSettingDTOS4)
      this.$refs[form].validate((valid) => {
        if(!valid){
          return
        }
        this.istrue = true
        this[`discountSettingDTOS${this.dataForm.discountType}`].forEach((v)=>{
          v.discountType = this.dataForm.discountType
          v.discountLimit = this.dataForm.discountLimit
          if(!v.discountThreshold || !v.discountContent || !v.goodsName){
            this.istrue = false
          }
        })

        if(!this.istrue){
          this.$baseMessage('优惠设置数据不完整', 'error')
          return
        }

        // this[`discountSettingDTOS${this.dataForm.discountType}`].reduce((pre,cur,index,arr)=>{
        //   if(pre===0){return cur}
        //   if(pre===-1){return -1}
        //   if(cur<pre){
        //     return -1
        //   }else{
        //     return cur
        //   }
        // },0)

        const params = Object.assign({},this.dataForm)
        params.startTime = params.time[0]
        params.endTime = params.time[1]
        params.discountSettingDTOS = this[`discountSettingDTOS${this.dataForm.discountType}`]
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
      this.$router.push('/marketing/promotionGive/couponList')
      this.$store.dispatch('permission/closeTagsByPath', 'marketing/promotionGive/couponForm')
    },
    selectOpen(row) {
      this.row = row
      this.openDialog = true
    },
    selectItem(list) {
      if(!this.dataForm.discountType){
        return
      }
      // console.log(this[`discountSettingDTOS${this.dataForm.discountType}`])
      const item = list[0]
      this[`discountSettingDTOS${this.dataForm.discountType}`].forEach((v,index)=>{
        if(v.index === this.row.index){
          // v.item = item
          v.goodsName = item.goodsName
          v.skuCode = item.skuCode
          v.price = item.channel.channelMarketPrice
          this.$set(this[`discountSettingDTOS${this.dataForm.discountType}`],index,v)
        }
      })
    },
    addDiscount() {
      if(!this.dataForm.discountType){
        return
      }
      this[`disIndex${this.dataForm.discountType}`]++
      const dis = deepClone(discountSetting)
      dis.index = this[`disIndex${this.dataForm.discountType}`]
      console.log(dis)
      this.discountSettingDTOS3.push(dis)
    },
    deleteDis(row, type) {
      const index = this[`discountSettingDTOS${type}`].findIndex((v)=>{return v.index==row.index})
      this[`discountSettingDTOS${type}`].splice(index, 1)
    }
  }
}
</script>

<style lang="scss">
.form-box{
  width: 100%;
  padding: 20px;
  background: #ffffff;
  box-sizing: border-box;
}
.coupon_div{
  width: 200px;
  height: 100px;
  border: 1px solid #2d8cf0;
}
</style>
