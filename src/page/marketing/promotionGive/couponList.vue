<template>
  <div class="app-container">
    <el-card
        class="box-card"
        shadow="never"
        style="border: 0"
        body-style="background-color: #f3f3f3;padding: 10px 0 0;"
    >
      <div slot="header">
        <span>满赠活动</span>
        <div style="float: right; margin: -5px 0">
          <el-button type="primary" size="small" icon="el-icon-plus" plain @click="handleShow(null, 1)">新增</el-button>
        </div>
      </div>
    </el-card>
    <el-row>
      <div class="table-body">
        <div class="app-search">
          <el-form :inline="true" size="small" :model="search" class="demo-form-inline" ref="search">
            <el-form-item label="活动名称">
              <el-input v-model="search.promotionName" placeholder="活动名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="活动类型">
              <el-select v-model="search.promotionType">
                <!--                <el-option label="满额减" value="1"/>-->
                <!--                <el-option label="满额折" value="2"/>-->
                <!--                <el-option label="满量减" value="3"/>-->
                <!--                <el-option label="满量折" value="4"/>-->
                <el-option label="满额赠" value="5"/>
                <el-option label="满量赠" value="6"/>
              </el-select>
            </el-form-item>
            <el-form-item label="券状态">
              <el-select v-model="search.promotionStatus" clearable>
                <el-option label="未开始" value="0"/>
                <el-option label="进行中" value="1"/>
                <el-option label="已结束" value="2"/>
                <el-option label="已关闭" value="3"/>
                <el-option label="草稿" value="4"/>
              </el-select>
            </el-form-item>
            <el-form-item label="活动时间">
              <ElDatePickerCom v-model="search.createTime" @change="changeDate"/>
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
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handleShow(scope.row.id, 2)">查看</el-button>
              <el-button size="mini" type="text" @click="handleShow(scope.row.id, 3)">编辑</el-button>
              <el-button size="mini" type="text" @click="handleShow(scope.row.id, 4)">数据</el-button>
              <el-button v-if="scope.row.promotionStatus!=2" size="mini" type="text" @click="closeActFn(scope.row.id)">关闭</el-button>
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
import {querylist, closeAct} from '@/api/marketing/promotion'
import ElDatePickerCom from "@/components/ElDatePickerCom";
import {couponStatusFn, couponTypeStr} from '@/utils/util'
import RefreshPage from "@/mixins/refreshPage";
import closeDeactivatedVNode from "@/mixins/closeDeactivatedVNode";

export default {
  name: 'promotionGive',
  components: {ElDatePickerCom},
  mixins: [RefreshPage, closeDeactivatedVNode],
  data() {
    return {
      pathUrl: 'marketing/promotionGive/couponList',
      dialogVisible: false,
      title: '',
      data: [],
      column: [
        {label: '活动Id', prop: 'id', width: 90, fixed: 'left'},
        {label: '活动名称', prop: 'promotionName'},
        {label: '活动类型', prop: 'promotionTypeStr', width: '90'},
        {label: '活动时间', prop: 'time', width: '158'},
        // {label: '活动内容', prop: 'desc', width: '180'},
        {label: '适用商品', prop: 'promotionScopeStr'},
        {label: '状态', prop: 'promotionStatusStr', width: 80},
      ],
      search: {
        pageNo: 1,
        pageSize: 10,
        couponName: '',
        couponType: '',
        createTimeFrom: undefined,
        createTimeTo: undefined,
      }
    }
  },
  created() {
  },
  methods: {
    initTable() {
      const params = JSON.parse(JSON.stringify(this.search))
      if (!params.promotionType) {
        delete params.promotionType
        params.promotionTypeList = [5, 6]
      }
      querylist(params).then((response) => {
        if (response.code === 200 && response.data.records && response.data.records.length > 0) {
          this.data = response.data.records
          this.data.length > 0 && this.data.forEach((v) => {
            v.time = v.startTime + '至' + v.endTime
            v.promotionScopeStr = v.promotionScope === 0 ? '全部' : (v.promotionScope == 1 ? '指定商品可用' : '指定品类可用')
            v.promotionTypeStr = couponTypeStr(v.promotionType)
            v.promotionStatusStr = couponStatusFn(v.promotionStatus)
          })
          this.total = response.data.totalRecords
        } else {
          this.data = []
          this.total = 0
        }
      })
    },
    handleShow(id, opt) {
      if(opt==4){
        this.$router.push({path: '/marketing/promotionRecord',query: {promotionId: id}})
        return
      }
      this.$router.push({path: '/marketing/promotionGive/couponForm', query: {id: id, opt: opt}})
    },
    changeDate() {
      let value = this.search.createTime
      if (value) {
        this.search.startTimeFrom = value[0]
        this.search.startTimeTo = value[1]
      } else {
        this.search.startTimeFrom = null
        this.search.startTimeTo = null
      }
      this.initTable()
    },
    closeActFn(id) {
      this.$confirm(
        `关闭后商品将不能使用该活动，请谨慎操作`,
        '确认关闭此活动?',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }
      )
      .then(() => {
        closeAct(id).then((res) => {
          if(res.code === 200){
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

</style>
