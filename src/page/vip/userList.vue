<template>
  <div class="app-container">
    <el-card
      class="box-card"
      shadow="never"
      style="border: 0"
      body-style="background-color: #f3f3f3;padding: 10px 0 0;"
    >
      <div slot="header">
        <span>会员列表</span>
        <div style="float: right; margin: -5px 0">
          <el-button type="primary" size="small" icon="el-icon-plus" plain @click="handleShow(null, 1)">新增会员</el-button>
        </div>
      </div>
    </el-card>

    <div class="table-body">
      <div class="app-search">
        <el-form :inline="true" size="small" :model="search" class="demo-form-inline" ref="search">
          <el-form-item label="用户账号">
            <el-input v-model="search.userName" placeholder="用户账号" clearable></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="search.mobile" placeholder="手机号" clearable></el-input>
          </el-form-item>
          <el-form-item label="会员等级">
            <el-select v-model="search.levelCode" placeholder="会员等级" clearable>
              <el-option v-for="item in levelList" :label="item.levelName" :value="item.levelCode" :key="item.levelCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="search.userStatus" placeholder="状态" clearable style="width: 100px;">
              <el-option v-for="item in userStatusList" :label="item.name" :value="item.value" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="注册时间">
            <el-date-picker
              v-model="search.createTime" type="datetimerange" :picker-options="pickerOptions"
              range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" align="right"
              @change="changeDate" value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="toSearch()" size="small">查询</el-button>
            <el-button icon="el-icon-refresh-left" @click="resetForm()" size="small">重置</el-button>
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
        <el-table-column label="用户ID" prop="id" width="150"></el-table-column>
        <el-table-column label="用户昵称" :show-overflow-tooltip="true" prop="nickName"></el-table-column>
        <el-table-column label="手机号" prop="mobile"></el-table-column>
        <el-table-column label="用户账号" :show-overflow-tooltip="true" prop="userName"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="会员等级" prop="levelCode"></el-table-column>
        <el-table-column label="等级名称" prop="levelName"></el-table-column>
        <el-table-column label="状态" prop="userStatus" :formatter="formatStatus"></el-table-column>
        <el-table-column label="注册时间" prop="createTime"></el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleShow(scope.row.id, 3)">查看</el-button>
            <el-button size="mini" type="text" @click="handleShow(scope.row.id, 2)">编辑</el-button>
            <el-button size="mini" type="text" @click="handleUpdateStatus(scope.row.id, 1)" v-if="scope.row.userStatus == 0" style="color: #67c23a;">启用</el-button>
            <el-button size="mini" type="text" @click="handleUpdateStatus(scope.row.id, 0)" v-if="scope.row.userStatus == 1" style="color: #f56c6c;">停用</el-button>
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
</template>

<script>
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import {
    getList,
    updateStatus
  } from '@/api/vip/user'
  import {getList as getLevelList} from '@/api/vip/grade'
  import { getPickerOptions } from '@/utils'
  // 权限判断指令
  import permission from '@/directive/permission/index'
  import closeDeactivatedVNode from "@/mixins/closeDeactivatedVNode";

  export default {
    name: 'userList',
    components: { },
    directives: { permission },
    mixins: [closeDeactivatedVNode],
    data() {
      return {
        data: [],
        // 用户状态列表
        userStatusList: [{'value': 1, 'name': '启用'},{'value': 0, 'name': '停用'}],
        // 日期快捷选项
        pickerOptions: getPickerOptions(),
        // 会员等级列表
        levelList: [],

        // 查询参数
        search: {
        },
        total: 0,
        roleList: [],
        layout: 'total, sizes, prev, pager, next, jumper',
      }
    },
    created() {
      this.reset();
      this.init()
    },
    methods: {
      // 格式化状态
      formatStatus(row, column, cellValue, index) {
        return this.userStatusList.filter(item => item.value == cellValue)[0].name;
      },
      /** 初始化列表 */
      init() {
        this.getLevelList()
      },
      getLevelList() {
        getLevelList({pageSize: 10000}).then((res) => {
          this.levelList = res.data.records || [];
          this.getDataList();
        });
      },
      getDataList() {
        this.listLoading = true
        getList(this.search).then((response) => {
          this.data = response.data.records || []
          this.total = response.data.totalRecords;
          this.listLoading = false
        })
      },
      /** 新增、编辑、查看按钮操作 */
      handleShow(id, opt) {
        this.$router.push({path: `/vip/userInfo`, query: {id: id, opt: opt}})
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
        this.init()
      },
      toSearch() {
        this.changeDate()
      },
      resetForm() {
        this.reset();
        this.changeDate()
      },
      reset() {
        this.search= {
          pageNo: 1,
          pageSize: 10,
          userName: undefined,
          mobile: undefined,
          levelCode: undefined,
          userStatus: undefined,
          createTimeFrom: undefined,
          createTimeTo: undefined,
        }
      },
      handleUpdateStatus(id, opt) {
        let text = '停用';
        if(opt == 1) {
          text = '启用';
        }
        this.$confirm('是否' + text + '选中的用户?', '警告', {
            type: 'warning'
        }).then(() => {
          updateStatus(id).then((res) => {
            this.$baseMessage(text + '成功', 'success')
            this.toSearch();
          });
        }).catch(() => {});
      },
      handleSizeChange(val) {
        this.search.pageSize = val
        this.getDataList()
      },
      handleCurrentChange(val) {
        this.search.pageNo = val
        this.getDataList()
      },
    },
  }
</script>

<style lang="scss" scoped>

  .bgdiv{
    width: 60px;
    height: 23px;
    display: inline-block;
    border: 1px solid #eeeeee;
  }
  .f-tip{
    color:#999999;
    font-size: 12px;
  }
  .dialog-footer{
    text-align: center;
  }
</style>
