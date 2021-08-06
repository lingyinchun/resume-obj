<template>
  <div class="app-container">
    <el-card
        class="box-card"
        shadow="never"
        style="border: 0"
        body-style="background-color: #f3f3f3;padding: 10px 0 0;"
    >
      <div slot="header">
        <span>商品管理</span>
        <div style="float: right; margin: -5px 0">
          <el-button type="primary" size="small" icon="el-icon-folder-opened" plain>导出</el-button>
        </div>
      </div>
    </el-card>
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
            <el-form-item label="商品品牌">
              <el-input v-model="search.brandName" placeholder="商品品牌" clearable></el-input>
            </el-form-item>
            <el-form-item label="商品类目">
              <el-input v-model="search.categoryName" placeholder="商品类目" clearable></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="search.goodsStatus" clearable>
                <el-option label="上架" value="1"/>
                <el-option label="下架" value="0"/>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="searchFn">搜索</el-button>
              <el-button icon="el-icon-refresh-left" @click="resetSearch">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-col :span="24">
          <div style="text-align:right;height:40px;">
            <el-button-group size="small">
              <el-button type="primary">批量上架</el-button>
              <el-button type="primary">批量下架</el-button>
            </el-button-group>
          </div>
          <el-table
              ref="multipleTable"
              :data="data"
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
                :selectable="selectEvent"
            >
            </el-table-column>
            <el-table-column label="主图" prop="skuCode" width="125">
              <template slot-scope="scope">
                <el-avatar shape="square" fit="contain" :size="100" :src="scope.row.mainFigure"></el-avatar>
              </template>
            </el-table-column>
            <el-table-column label="商品名称" prop="goodsName"/>
            <el-table-column label="商品编码" width="140">
              <template slot-scope="{row}">
                {{ row.skuCode }}
              </template>
            </el-table-column>
            <el-table-column v-for="col in column" :label="col.label" :prop="col.prop" :key="col.label"
                             :width="col.width || undefined" :fixed="col.fixed"></el-table-column>
            <el-table-column label="上架状态">
              <template slot-scope="{row}">
                {{row.channel.channelStatusDesc}}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{row}">
                <el-button size="mini" type="text" @click="handleShow(row.skuCode, 2)">查看</el-button>
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

import {queryGoods} from '@/api/goods/goods'
import RefreshPage from "@/mixins/refreshPage";
import closeDeactivatedVNode from "@/mixins/closeDeactivatedVNode";

export default {
  name: "GoodsList",
  mixins: [RefreshPage,closeDeactivatedVNode],
  data() {
    return {
      pathUrl: 'goods/goodsManage/goodsList',
      marketingId: '',
      marketingType: '',
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
        {label: '商品品牌', prop: 'brandName', width: 160},
        {label: '商品类目', prop: 'categoryName', width: 160},
        // {label: '上架状态', prop: 'goodsStatusDesc', width: 160},
        // {label: '计量单位', prop: 'unit', width: 90},
        // {label: '原价（元）', prop: 'price', width: 90},
      ],
      multipleSelection: [],
      multioleSelectionData: []
    }
  },
  created() {
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
    initTable(){
      console.log('this.multipleSelection', this.multipleSelection)
      queryGoods(this.search).then((res)=>{
        if(res.code === 200){
          this.data = res.data.records
          this.total = res.data.totalRecords
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleShow(skuCode, opt) {
      this.$router.push({path: '/goods/goodsManage/goodsInfoTab',query: {skuCode: skuCode, opt: opt}})
    }
  }
}
</script>

<style scoped lang="sass">

</style>
