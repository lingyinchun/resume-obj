<template>
  <div class="app-container">
    <el-card class="box-card" shadow="never" style="border: 0"
             body-style="background-color: #f3f3f3;padding: 10px 0 0;"
    >
      <div slot="header">
        <span>下载列表</span>
      </div>
    </el-card>
    <div class="table-body">
      <el-form :inline="true" :model="search" class="demo-form-inline" ref="search">
        <el-form-item label="下载状态">
          <el-select v-model="search.downloadStatus" placeholder="下载状态" clearable style="width: 120px;">
            <el-option label="等待处理" value="0"></el-option>
            <el-option label="正在处理" value="1"></el-option>
            <el-option label="处理成功" value="2"></el-option>
            <el-option label="处理失败" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
              v-model="search.createTime" type="datetimerange" :picker-options="pickerOptions"
              range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" align="right"
              @change="changeDate" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getDataList()" size="small">查询</el-button>
          <el-button icon="el-icon-refresh-left" @click="resetForm()" size="small">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table
          :data="dataList"
          row-key="id"
          border
          size="small"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          @selection-change="selectionChange"
      >
        <el-table-column label="编号" prop="id" width="60"></el-table-column>
        <el-table-column label="模块" prop="module"></el-table-column>
        <el-table-column label="子模块" prop="subModule"></el-table-column>
        <el-table-column label="下载状态" prop="downloadStatus" width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.downloadStatus == 0">等待处理</el-tag>
            <el-tag type="warning" v-if="scope.row.downloadStatus == 1">正在处理</el-tag>
            <el-tag type="success" v-if="scope.row.downloadStatus == 2">处理成功</el-tag>
            <el-tag type="danger" v-if="scope.row.downloadStatus == 3">处理失败</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="错误信息" prop="errorMessage" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="160"></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope" fixed="right">
            <el-button size="mini" type="text" @click="handleDownload(scope.row)" v-if="scope.row.downloadStatus == 2">
              下载
            </el-button>
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
  </div>
</template>

<script>
import {userDownloadQuery} from '@/api/operation/download'
import {getPickerOptions} from '@/utils'

export default {
  name: 'operationDownload',
  data() {
    return {
      // 日期快捷选项
      pickerOptions: getPickerOptions(),
      total: 0,
      dataList: [],
      search: {
        pageNo: 1,
        pageSize: 10,
      },
      layout: 'total, sizes, prev, pager, next, jumper',
    }
  },
  created() {
    this.getDataList();
  },
  methods: {
    getDataList() {
      userDownloadQuery(this.search).then((res) => {
        this.dataList = res.data.records || [];
        this.total = res.data.totalRecords;
      });
    },
    changeDate() {
      let value = this.search.createTime
      if (value) {
        this.search.createTimeFrom = value[0]
        this.search.createTimeTo = value[1]
      } else {
        this.search.createTimeFrom = null
        this.search.createTimeTo = null
      }
      this.getDataList()
    },
    // 下载
    handleDownload(row) {
      window.open(row.url)
    },
    selectionChange(list) {
      this.selectionList = list
    },
    resetForm() {
      this.reset();
      this.changeDate()
    },
    reset() {
      this.search = {
        pageNo: 1,
        pageSize: 10,
        downloadStatus: undefined,
        createTimeFrom: undefined,
        createTimeTo: undefined,
      }
    },
    handleSizeChange(val) {
      this.search.pageSize = val
      this.getDataList()
    },
    handleCurrentChange(val) {
      this.search.pageNo = val
      this.getDataList()
    },
  }
}

</script>

<style lang="scss" scoped>

</style>
