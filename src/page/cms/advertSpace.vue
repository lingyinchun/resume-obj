<template>
  <div class="app-container">
    <el-card
        class="box-card"
        shadow="never"
        style="border: 0"
        body-style="background-color: #f3f3f3;padding: 10px 0 0;"
    >
      <div slot="header">
        <span>广告位列表</span>
        <div style="float: right; margin: -5px 0">
          <el-button type="primary" size="small" icon="el-icon-plus" plain @click="handleInfo(null, 1)">新增广告位
          </el-button>
        </div>
      </div>
    </el-card>
    <div class="main-container">
      <div class="app-search">
        <el-form :inline="true" :model="search" ref="search">
          <el-form-item label="广告位名称" prop="advertSpaceNameLike">
            <el-input v-model="search.advertSpaceNameLike" placeholder="广告位名称" clearable style="width:120px"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="isValid">
            <el-select v-model="search.isValid" placeholder="状态" clearable style="width: 100px;">
              <el-option label="启用" :value="1"></el-option>
              <el-option label="停用" :value="0"></el-option>
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
            <el-button icon="el-icon-refresh-left" @click="resetForm('search')" size="small">重置</el-button>
          </el-form-item>
        </el-form>

        <el-table :data="data" row-key="id" border size="small">
          <el-table-column label="id" prop="id" width="80"></el-table-column>
          <el-table-column label="广告位名称" prop="advertSpaceName"></el-table-column>
          <el-table-column label="广告位编码" prop="advertSpaceCode"></el-table-column>
          <el-table-column label="前台展示张数" prop="webShowNumber" width="100"></el-table-column>
          <el-table-column label="是否启用">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isValid" @change="statusChange(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime" width="180"></el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handleInfo(scope.row.id, 3)">查看</el-button>
              <el-button size="mini" type="text" @click="handleInfo(scope.row.id, 2)">编辑</el-button>
              <el-button size="mini" type="text" @click="handleAdvert(scope.row.id)">广告设置</el-button>
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
            style="margin-bottom: 10px;"
        ></el-pagination>
      </div>
    </div>
    <advert-space-edit v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></advert-space-edit>
  </div>
</template>

<script>
import {advertSpaceQuery, advertSpaceUpdate} from '@/api/cms/advertSpace'
import {getPickerOptions} from '@/utils'
import advertSpaceEdit from './advertSpaceEdit'

export default {
  name: 'cmsAdvertSpace',
  components: {advertSpaceEdit},
  data() {
    return {
      addOrUpdateVisible: false,
      // 日期快捷选项
      pickerOptions: getPickerOptions(),
      layout: 'total, sizes, prev, pager, next, jumper',
      search: {
        pageNo: 1,
        pageSize: 10,
        advertSpaceNameLike: undefined,
        isValid: '',
        createTime: undefined,
        createTimeFrom: undefined,
        createTimeTo: undefined,
        orderBy: 'id desc',
      },
      data: [],
      total: 0,
    }
  },
  created() {
    this.getDataList();
  },
  methods: {
    getDataList() {
      advertSpaceQuery(this.search).then((res) => {
        this.data = res.data.records || [];
        this.total = res.data.totalRecords;
      });
    },
    handleInfo(id, opt) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, opt);
      })
    },
    // 广告设置
    handleAdvert(code) {
      this.$router.push({path: `/cms/advert`, query: {code: code}})
    },
    changeDate() {
      let value = this.search.createTime
      console.log(value)
      if (value) {
        this.search.createTimeFrom = value[0]
        this.search.createTimeTo = value[1]
      } else {
        this.search.createTimeFrom = null
        this.search.createTimeTo = null
      }
    },
    // 修改状态
    statusChange(obj) {
      console.log(obj);
      let data = {id: obj.id, isValid: obj.isValid};
      advertSpaceUpdate(data).then((res) => {
        this.$baseMessage('修改成功', 'success')
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.search.createTime = [];
      this.getDataList()
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
