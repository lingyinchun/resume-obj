<template>
    <div>
        <el-row>
            <el-input v-model="search.skuCode" style="width: 240px;" placeholder="商品编码"
                      @keyup.enter.native="getDataList">
                <el-button slot="append" icon="el-icon-search" @click="getDataList"></el-button>
            </el-input>
        </el-row>
        <el-table :data="dataList" border style="margin-top: 15px;">
            <el-table-column type="index" label="行号" width="60"></el-table-column>
            <el-table-column label="商品名称" prop="goodsName"></el-table-column>
            <el-table-column label="商品编码" prop="skuCode" width="120"></el-table-column>
            <el-table-column label="商品单位" prop="goodsUnit" width="100"></el-table-column>
            <el-table-column label="购买数量" prop="goodsNumber" width="100"></el-table-column>
            <el-table-column label="购买单价" prop="goodsPrice" width="120"></el-table-column>
            <el-table-column label="商品金额" prop="totalAmount" width="120"></el-table-column>
            <el-table-column label="支付金额" prop="payAmount" width="120"></el-table-column>
            <el-table-column label="优惠金额" prop="promotionAmount" width="120"></el-table-column>
            <el-table-column label="运费金额" prop="freightAmount" width="120"></el-table-column>
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
            style="margin: 20px 0 10px 0;"
        ></el-pagination>
    </div>
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
            layout: 'total, sizes, prev, pager, next, jumper',
            search: {
                pageNo: 1,
                pageSize: 10,
                orderCode: undefined,
                skuCode: undefined,
            },
            dataList: [],
            total: 0,
        };
    },
    created() {
    },
    methods: {
        init(orderCode) {
            this.search.orderCode = orderCode;
            this.getDataList();
        },
        getDataList() {
            orderGoodsQuery(this.search).then((res) => {
                this.dataList = res.data.records || [];
                this.total = res.data.totalRecords;
            });
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