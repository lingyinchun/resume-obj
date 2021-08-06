<template>
  <div class="app-container">
    <el-row>
      <div class="table-body">
        <div class="app-search">
          <el-form :inline="true" size="small" :model="search" class="demo-form-inline" ref="search">
            <el-form-item label="模板名称">
              <el-input v-model="search.templateName" placeholder="模板名称" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="searchFn">搜索</el-button>
              <el-button icon="el-icon-refresh-left" @click="resetSearch">重置</el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="primary" size="small" icon="el-icon-plus" plain @click="handleShow(null, 1)">新增</el-button>
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
import Http from '@/api/setting/emailTem'

export default {
  mixins: [RefreshPage, closeDeactivatedVNode],
  data() {
    return {
      pathUrl: '',
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
      Http.queryEmailTem(this.search).then((response) => {
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
      this.$router.push({path: '/setting/emailMessage/emailTemplate', query: {id: id, opt: opt}})
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
        Http.deleteEmailTem(id).then((res) => {
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
