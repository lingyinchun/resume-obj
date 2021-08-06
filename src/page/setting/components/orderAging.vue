<template>
    <div>
    <el-form :model="dataForm" ref="dataForm" label-width="240px">
        <el-form-item prop="cancelTime" label="订单取消时间">
            <el-input-number v-model="dataForm.cancelTime" :precision="0" :min="0" :max="99999999" style="width: 240px;"></el-input-number>
            <span style="color: #909399;">（未付款订单取消的时间间隔，单位为<span style="color: #ff0000;">分钟</span>，默认15分钟）</span>
        </el-form-item>
        <el-form-item prop="confirmReceiptTime" label="订单确认收货时间">
            <el-input-number v-model="dataForm.confirmReceiptTime" :precision="0" :min="0" :max="100" style="width: 240px;"></el-input-number>
            <span style="color: #909399;">（发货后的订单自动确认收货时间间隔，单位为<span style="color: #ff0000;">天</span>，默认14天）</span>
        </el-form-item>
        <el-form-item prop="autoEvaluationTime" label="订单自动评价时间">
            <el-input-number v-model="dataForm.autoEvaluationTime" :precision="0" :min="0" :max="100" style="width: 240px;"></el-input-number>
            <span style="color: #909399;">（确认收货后的订单自动评价时间间隔，单位为<span style="color: #ff0000;">天</span>，默认7天）</span>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('dataForm')">提交</el-button>
            <el-button @click="resetForm('dataForm')">重置</el-button>
        </el-form-item>
        </el-form>
    </div>
</template>

<script>
  import { setOrderDictionary, getOrderAging } from '@/api/setting/rule'
  export default {
    name: 'settingUserIntegral',
    data() {
        return {
            dataForm: {
                cancelTime: undefined,
                confirmReceiptTime: undefined,
                autoEvaluationTime: undefined,
            },
        }
    },
    created() {
    },
    methods: {
        getDataList() {
            getOrderAging().then((res) => {
                res.data.forEach(item => {
                    if(item.dictKey == 'ORDER_CANCEL_TIME' && item.dictValue) {
                        this.dataForm.cancelTime = Number(item.dictValue);
                    } else if(item.dictKey == 'ORDER_CONFIRM_RECEIPT_TIME' && item.dictValue) {
                        this.dataForm.confirmReceiptTime = Number(item.dictValue);
                    } else if(item.dictKey == 'ORDER_AUTO_EVALUATION_TIME' && item.dictValue) {
                        this.dataForm.autoEvaluationTime = Number(item.dictValue);
                    }
                });
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = [
                        {dictKey: 'ORDER_CANCEL_TIME', dictValue: this.dataForm.cancelTime == undefined ? '' : this.dataForm.cancelTime},
                        {dictKey: 'ORDER_CONFIRM_RECEIPT_TIME', dictValue: this.dataForm.confirmReceiptTime == undefined ? '' : this.dataForm.confirmReceiptTime},
                        {dictKey: 'ORDER_AUTO_EVALUATION_TIME', dictValue: this.dataForm.autoEvaluationTime == undefined ? '' : this.dataForm.autoEvaluationTime},
                    ];
                    setOrderDictionary(data).then((res) => {
                        this.$baseMessage('保存成功', 'success')
                    });
                } else {
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
    }
}

</script>

<style lang="scss" scoped>
</style>
