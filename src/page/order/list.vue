<template>
    <div class="app-container">
        <div class="main-container" style="margin-top: 10px;">
            <div class="app-search">
                <el-form :inline="true" :model="search" ref="search">
                    <el-form-item label="订单编号" prop="orderCode">
                        <el-input v-model="search.orderCode" placeholder="订单编号" style="width: 220px;" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="外部订单编号" prop="outOrderCode">
                        <el-input v-model="search.outOrderCode" placeholder="外部订单编号" style="width: 250px;" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="商品编码" prop="skuCode">
                        <el-input v-model="search.skuCode" placeholder="商品编码" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="商品名称" prop="goodsName">
                        <el-input v-model="search.goodsName" placeholder="商品名称" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="下单时间">
                        <el-date-picker
                        v-model="search.createTime" type="datetimerange" :picker-options="pickerOptions"
                        range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" align="right"
                        @change="changeDate" value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="订单状态" prop="orderStatus">
                        <el-select v-model="search.orderStatus" placeholder="订单状态" clearable style="width: 120px;">
                            <el-option v-for="item in orderStatusList" :label="item.dictDesc"
                                :value="item.dictValue" :key="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <div v-show="moreSearchFlag" style="display: inline-block;">
                        <el-form-item label="收货人地址" prop="provinceCode">
                            <el-select v-model="search.provinceCode" placeholder="选择省" clearable
                                style="width: 120px;" @change="provinceChange">
                                <el-option v-for="item in provinceList" :label="item.addressName"
                                    :value="item.addressCode" :key="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="" prop="cityCode">
                            <el-select v-model="search.cityCode" placeholder="选择市" clearable
                                style="width: 120px;" @change="cityChange">
                                <el-option v-for="item in cityList" :label="item.addressName"
                                    :value="item.addressCode" :key="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="" prop="regionCode">
                            <el-select v-model="search.regionCode" placeholder="选择区" clearable style="width: 120px;">
                                <el-option v-for="item in regionList" :label="item.addressName"
                                    :value="item.addressCode" :key="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="收货人" prop="consignee">
                            <el-input v-model="search.consignee" placeholder="收货人" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="收货手机" prop="mobile">
                            <el-input v-model="search.mobile" placeholder="收货手机" clearable></el-input>
                        </el-form-item>
                    </div>
                    <el-row style="text-align: center;">
                        <el-button type="primary" icon="el-icon-search" @click="getDataList()" size="small">查询</el-button>
                        <el-button icon="el-icon-refresh-left"  @click="resetForm('search')" size="small">重置</el-button>
                        <el-button @click="moreSearchFlag = !moreSearchFlag"
                            size="small">更多查询条件<i :class="moreSearchFlag ? 'el-icon-arrow-up el-icon--right' : 'el-icon-arrow-down el-icon--right'"></i></el-button>
                    </el-row>
                </el-form>
                <el-table :data="dataList"
                    row-key="id" border size="small" style="margin-top: 20px;">
                    <el-table-column label="订单编号" prop="orderCode"></el-table-column>
                    <el-table-column label="下单时间" prop="createTime"></el-table-column>
                    <el-table-column label="订单总金额">
                        <template slot-scope="scope">
                            ￥{{scope.row.orderAmount}}
                        </template>
                    </el-table-column>
                    <el-table-column label="订单状态" prop="orderStatusDesc"></el-table-column>
                    <el-table-column label="是否开发票">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.isNeedInvoice" type="success">是</el-tag>
                            <el-tag v-else type="info">否</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100" fixed="right">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" @click="handleInfo(scope.row.orderCode)">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
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
  import { orderQuery, getOrderStatus } from '@/api/order/index'
  import { getByParentCode } from '@/api/operation/address'
  import { getPickerOptions } from '@/utils'
  import closeDeactivatedVNode from "@/mixins/closeDeactivatedVNode";

  export default {
    name: 'orderList',
    mixins: [closeDeactivatedVNode],
    data() {
        return {
            // 日期快捷选项
            pickerOptions: getPickerOptions(),
            moreSearchFlag: false,
            layout: 'total, sizes, prev, pager, next, jumper',
            search: {
                pageNo: 1,
                pageSize: 10,
                orderCode: undefined,
                outOrderCode: undefined,
                skuCode: undefined,
                goodsName: undefined,
                createTime: undefined,
                createTimeFrom: undefined,
                createTimeTo: undefined,
                orderStatus: undefined,
                provinceCode: undefined,
                cityCode: undefined,
                regionCode: undefined,
                consignee: undefined,
                mobile: undefined,
            },
            orderStatusList: [],
            dataList: [],
            total: 0,
            provinceList: [],
            cityList: [],
            regionList: [],
        }
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            this.getOrderStatusList();
        },
        getOrderStatusList() {
            getOrderStatus().then((res) => {
                this.orderStatusList = res.data;
                this.getProvinceList();
                this.getDataList();
            });
        },
        async getProvinceList() {
            const {data} = await getByParentCode('100000');
            this.provinceList = data;
        },
        async provinceChange(val) {
            if(val) {
                const {data} = await getByParentCode(val);
                this.cityList = data;
            }
            this.search.cityCode = undefined;
            this.search.regionCode = undefined;
        },
        async cityChange(val) {
            if(val) {
                const {data} = await getByParentCode(val);
                this.regionList = data;
            }
            this.search.regionCode = undefined;
        },
        async getDataList() {
            const { data } = await orderQuery(this.search);
            this.dataList = data.records;
            this.total = data.totalRecords;
        },
        handleInfo(orderCode) {
            this.$router.push({path: `/order/detail`, query: {orderCode: orderCode}})
        },
        // 修改状态
        statusChange(obj) {
            let data = {id: obj.id, isEnable: obj.isEnable};
            goodsCategoryUpdateStatus(data).then((res) => {
                this.$baseMessage('修改成功', 'success')
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.search.createTime = [];
            this.search.createTimeFrom = undefined;
            this.search.createTimeTo = undefined;
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
    }
}

</script>

<style lang="scss" scoped>

</style>
