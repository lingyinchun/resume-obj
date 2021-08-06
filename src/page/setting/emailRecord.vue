<template>
  <div class="app-container">
    <el-row>
      <div class="table-body">
        <div class="app-search">
          <el-form :inline="true" size="small" :model="search" class="demo-form-inline" ref="search">
            <el-form-item label="邮箱">
              <el-input v-model="search.email" placeholder="邮箱" clearable></el-input>
            </el-form-item>
            <el-form-item label="任务">
              <el-select v-model="search.emailTaskId" clearable>
                <el-option v-for="task in taskList" :key="task.id" :label="task.taskName" :value="task.id"/>
              </el-select>
            </el-form-item>
            <el-form-item label="发送状态">
              <el-select v-model="search.dataStatus" clearable>
                <el-option label="发送失败" value="0"/>
                <el-option label="等待发送" value="1"/>
                <el-option label="正在发送" value="2"/>
                <el-option label="发送成功" value="3"/>
              </el-select>
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
                           :show-overflow-tooltip="col.tooltip"
                           :width="col.width || undefined" :fixed="col.fixed"></el-table-column>
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
import Http from '@/api/setting/emailTem'
import TaskHttp from '@/api/setting/task'
import ElDatePickerCom from "@/components/ElDatePickerCom";
import RefreshPage from "@/mixins/refreshPage";
import closeDeactivatedVNode from "@/mixins/closeDeactivatedVNode";

export default {
  components: { ElDatePickerCom },
  mixins: [RefreshPage,closeDeactivatedVNode],
  props: ['emailTaskId'],
  data() {
    return {
      pathUrl: 'marketing/promotionRecord',
      dialogVisible: false,
      title: '',
      data: [],
      column: [
        // {label: '订单编号', prop: 'id', width: 100, fixed:'left'},
        {label: '邮箱', prop: 'email'},
        {label: '任务名称', prop: 'taskName'},
        {label: '发送时间', prop: 'createTime', width: '160'},
        {label: '发送状态', prop: 'dataStatusDesc', width: '100'},
        {label: '错误原因', prop: 'failureReason'},
        {label: '任务数据', prop: 'taskData', tooltip: true},
      ],
      search: {
        pageNo: 1,
        pageSize: 10,
        orderBy: 'id desc',
        emailTaskId: this.emailTaskId
      },
      taskList: []
    }
  },
  watch: {
    emailTaskId(val){
      this.$set(this.search, 'emailTaskId', val)
      this.$nextTick(()=>{
        this.initTable()
      })
    }
  },
  mounted() {
    TaskHttp.queryTask({
      pageNo: 1,
      pageSize: 10000
    }).then((res)=>{
      if(res.code===200){
        this.taskList = res.data && res.data.records
      }
    })
  },
  methods: {
    initTable() {
      Http.queryEmailRecord(this.search).then((response) => {
        if (response.code === 200 && response.data.records && response.data.records.length>0) {
          this.data = response.data.records
          this.total = response.data.totalRecords
        }else{
          this.data = []
          this.total = 0
        }
      })
    },
    handleShow(id, opt) {
      this.dialogVisible = true
      // this.$router.push({path: '/marketing/coupon/couponForm',query: {id: id, opt: opt}})
    },
    changeDate() {
      let value = this.search.createTime
      if (value) {
        this.search.payTimeFrom = value[0]
        this.search.payTimeTo = value[1]
      } else {
        this.search.payTimeFrom = null
        this.search.payTimeTo = null
      }
      this.initTable()
    },
    changeDate2() {
      let value = this.search.createTime2
      if (value) {
        this.search.createTimeFrom = value[0]
        this.search.createTimeTo = value[1]
      } else {
        this.search.createTimeFrom = null
        this.search.createTimeTo = null
      }
      this.initTable()
    },
    goBack() {
      this.$router.go(-1)
      this.$store.dispatch('permission/closeTagsByPath', 'marketing/promotionRecord')
    }
  }
}
</script>

<style lang="scss" scoped>

.count_title{
  font-size: 15px;
  color: #3c3c3c;
  height: 40px;
  span{
    color:#2d8cf0;
  }
}
</style>
