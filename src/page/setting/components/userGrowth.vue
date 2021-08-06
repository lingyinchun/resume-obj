<template>
    <div>
    <el-form :model="dataForm" ref="dataForm" label-width="200px">
        <el-form-item prop="dailyOnline" label="每日获取上限"
            :rules="[
            { required: true, message: '请输入每日获取上限', trigger: 'blur' },
            ]"
        >
            <el-input-number v-model="dataForm.dailyOnline" :precision="0" :min="0" :max="9999999999"></el-input-number>
            <span style="color: #909399;">（设为0表示不限制）</span>
        </el-form-item>
        <el-form-item prop="proportion" label="消费额与赠送成长值比例"
            :rules="[
            { required: true, message: '请输入消费额与赠送成长值比例', trigger: 'blur' },
            ]"
        >
            <el-input-number v-model="dataForm.proportion" :precision="0" :min="0" :max="100"></el-input-number>
            <span style="margin-left: 5px;">%</span>
            <span style="color: #909399;">（例：设置10%，则消费10元赠送1成长值；取整数位积分）</span>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('dataForm')">提交</el-button>
            <el-button @click="resetForm('dataForm')">重置</el-button>
        </el-form-item>
        </el-form>
    </div>
</template>

<script>
  import { setDictionary, getUserGrowth } from '@/api/setting/rule'
  export default {
    name: 'settingUserGrowth',
    data() {
        return {
            dataForm: {
                dailyOnline: undefined,
                proportion: undefined,
            },
        }
    },
    created() {
        this.getDataList();
    },
    methods: {
        getDataList() {
            getUserGrowth().then((res) => {
                res.data.forEach(item => {
                    if(item.dictKey == 'USER_GROWTH_DAILY_ONLINE') {
                        this.dataForm.dailyOnline = Number(item.dictValue);
                    } else if(item.dictKey == 'USER_GROWTH_PROPORTION') {
                        this.dataForm.proportion = Number(item.dictValue);
                    }
                });
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = [
                        {dictKey: 'USER_GROWTH_DAILY_ONLINE', dictValue: this.dataForm.dailyOnline},
                        {dictKey: 'USER_GROWTH_PROPORTION', dictValue: this.dataForm.proportion},
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
