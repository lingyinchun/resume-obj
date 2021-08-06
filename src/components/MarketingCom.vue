<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-divider content-position="left">适用商品{{opt}}</el-divider>
        <el-form :model="dataForm" ref="dataForm" :rules="rules" :disabled="opt==2" :inline="true">
          <el-col :span="15">
            <el-form-item prop="couponScope" label="领取人限制">
              <el-radio-group v-model="dataForm.couponScope" @change="changeScope">
                <el-radio :label="0">所有商品可使用</el-radio>
                <el-radio :label="1">指定商品可使用</el-radio>
                <el-radio :label="2">指定品类可使用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="9" style="text-align: right;" v-if="dataForm.couponScope==1">
            <el-form-item label="">
              <el-button type="text" @click="open=true">选择商品</el-button>
              <el-button type="text" @click="deleteFn">批量删除</el-button>
              <el-button type="text" @click="uploadDialog=true">导入编码</el-button>
              <el-button type="text" @click="downTemp">下载模版</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="9" style="text-align: right;" v-if="dataForm.couponScope==2">
            <el-form-item label="">
              <el-button type="text" @click="open2=true">选择品类</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-col>
      <el-col v-if="dataForm.couponScope==1">
        <el-table
            ref="multipleTable"
            :data="checkData"
            border
            size="small"
            row-key="skuCode"
            @selection-change="handleSelectionChange"
        >
          <el-table-column
              type="selection"
              width="55"
              :reserve-selection='true'
              fixed="left"
          >
          </el-table-column>
          <el-table-column v-for="col in column" :label="col.label" :prop="col.prop" :key="col.label"
                           :width="col.width || undefined" :fixed="col.fixed"></el-table-column>
          <el-table-column label="操作" width="100" v-if="opt!=2">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="deleteFn(scope.row.id, 1)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
            v-show="total > 0"
            background
            :current-page="search.pageNo"
            :page-size="search.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        ></el-pagination>
      </el-col>
      <el-col v-if="dataForm.couponScope==2">
        <el-table
            ref="multipleTable"
            :data="checkData"
            border
            size="small"
            row-key="skuCode"
            @selection-change="handleSelectionChange"
        >
          <el-table-column v-for="col in column2" :label="col.label" :prop="col.prop" :key="col.label"
                           :width="col.width || undefined" :fixed="col.fixed"></el-table-column>
<!--          <el-table-column label="操作" width="100" v-if="opt!=2">-->
<!--            <template slot-scope="scope">-->
<!--              <el-button size="mini" type="text" @click="deleteFn(scope.row.id, 1)">删除</el-button>-->
<!--            </template>-->
<!--          </el-table-column>-->
        </el-table>

        <el-pagination
            v-show="total > 0"
            background
            :current-page="search.pageNo"
            :page-size="search.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        ></el-pagination>
      </el-col>
      <el-col :span="24" v-if="opt!=2">
        <div style="margin-top:15px;text-align: center;">
          <el-button @click="back">上一步</el-button>
          <el-button type="primary" @click="saveCoupon" :disabled="submitDisabled">提交</el-button>
        </div>
      </el-col>
    </el-row>

    <el-dialog v-if="open" title="选择商品" :visible.sync="open" width="1000px" append-to-body :close-on-click-modal="false"
               :close-on-press-escape="false">
      <GoodsList :marketingId="marketingId" :marketingType="marketingType" @initTable="initTable"/>
    </el-dialog>

    <el-dialog title="选择品类" :visible.sync="open2" width="800px" append-to-body :close-on-click-modal="false"
               :close-on-press-escape="false">
      <CategoryList :marketingId="marketingId" :marketingType="marketingType" @initTable="initTable"/>
    </el-dialog>

    <el-dialog v-if="uploadDialog" title="上传文件" :visible.sync="uploadDialog" width="400px" append-to-body :close-on-click-modal="false"
               :close-on-press-escape="false">
      <UploadFileFormData :data="uploadData" :actUrl="uploadUrl" @uploadSuccess="uploadSuccess"/>
    </el-dialog>

  </div>
</template>

<script>
import GoodsList from "@/components/GoodsList";
import UploadFileFormData from "@/components/UploadFileFormData";
import CategoryList from "@/components/CategoryList";
import {query, deleteMark, changeScopeApi, saveMarketing, downTemp} from '@/api/goods/marketing'

