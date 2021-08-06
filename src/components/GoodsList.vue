<template>
  <div>
    <el-row>
      <div class="table-body">
        <div class="app-search">
          <el-form :inline="true" :model="search" class="demo-form-inline" ref="search" size="small">
            <el-form-item label="商品名称">
              <el-input v-model="search.goodsName" placeholder="商品名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="商品编码">
              <el-input v-model="search.skuCode" placeholder="商品编码" clearable></el-input>
            </el-form-item>
            <el-form-item label="商品类目">
              <el-input v-model="search.categoryName" placeholder="商品类目" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="searchFn">搜索</el-button>
              <el-button @click="resetSearch">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-col :span="24">
          <div style="text-align:right;height:40px;"><el-button type="primary" @click="addgoods" size="small">添加</el-button></div>
          <el-table
              ref="multipleTable"
              :data="data"
              border
              size="small"
              row-key="skuCode"
              height="480"
              @selection-change="handleSelectionChange"
          >
            <el-table-column
                type="selection"
                width="55"
                :reserve-selection='true'
                fixed="left"
                :selectable="selectEvent"
            >
            </el-table-column>
            <el-table-column label="商品编码" prop="skuCode" width="160">
              <template slot-scope="scope">
                <span>{{scope.row.skuCode}} <el-tag v-if="scope.row.checked" size="mini">已选择</el-tag></span>
              </template>
            </el-table-column>
            <el-table-column v-for="col in column" :label="col.label" :prop="col.prop" :key="col.label"
                             :width="col.width || undefined" :fixed="col.fixed"></el-table-column>
            <el-table-column label="商品类目" prop="categoryName" width="160"/>
            <el-table-column label="市场价" width="80">
              <template slot-scope="scope">
                {{scope.row.channel.channelMarketPrice}}
              </template>
            </el-table-column>
            <el-table-column label="标准价" width="80">
              <template slot-scope="scope">
                {{scope.row.channel.channelPrice}}
              </template>
            </el-table-column>
          </el-table>
          <br/>
          <div style="text-align: right">
            <el-pagination
                v-show="total > 0"
                background
                :current-page="search.pageNo"
                :page-size="search.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
          </div>

        </el-col>
      </div>
    </el-row>
  </div>
</template>

<script>

import {queryGoods, batchAdd, getSkuCode} from '@/api/goods/marketing'

export default {
  name: "GoodsList",
  props: ['marketingId','marketingType'],
  data() {
    return {
      opt: this.$route.query.opt,
      total: 0,
      search: {
        pageNo: 1,
        pageSize: 10,
        goodsName: '',
        skuCode: '',
        categoryName: ''
      },
      data: [],
      column: [
        {label: '商品名称', prop: 'goodsName'},
        {label: '计量单位', prop: 'saleUnitName', width: 90},
        // {label: '原价（元）', prop: 'price', width: 90},
        {label: '商品品牌', prop: 'brandName'},
        // {label: '商品类目', prop: 'categoryName', width: 140},
      ],
      multipleSelection: [],
      multioleSelectionData: []
    }
  },
  created() {
    this.getSkuCode()
  },
  methods:{
    selectEvent(row,index){
      // console.log(row)
      if(this.multioleSelectionData.indexOf(row.skuCode)>-1){
        row.checked = true
        return false
      }else{
        return true
      }
    },
    getSkuCode(){
      getSkuCode({marketingId:this.marketingId,marketingType: this.marketingType}).then((res)=>{
        if(res.code === 200 && res.data && res.data.length>0){
          this.multioleSelectionData = res.data
        }
        this.initTable()
      })
    },
    initTable(){
      console.log('this.multipleSelection', this.multipleSelection)
      queryGoods(this.search).then((res)=>{
        if(res.code === 200){
          this.data = res.data.records
          this.total = res.data.totalRecords
        }
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
    searchFn(){
      this.search.pageSize = 10
      this.search.pageNo = 1
      this.initTable()
    },
    resetSearch(){
      this.search = {
        pageNo: 1,
        pageSize: 10,
        goodsName: '',
        skuCode: '',
        categoryName: ''
      }
      this.initTable()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    addgoods() {
      if(this.multipleSelection.length < 1){
        return
      }
      let params = this.multipleSelection.map((v)=>{
        return {
          goodsCategoryName: v.categoryName,
          marketingId: this.marketingId,
          marketingType: this.marketingType,// 1.优惠券 2.订单促销
          skuCode: v.skuCode
        }
      })
      batchAdd(params).then((res)=>{
        if(res.code === 200){
          this.$baseMessage('操作成功', 'success')
          this.$emit('initTable')
        }
      })
    }
  }
}
</script>

<style scoped lang="sass">

</style>
