<template>
  <div>
    <el-row>
      <div class="table-body">
        <div class="app-search">
          <el-form :inline="true" :model="search" class="demo-form-inline" ref="search" size="small">
            <el-form-item label="商品名称">
              <el-input v-model="search.goodsName" placeholder="商品名称" clearable></el-input>
            </el-form-item>
<!--            <el-form-item label="商品编码">-->
<!--              <el-input v-model="search.skuCode" placeholder="商品编码" clearable></el-input>-->
<!--            </el-form-item>-->
            <el-form-item label="商品类目">
              <el-input v-model="search.categoryName" placeholder="商品类目" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="searchFn">搜索</el-button>
              <el-button @click="resetSearch">重置</el-button>
            </el-form-item>
            <div style="display:inline-block;float:right;height:40px;" v-if="checkMore">
              <el-button type="primary" size="small" @click="addgoods">选择</el-button></div>
          </el-form>
        </div>
        <el-col :span="24">
          <el-table
              ref="multipleTable"
              :data="data"
              border
              size="small"
              row-key="id"
              height="450"
              @selection-change="handleSelectionChange"
          >
            <el-table-column
                v-if="checkMore"
                type="selection"
                width="40"
                :reserve-selection='true'
                fixed="left"
                :selectable="selectEvent"
            >
            </el-table-column>
            <el-table-column label="id" prop="id" width="100">
              <template slot-scope="scope">
                <span>{{scope.row.id}} <el-tag v-if="scope.row.checked" size="mini">已选择</el-tag></span>
              </template>
            </el-table-column>
            <el-table-column v-for="col in column" :label="col.label" :prop="col.prop" :key="col.label"
                             :width="col.width || undefined" :fixed="col.fixed"></el-table-column>
            <el-table-column label="操作" width="80" v-if="!checkMore">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="checkItem(scope.row)">选择</el-button>
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

import {goodsQuery} from '@/api/goods/marketing'

// 无sku的商品选择
export default {
  name: "GoodsList",
  props: {
    checkMore:{
      type: Boolean,
      default: true
    },
    multioleSelectionData:{
      type: Array,
      default:()=>{
        return []
      }
    }
  },
  data() {
    return {
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
        {label: '计量单位', prop: 'unit', width: 90},
        {label: '原价（元）', prop: 'price', width: 90},
        // {label: '商品品牌', prop: 'couponName'},
        {label: '商品类目', prop: 'categoryName', width: 140},
      ],
      multipleSelection: [],
    }
  },
  created() {
    this.initTable()
  },
  methods:{
    selectEvent(row,index){ // 是否可以选择
      // console.log(this.multioleSelectionData,row)
      if(this.multioleSelectionData && this.multioleSelectionData.length>0 && this.multioleSelectionData.indexOf(row.id)>-1){
        row.checked = true
        return false
      }else{
        return true
      }
    },
    initTable(){
      goodsQuery(this.search).then((res)=>{
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
      this.$emit('selectItem',this.multipleSelection)
      this.$emit('close')
      this.$refs.multipleTable.clearSelection();
    },
    checkItem(row){
      console.log(row)
      this.$emit('selectItem',[row])
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="sass">

</style>
