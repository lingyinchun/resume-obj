<template>
  <div class="app-container">
    <el-card
        class="box-card"
        shadow="never"
        style="border: 0"
        body-style="background-color: #f3f3f3;padding: 10px 0 0;"
    >
      <div slot="header">
        <span>优惠券列表</span>
        <div style="float: right; margin: -5px 0">
          <el-button type="primary" size="small" icon="el-icon-plus" plain @click="handleShow(null, 1)">新增</el-button>
        </div>
      </div>
    </el-card>
    <el-row>
      <div class="table-body">
        <div class="app-search">
          <el-form :inline="true" size="small" :model="search" class="demo-form-inline" ref="search">
            <el-form-item label="券名称">
              <el-input v-model="search.couponName" placeholder="券名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="券类型">
              <el-select v-model="search.couponType">
                <el-option label="满减券" value="2"/>
                <el-option label="满折券" value="3"/>
              </el-select>
            </el-form-item>
            <el-form-item label="券状态">
              <el-select v-model="search.couponStatus" clearable>
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
          <el-table-column label="操作" width="165" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handleShow(scope.row.id, 2)">查看</el-button>
              <el-button size="mini" type="text" @click="handleShow(scope.row.id, 3)">编辑</el-button>
              <el-button size="mini" type="text" @click="handleShow(scope.row.id, 4)">数据</el-button>
              <el-button v-if="scope.row.couponStatus!=2" size="mini" type="text" @click="closeActFn(scope.row.id)">关闭</el-button>
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
import {querylist, closedCoupon} from '@/api/marketing/coupon'
import ElDatePickerCom from "@/components/ElDatePickerCom";
import {couponStatusFn} from '@/utils/util'
import RefreshPage from "@/mixins/refreshPage";
import closeDeactivatedVNode from "@/mixins/closeDeactivatedVNode";

export default {
  components: { ElDatePickerCom },
  mixins: [RefreshPage,closeDeactivatedVNode],
  data() {
    return {
      pathUrl: 'marketing/coupon/couponList',
      title: '',
      data: [],
      column: [
        {label: 'Id', prop: 'id', width: 50, fixed:'left'},
        {label: '券名称', prop: 'couponName'},
        {label: '优惠券类型', prop: 'couponTypeStr',width: '100'},
        {label: '券活动时间', prop: 'time', width: '290'},
        {label: '优惠券内容', prop: 'desc', width: '180'},
        {label: '适用商品', prop: 'couponScopeStr', width: 150},
        {label: '已领取/已使用/剩余', prop: 'count', width: 150},
        {label: '状态', prop: 'couponStatusStr', fixed:'right',width: 80},
      ],
      search: {
        pageNo: 1,
        pageSize: 10
      }
    }
  },
  created() {
  },
  methods: {
    initTable() {
      querylist(this.search).then((response) => {
        if (response.code === 200 && response.data.records && response.data.records.length>0) {
          this.data = response.data.records
          this.data.length >0 && this.data.forEach((v)=>{
            v.couponTypeStr = v.couponType == 2 ? '满减券' : '满折券'
            v.promotionAmountStr = v.couponType == 2 ? `减${v.promotionAmount}元` : `打${v.discountAmount}折`
            v.time = v.startTime + '至' + v.endTime
            v.desc = !v.orderFullAmount ? '无门槛' : (`满${v.orderFullAmount}元，${v.promotionAmountStr}`)
            v.couponScopeStr = v.couponScope === 0 ? '全部' : (v.couponScope == 1 ? '指定商品可用' : '指定品类可用')
            v.count = `${v.takeCount || 0}/${v.usedCount || 0}/${v.inventory || 0}`
            v.couponStatusStr = couponStatusFn(v.couponStatus)
          })
          this.total = response.data.totalRecords
        }else{
          this.data = []
          this.total = 0
        }
      })
    },
    handleShow(id, opt) {
      if(opt==4){
        this.$router.push({path: '/marketing/coupon/couponRecord',query: {couponId: id}})
        return
      }
      this.$router.push({path: '/marketing/coupon/couponForm',query: {id: id, opt: opt}})
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
        `关闭后已领取并未使用的用户将不能使用该券，请谨慎操作`,
        '确认关闭该优惠券吗?',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }
      )
      .then(() => {
        closedCoupon(id).then((res) => {
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
