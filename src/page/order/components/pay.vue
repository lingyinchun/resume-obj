<template>
  <div>
    <el-row>
      <div class="detail-text detail-label">订单金额</div>
      <div class="detail-text">￥{{ order.orderAmount }}</div>
    </el-row>
    <el-row style="margin-top: 5px;">
      <div class="detail-text detail-label">支付金额</div>
      <div class="detail-text">￥{{ order.payAmount }}</div>
    </el-row>
    <el-row style="margin-top: 5px;">
      <div class="detail-text detail-label">支付类型</div>
      <div class="detail-text">网上支付</div>
    </el-row>
    <el-row style="margin-top: 5px;">
      <div class="detail-text detail-label">支付状态</div>
      <div class="detail-text">已支付</div>
    </el-row>
    <el-table :data="dataList" border style="margin-top: 15px;">
      <el-table-column label="支付渠道" prop="channelCode"></el-table-column>
      <el-table-column label="终端类型" prop="terminalType"></el-table-column>
      <el-table-column label="支付金额" prop="payAmount"></el-table-column>
      <el-table-column label="支付时间" prop="payTime" width="200"></el-table-column>
      <el-table-column label="业务流水号" prop="transactionNo"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import {orderPayGet} from "@/api/order/index";

export default {
  name: "orderList",
  components: {},
  props: {
    order: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      layout: 'total, sizes, prev, pager, next, jumper',
      search: {
        pageNo: 1,
        pageSize: 10,
        orderCode: undefined,
        skuCode: undefined,
      },
      dataList: [],
      total: 0,
      data: {}
    };
  },
  created() {
  },
  methods: {
    init() {
      this.getDataList();
    },
    getDataList() {
      orderPayGet(this.order.orderCode).then((res) => {
        if (res.code === 200) {
          this.dataList = [res.data]
        }
      })
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
};
</script>

<style lang="scss" scoped>
</style>
