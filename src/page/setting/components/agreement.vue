<template>
  <div>
    <el-form :model="dataForm" ref="dataForm" label-width="120px">
      <el-form-item label="隐私政策" prop="USER_PRIVACY_POLICY" :rules="[
        { required: true, message: '请输入隐私政策', trigger: 'blur' },
        ]">
        <MyTinymce v-model="dataForm.USER_PRIVACY_POLICY"/>
      </el-form-item>
      <el-form-item label="注册协议" prop="USER_SERVICE_AGREEMENT" :rules="[
        { required: true, message: '请输入注册协议', trigger: 'blur' },
        ]">
        <MyTinymce v-model="dataForm.USER_SERVICE_AGREEMENT"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('dataForm')">提交</el-button>
        <el-button @click="resetForm('dataForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import MyTinymce from "@/components/MyTinymce";
import { getPrivacyPolicyAndServiceAgreement, setDictionary } from '@/api/setting/rule'

export default {
  name: 'settingUserIntegral',
  components: { MyTinymce },
  data() {
    return {
      dataForm: {
        USER_PRIVACY_POLICY: '',
        USER_SERVICE_AGREEMENT: ''
      },
    }
  },
  methods: {
    getDataList() {
      getPrivacyPolicyAndServiceAgreement().then((res) => {
        res.data.forEach(item => {
          if (item.dictKey == 'USER_PRIVACY_POLICY' && item.dictValue) {
            this.dataForm.USER_PRIVACY_POLICY = item.dictValue;
          } else if (item.dictKey == 'USER_SERVICE_AGREEMENT' && item.dictValue) {
            this.dataForm.USER_SERVICE_AGREEMENT = item.dictValue;
          }
        });
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = [
            {dictKey: 'USER_PRIVACY_POLICY', dictValue: this.dataForm.USER_PRIVACY_POLICY},
            {dictKey: 'USER_SERVICE_AGREEMENT', dictValue: this.dataForm.USER_SERVICE_AGREEMENT},
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
