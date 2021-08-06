<template>
  <div class="app-container">
    <el-card
        class="box-card"
        shadow="never"
        style="border: 0"
        body-style="background-color: #f3f3f3;padding: 10px 0 0;"
    >
      <div slot="header">
        <span>属性列表</span>
      </div>
    </el-card>
    <el-row>
      <div class="table-body">
        <div class="app-search">
          <el-form :inline="true" size="small" :model="search" class="demo-form-inline" ref="search">
            <el-form-item label="属性名称">
              <el-input v-model="search.attributeNameLike" placeholder="属性名称" clearable></el-input>
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
          <el-table-column label="操作" width="165">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handleShow(scope.row.id, 2)">编辑</el-button>
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

    <el-dialog v-if="open" title="属性信息" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
      <el-row>
        <el-form ref="dataForm" :model="formInline" class="demo-form-inline" :rules="rules" label-width="130px">
          <el-form-item label="属性名称">
            <span>{{formInline.attributeName}}</span>
          </el-form-item>
          <el-form-item label="属性类型" prop="attributeType">
            <el-select v-model="formInline.attributeType" style="width: 160px;">
              <el-option label="销售属性" :value="1"></el-option>
              <el-option label="导购属性" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序">
            <span>{{formInline.sortNumber}}</span>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click="submit">提交</el-button>
            <el-button @click="close">取消</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {querylist,getInfo,updateData} from '@/api/marketing/attribute'
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
        {label: '属性名称', prop: 'attributeName'},
        {label: '属性类型', prop: 'attributeTypeDesc'},
        {label: '创建时间', prop: 'createTime', },
        {label: '排序', prop: 'sortNumber', width: 90 },
      ],
      total: 0,
      search: {
        pageNo: 1,
        pageSize: 10,
      },
      formInline: {},
      rules: {
        attributeType: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      }
    }
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
      getInfo(id).then((res)=>{
        if(res.code === 200){
          this.formInline = res.data
          this.open = true
        }
      })
    },
    close() {
      this.formInline = {}
      this.open = false
    },
    submit() {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return
        }
        updateData(this.formInline).then((res)=>{
          if(res.code === 200){
            this.$baseMessage('更新成功', 'success')
            this.resetSearch()
            this.open = false
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
