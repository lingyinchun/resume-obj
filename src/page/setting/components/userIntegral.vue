<template>
    <div>
    <el-form :model="dataForm" ref="dataForm" label-width="240px">
        <el-form-item prop="register" label="积分项目">
            <span style="padding-left: 100px;">赠送积分</span>
        </el-form-item>
        <el-form-item prop="register" label="会员注册">
            <el-input-number v-model="dataForm.register" :precision="0" :min="0" :max="9999999999" placeholder="请输入正整数积分" style="width: 240px;"></el-input-number>
        </el-form-item>
        <el-form-item prop="perfectInfo" label="会员首次完善资料奖励">
            <el-input-number v-model="dataForm.perfectInfo" :precision="0" :min="0" :max="100" placeholder="请输入正整数积分" style="width: 240px;"></el-input-number>
        </el-form-item>
        <el-form-item prop="sharePage" label="分享页面">
            <el-input-number v-model="dataForm.sharePage" :precision="0" :min="0" :max="100" placeholder="请输入正整数积分" style="width: 240px;"></el-input-number>
        </el-form-item>
        <el-form-item prop="sharePageDayMax" label="分享页面每个用户每天最多获取积分">
            <el-input-number v-model="dataForm.sharePageDayMax" :precision="0" :min="0" :max="100" placeholder="请输入正整数积分" style="width: 240px;"></el-input-number>
            <span style="color: #909399;">（不设置或设为0表示不限制）</span>
        </el-form-item>
        <el-form-item prop="proportion" label="消费额与赠送积分比例">
            <el-input-number v-model="dataForm.proportion" :precision="0" :min="0" :max="100" placeholder="请输入正整数比例" style="width: 240px;"></el-input-number>
            <span style="margin-left: 5px;">%</span>
            <span style="color: #909399;">（例：设置10%，则消费10元赠送1积分；取整数位积分）</span>
        </el-form-item>
        <el-form-item prop="single" label="每笔订单最多赠送积分">
            <el-input-number v-model="dataForm.single" :precision="0" :min="0" :max="100" placeholder="请输入正整数积分" style="width: 240px;"></el-input-number>
            <span style="color: #909399;">（例：设置100，则每笔订单赠送积分最多为100积分）</span>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('dataForm')">提交</el-button>
            <el-button @click="resetForm('dataForm')">重置</el-button>
        </el-form-item>
        </el-form>
    </div>
</template>

<script>
  import { setDictionary, getUserIntegral } from '@/api/setting/rule'
  export default {
    name: 'settingUserIntegral',
    data() {
        return {
            dataForm: {
                register: undefined,
                perfectInfo: undefined,
                sharePage: undefined,
                sharePageDayMax: undefined,
                proportion: undefined,
                single: undefined,
            },
        }
    },
    created() {
    },
    methods: {
        getDataList() {
            getUserIntegral().then((res) => {
                res.data.forEach(item => {
                    if(item.dictKey == 'USER_INTEGRAL_REGISTER' && item.dictValue) {
                        this.dataForm.register = Number(item.dictValue);
                    } else if(item.dictKey == 'USER_INTEGRAL_PERFECT_INFO' && item.dictValue) {
                        this.dataForm.perfectInfo = Number(item.dictValue);
                    } else if(item.dictKey == 'USER_INTEGRAL_SHARE_PAGE' && item.dictValue) {
                        this.dataForm.sharePage = Number(item.dictValue);
                    } else if(item.dictKey == 'USER_INTEGRAL_SHARE_PAGE_DAY_MAX' && item.dictValue) {
                        this.dataForm.sharePageDayMax = Number(item.dictValue);
                    } else if(item.dictKey == 'USER_INTEGRAL_PROPORTION' && item.dictValue) {
                        this.dataForm.proportion = Number(item.dictValue);
                    } else if(item.dictKey == 'USER_INTEGRAL_SINGLE' && item.dictValue) {
                        this.dataForm.single = Number(item.dictValue);
                    }
                });
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = [
                        {dictKey: 'USER_INTEGRAL_REGISTER', dictValue: this.dataForm.register == undefined ? '' : this.dataForm.register},
                        {dictKey: 'USER_INTEGRAL_PERFECT_INFO', dictValue: this.dataForm.perfectInfo == undefined ? '' : this.dataForm.perfectInfo},
                        {dictKey: 'USER_INTEGRAL_SHARE_PAGE', dictValue: this.dataForm.sharePage == undefined ? '' : this.dataForm.sharePage},
                        {dictKey: 'USER_INTEGRAL_SHARE_PAGE_DAY_MAX', dictValue: this.dataForm.sharePageDayMax == undefined ? '' : this.dataForm.sharePageDayMax},
                        {dictKey: 'USER_INTEGRAL_PROPORTION', dictValue: this.dataForm.proportion == undefined ? '' : this.dataForm.proportion},
                        {dictKey: 'USER_INTEGRAL_SINGLE', dictValue: this.dataForm.single == undefined ? '' : this.dataForm.single},
                    ];
                    setDictionary(data).then((res) => {
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
