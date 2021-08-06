<template>
    <el-card style="margin-top: 20px;">
        <div slot="header">
            <span>结算明细</span>
        </div>
        <div class="settlement-detail">
            <el-row>
                <div class="detail-text detail-label">商品原始金额合计</div>
                <div class="detail-text">￥{{order.goodsAmount}}</div>
            </el-row>
            <el-row style="margin-top: 10px;">
                <div class="detail-text detail-label">商品优惠金额</div>
                <div class="detail-text">￥{{order.promotionAmount}}</div>
            </el-row>
            <el-row style="margin-top: 10px;">
                <div class="detail-text detail-label">运费金额</div>
                <div class="detail-text">￥{{order.freightAmount}}</div>
            </el-row>
            <el-row style="margin-top: 10px;">
                <div class="detail-text detail-label">订单金额合计</div>
                <div class="detail-text">￥{{order.orderAmount}}</div>
            </el-row>
            <el-row style="margin-top: 20px;">
                <div class="detail-text detail-label" style="font-size: 16px;font-weight: 500">实收金额</div>
                <div class="detail-text" style="color: #ff0000; font-size: 16px;">￥{{order.payAmount}}</div>
            </el-row>
        </div>
    </el-card>
</template>

<script>
import { getOrder } from "@/api/order/index";
import { orderGoodsQuery } from "@/api/order/orderGoods";

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
        };
    },
    created() {
    },
    methods: {
    }
};
</script>

<style lang="scss" scoped>
    .settlement-detail {
        .detail-label {
            width: 200px;
            color: #888888;
        }
        .detail-text {
            font-size: 14px;
        }
    }
</style>