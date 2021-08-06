<template>
  <div class="app-container">
    <el-card
        class="box-card"
        shadow="never"
        style="border: 0"
        body-style="background-color: #f3f3f3;padding: 10px 0 0;"
    >
      <div slot="header">
        <el-page-header @back="goBack" content="活动数据">
        </el-page-header>
      </div>
    </el-card>
    <el-row>
      <div class="table-body">
        <div class="app-search">
          <el-form :inline="true" size="small" :model="search" class="demo-form-inline" ref="search">
            <el-form-item label="订单编号">
              <el-input v-model="search.orderCode" placeholder="订单编号" clearable></el-input>
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
            <el-form-item label="用户账号/手机号">
              <el-input v-model="search.nameOrMobile" placeholder="用户账号/手机号" clearable/>
            </el-form-item>
            <el-form-item label="使用时间">
              <ElDatePickerCom v-model="search.createTime" @change="changeDate"/>
            </el-form-item>
            <el-form-item label="领取时间">
              <ElDatePickerCom v-model="search.createTime2" @change="changeDate2"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="searchFn">搜索</el-button>
              <el-button icon="el-icon-refresh-left" @click="resetSearch">重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div class="count_title">
          <el-col :span="7" >支付订单：<span>{{payCount}}</span></el-col>
          <el-col :span="7" >参与人数：<span>{{takeCount}}</span></el-col>
          <el-col :span="7" >活动商品实付总金额：<span>¥ {{promotionPayAllAmount}}</span></el-col>
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
<!--          <el-table-column label="操作">-->
<!--            <template slot-scope="scope">-->
<!--              <el-button size="mini" type="text" @click="handleShow(scope.row.id, 2)">查看</el-button>-->
<!--              <el-button size="mini" type="text" @click="handleShow(scope.row.id, 3)">编辑</el-button>-->
<!--            </template>-->
<!--          </el-table-column>-->
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
import {getPromotionCount,queryPromotiontail} from '@/api/marketing/promotion'
import ElDatePickerCom from "@/components/ElDatePickerCom";
import RefreshPage from "@/mixins/refreshPage";
import closeDeactivatedVNode from "@/mixins/closeDeactivatedVNode";

export default {
  components: { ElDatePickerCom },
  mixins: [RefreshPage,closeDeactivatedVNode],
  data() {
    return {
      pathUrl: 'marketing/promotionRecord',
      dialogVisible: false,
      promotionId: this.$route.query.promotionId,
      title: '',
      data: [],
      column: [
        {label: '订单编号', prop: 'id', width: 100, fixed:'left'},
        {label: '用户账号', prop: 'couponName'},
        {label: '用户手机号', prop: 'couponTypeStr',width: '120'},
        {label: '状态', prop: 'time', width: '100'},
        {label: '券领取时间', prop: 'desc', width: '180'},
        {label: '券使用时间', prop: 'couponScopeStr', width: '180'},
      ],
      search: {
        pageNo: 1,
        pageSize: 10,
      },
      payCount: 0,
      takeCount: 0,
      promotionPayAllAmount: 0
    }
  },
  watch: {

  },
  created() {

  },
  methods: {
    initTable() {
      this.search.promotionId = this.promotionId
      queryPromotiontail(this.search).then((response) => {
        if (response.code === 200 && response.data.records && response.data.records.length>0) {
          this.data = response.data.records
          this.total = response.data.totalRecords
        }else{
          this.data = []
          this.total = 0
        }
      })

      getPromotionCount(this.search).then((res)=>{
        if(res.code === 200){
          this.payCount = res.data.payCount //	优惠券失效数量
          this.takeCount = res.data.takeCount // 优惠券领取数量
          this.promotionPayAllAmount = res.data.promotionPayAllAmount // 优惠券使用数量
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
