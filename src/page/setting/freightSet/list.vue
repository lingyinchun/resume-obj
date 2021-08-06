<template>
  <div class="app-container">
    <el-card
        class="box-card"
        shadow="never"
        style="border: 0"
        body-style="background-color: #f3f3f3;padding: 10px 0 0;"
    >
      <div slot="header">
        <span>运费模板列表</span>
        <div style="float: right; margin: -5px 0">
          <el-button type="primary" size="small" icon="el-icon-plus" plain @click="handleShow(null, 1)">新增</el-button>
        </div>
      </div>
    </el-card>
    <el-row>
      <div class="table-body">
        <div class="app-search">
          <el-form :inline="true" size="small" :model="search" class="demo-form-inline" ref="search">
            <el-form-item label="模板名称">
              <el-input v-model="search.templateName" placeholder="模板名称" clearable></el-input>
            </el-form-item>
            <!--            <el-form-item label="券状态">-->
            <!--              <el-select v-model="search.couponStatus" clearable>-->
            <!--                <el-option label="未开始" value="0"/>-->
            <!--                <el-option label="进行中" value="1"/>-->
            <!--                <el-option label="已结束" value="2"/>-->
            <!--                <el-option label="已关闭" value="3"/>-->
            <!--                <el-option label="草稿" value="4"/>-->
            <!--              </el-select>-->
            <!--            </el-form-item>-->
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
              <el-button size="mini" type="text" @click="handleShow(scope.row.id, 3)">编辑</el-button>
              <el-button size="mini" type="text" @click="closeActFn(scope.row.id)">删除</el-button>
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
import RefreshPage from "@/mixins/refreshPage";
import closeDeactivatedVNode from "@/mixins/closeDeactivatedVNode";
import Http from '@/api/setting/freight'

export default {
  mixins: [RefreshPage, closeDeactivatedVNode],
  data() {
    return {
      pathUrl: 'setting/freightSet/list',
      title: '',
      data: [],
      column: [
        {label: 'id', prop: 'id', width: 100, fixed: 'left'},
        {label: '模板名称', prop: 'templateName'},
        {label: '创建时间', prop: 'createTime'}
      ],
      search: {
        pageNo: 1,
        pageSize: 10,
      }
    }
  },
  created() {
  },
  methods: {
    initTable() {
      Http.freightTemplateQuery(this.search).then((response) => {
        if (response.code === 200 && response.data.records && response.data.records.length > 0) {
          this.data = response.data.records
          this.total = response.data.totalRecords
        } else {
          this.data = []
          this.total = 0
        }
      })
    },
    handleShow(id, opt) {
      this.$router.push({path: '/setting/freightSet/freightForm', query: {id: id, opt: opt}})
    },
    closeActFn(id) {
      this.$confirm(
          '确认删除吗?',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }
      )
      .then(() => {
        Http.freightTemplateDel(id).then((res) => {
          if (res.code === 200) {
            this.$baseMessage('操作成功', 'success')
            this.initTable()
          }
        })
      })
      .catch(function () {
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.count_title {
  font-size: 15px;
  color: #3c3c3c;
  height: 40px;

  span {
    color: #2d8cf0;
  }
}
</style>
