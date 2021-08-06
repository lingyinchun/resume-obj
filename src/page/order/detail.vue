<template>
  <div class="main-container">
    <el-card>
      <div slot="header">
        <span>订单详情</span>
      </div>
      <div>
        <el-row :gutter="20" class="detail-info">
          <el-col :span="6">
            <div class="detail-text detail-label">订单编号</div>
            <div class="detail-text">{{ order.orderCode }}</div>
          </el-col>
          <el-col :span="6">
            <div class="detail-text detail-label">订单类型</div>
            <div class="detail-text">普通订单</div>
          </el-col>
          <el-col :span="6">
            <div class="detail-text detail-label">订单状态</div>
            <div class="detail-text">{{ order.orderStatusDesc }}</div>
          </el-col>
          <el-col :span="6">
            <div class="detail-text detail-label">支付状态</div>
            <div class="detail-text">{{ order.payStatusDesc }}</div>
          </el-col>
          <el-col :span="6">
            <div class="detail-text detail-label">来源终端</div>
            <div class="detail-text">{{ order.orderChannelDesc }}</div>
          </el-col>
          <el-col :span="6">
            <div class="detail-text detail-label">下单时间</div>
            <div class="detail-text">{{ order.createTime }}</div>
          </el-col>
          <el-col :span="6">
            <div class="detail-text detail-label">外部订单编号</div>
            <div class="detail-text">{{ order.outOrderCode === null ? '暂无' : order.outOrderCode }}</div>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-tabs v-model="active" type="border-card" style="margin-top: 20px;" @tab-click="handleClick">
      <el-tab-pane name="goods" label="商品明细">
        <goods ref="orderGoods" :order="order"></goods>
      </el-tab-pane>
      <el-tab-pane name="pay" label="支付信息">
        <pay ref="orderPay" :order="order"></pay>
      </el-tab-pane>
      <el-tab-pane name="delivery" label="交货单信息">交货单信息</el-tab-pane>
      <el-tab-pane name="shipping" label="配送信息">配送信息</el-tab-pane>
      <el-tab-pane name="invoice" label="发票信息">发票信息</el-tab-pane>
      <el-tab-pane name="sale" label="售后信息">售后信息</el-tab-pane>
      <el-tab-pane name="remark" label="备注信息">备注信息</el-tab-pane>
      <el-tab-pane name="operation" label="操作日志">操作日志</el-tab-pane>
    </el-tabs>
    <settlement :order="order"></settlement>
  </div>
</template>

<script>
import {getOrder} from "@/api/order/index";
import goods from "./components/goods";
import pay from "./components/pay";
import settlement from "./components/settlement";
import closeDeactivatedVNode from "@/mixins/closeDeactivatedVNode";

export default {
  name: "orderList",
  components: {goods, pay, settlement},
  mixins: [closeDeactivatedVNode],
  data() {
    return {
      active: 'goods',
      activeName: 'goods',
      order: {
        orderCode: undefined
      }
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      let orderCode = this.$route.query.orderCode || undefined;
      this.order.orderCode = orderCode;
      this.getInfo();
    },
    getInfo() {
      if (this.order.orderCode) {
        getOrder(this.order.orderCode).then(res => {
          this.order = res.data;
          // 首次加载商品明细
          this.$nextTick(() => {
            this.$refs['orderGoods'].init(this.order.orderCode);
          });
        });
      }
    },
    handleClick(tab, event) {
      if (this.activeName == tab.name) {
        return;
      }
      this.$nextTick(() => {
        if (tab.name == 'goods') {
          this.$refs['orderGoods'].init(this.order.orderCode);
        } else if (tab.name == 'pay') {
          this.$refs['orderPay'].init(this.order.id);
        } else if (tab.name == 'third') {
          this.$refs['order-aging'].getDataList();
        }
        this.activeName = tab.name;
      });
    }
  }
};
</script>

<style lang="scss">

.detail-info {
  .el-col {
    min-width: 320px;
    margin-bottom: 10px;
  }
}

.detail-text {
  float: left;
}

.detail-label {
  width: 100px;
  text-align: right;
  padding-right: 10px;
  color: #58666e;
}
</style>