export default {
  name: "MarketingCom",
  components: {GoodsList,UploadFileFormData,CategoryList},
  props: ['marketingId', 'marketingType', 'coupon'],
  data() {
    return {
      opt: this.$route.query.opt,
      open: false,
      open2: false,
      uploadDialog: false,
      uploadData: {},
      uploadUrl: '/mall-api/mmc-m/m/marketingScope/upload',
      multipleSelection: [],
      checkData: [],
      column: [
        {label: '商品编码', prop: 'skuCode', width: 120, fixed: 'left'},
        {label: '商品名称', prop: 'goodsCategoryName'},
        // {label: '计量单位', prop: 'unit', width: 100},
        {label: '原价（元）', prop: 'price', width: 100},
        // {label: '商品品牌', prop: 'couponName'},
        // {label: '商品类目', prop: 'categoryName', width: 140},
      ],
      column2:[
        {label: '品类名称', prop: 'goodsCategoryName'},
      ],
      total: 0,
      search: {
        pageNo: 1,
        pageSize: 10,
        marketingId: this.marketingId,
        marketingType: this.marketingType,
        nameOrSkuCode: '',
      },
      dataForm: {
        couponScope: ''
      },
      couponScope: undefined,
      rules: {
        couponScope: [
          {required: true, message: '请选择', trigger: 'blur'}
        ]
      }
    }
  },
  watch: {
    coupon: {
      deep: true,
      handler(newval){
        console.log(newval, this.marketingType)
        this.couponScope = this.marketingType ==1 ? this.coupon.couponScope : this.coupon.promotionScope // 记录上一个值
        this.dataForm.couponScope = this.marketingType ==1 ? this.coupon.couponScope : this.coupon.promotionScope
      }
    },
    marketingId(newval) {
      this.uploadData = {
        marketingId: this.marketingId,
        marketingType: this.marketingType
      }
      this.couponScope = this.marketingType ==1 ? this.coupon.couponScope : this.coupon.promotionScope // 记录上一个值
      this.dataForm.couponScope = this.marketingType ==1 ? this.coupon.couponScope : this.coupon.promotionScope
      this.initTable()
    }
  },
  computed: {
    submitDisabled(){
      if(this.dataForm.couponScope===0){
        return false
      }
      if(this.checkData && this.checkData.length>0){
        return false
      }
      return true
    }
  },
  created() {
    console.log(this.coupon)
    this.uploadData = {
      marketingId: this.marketingId,
      marketingType: this.marketingType
    }
    this.couponScope = this.marketingType ==1 ? this.coupon.couponScope : this.coupon.promotionScope // 记录上一个值
    this.dataForm.couponScope = this.marketingType ==1 ? this.coupon.couponScope : this.coupon.promotionScope
    this.initTable()
  },
  methods: {
    back() {
      this.$emit('back', 1)
    },
    initTable() {
      query(this.search).then((res) => {
        if (res.code === 200) {
          this.checkData = res.data.records || []
          this.total = res.data.totalRecords
        }
        this.open = false
        this.open2 = false
      })
    },
    handleSizeChange(val) {
      this.search.pageSize = val
      this.initTable()
    },
    handleCurrentChange(val) {
      this.search.pageNo = val
      this.initTable()
    },
    searchFn() {
      this.search.pageSize = 10
      this.search.pageNo = 1
      this.initTable()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleteFn(id, flag) {
      let ids = []
      if (flag == 1) {
        ids.push(id)
      } else {
        if (this.multipleSelection.length === 0) {
          return
        }
        ids = this.multipleSelection.map((v) => {
          return v.id
        })
      }
      deleteMark(ids).then((res) => {
        if (res.code === 200) {
          this.multipleSelection = []
          this.$baseMessage('操作成功', 'success')
          this.initTable()
        }
      })
    },
    changeScope(val) {
      const t = this;
      let changeScopeFn = () => {
        let params = {marketingId: this.marketingId, marketingType: this.marketingType, marketingScope: val}
        changeScopeApi(params).then((res) => {
          if (res.code === 200) {
            t.initTable()
            t.dataForm.couponScope = val
            t.couponScope = val
          }else{
            t.dataForm.couponScope = t.couponScope
          }
        })
      }
      console.log('changeScope', val)
      this.$confirm('切换类型会清除上次保存的数据，是否切换？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(function () {
        console.log('确定', val)
        changeScopeFn()
        // return deleteUser(row.id)
      })
      .catch(function () {
        t.dataForm.couponScope = t.couponScope
      })
    },
    saveCoupon() {
      this.$refs['dataForm'].validate((valid) => {
        if(!valid){
          return
        }
        if(this.dataForm.couponScope == 1){
          if(!this.checkData || this.checkData.length === 0){
            this.$baseMessage('请先添加商品', 'error')
            return
          }
        }
        let params = {marketingId: this.marketingId, marketingType: this.marketingType}
        saveMarketing(params).then((res)=>{
          if(res.code === 200){
            this.$baseMessage('提交成功', 'success')
            // this.$destroy('couponForm')
            this.$emit('close')
          }
        })
      })
    },
    downTemp() {
      downTemp('PRODUCT_TEMPLATE').then((res)=>{
        if(res.code===200){
          window.open(res.data[0].dictValue)
        }
      })
    },
    uploadSuccess() {
      this.uploadDialog = false
    }
  }
}
</script>

<style scoped>

</style>
