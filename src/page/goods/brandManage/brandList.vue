<template>
  <div class="app-container">
    <el-card
        class="box-card"
        shadow="never"
        style="border: 0"
        body-style="background-color: #f3f3f3;padding: 10px 0 0;"
    >
      <div slot="header">
        <span>品牌列表</span>
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
              <el-button size="mini" type="text" @click="handleShow(scope.row.id, 2)">查看</el-button>
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

    <el-dialog v-if="open" title="品牌信息" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
      <el-row>
        <el-form :model="formInline" class="demo-form-inline" label-width="130px">
          <el-form-item label="品牌编码">
            <span>{{formInline.brandCode}}</span>
          </el-form-item>
          <el-form-item label="品牌名称">
            <span>{{formInline.brandName}}</span>
          </el-form-item>
          <el-form-item label="品牌名称(英文)">
            <span>{{formInline.brandNameEn}}</span>
          </el-form-item>
          <el-form-item label="品牌别名">
            <span>{{formInline.brandAlias}}</span>
          </el-form-item>
        </el-form>
      </el-row>
    </el-dialog>
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
        {label: 'Id', prop: 'id', width: 70, fixed:'left'},
        {label: '品牌名称', prop: 'brandName'},
        {label: '品牌名称(英文)', prop: 'brandNameEn'},
        {label: '品牌别名', prop: 'brandAlias', },
        {label: '品牌编码', prop: 'brandCode', },
        {label: '品牌logo', prop: 'brandLogo', width: 150},
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
    },
    handleShow(id, opt) {
      // this.open = true
      getInfo(id).then((res)=>{
        if(res.code === 200){
          this.formInline = res.data
          this.open = true
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
