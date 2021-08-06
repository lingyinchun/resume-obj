<template>
  <div class="app-container">
    <el-card
        class="box-card"
        shadow="never"
        style="border: 0"
        body-style="background-color: #f3f3f3;padding: 10px 0 0;"
    >
      <div slot="header">
        <span>评论列表</span>
<!--        <div style="float: right; margin: -5px 0">-->
<!--          <el-button type="primary" size="small" icon="el-icon-plus" plain @click="handleShow(null, 1)">新增</el-button>-->
<!--        </div>-->
      </div>
    </el-card>
    <el-row>
      <div class="table-body">
        <div class="app-search">
          <el-form :inline="true" size="small" :model="search" class="demo-form-inline" ref="search">
            <el-form-item label="品牌名称">
              <el-input v-model="search.brandNameLike" placeholder="品牌名称" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="searchFn">搜索</el-button>
              <el-button icon="el-icon-refresh-left" @click="resetSearch">重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-table
            ref="multipleTable"
            :data="data"
            row-key="id"
            border
            size="small"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column v-for="col in column" :label="col.label" :prop="col.prop" :key="col.label"
                           :width="col.width || undefined" :fixed="col.fixed"></el-table-column>
          <el-table-column label="操作" width="165" fixed="right">
            <template slot-scope="scope">
<!--              <el-button size="mini" type="text" @click="handleShow(scope.row.id, 2)">查看</el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            v-show="total > 0"
            background
            :current-page="search.pageNo"
            :page-size="search.pageSize"
            :layout="layout"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </el-row>
  </div>
</template>

<script>
import {querylist,getInfo} from '@/api/marketing/brand'
import RefreshPage from "@/mixins/refreshPage";
import closeDeactivatedVNode from "@/mixins/closeDeactivatedVNode";

export default {
  components: { },
  mixins: [RefreshPage,closeDeactivatedVNode],
  data() {
    return {
      pathUrl: 'marketing/coupon/couponList',
      title: '',
      open: false,
      data: [],
      column: [
        {label: '评论人账号', prop: 'id'},
        {label: '商品名称', prop: 'brandName'},
        {label: '订单编号', prop: 'brandNameEn'},
        {label: '评论时间', prop: 'brandAlias', },
        {label: '商品评分', prop: 'brandCode', },
        {label: '评论内容', prop: 'brandLogo' },
        {label: '状态', prop: 'status' },
      ],
      total: 0,
      search: {
        pageNo: 1,
        pageSize: 10,
      },
      formInline: {}
    }
  },
  created() {
  },
  methods: {
    initTable() {
      querylist(this.search).then((response) => {
        if(response.code === 200){
          this.data = response.data.records
          this.total = response.data.totalRecords
        } else {
          this.data = []
          this.total = 0
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
