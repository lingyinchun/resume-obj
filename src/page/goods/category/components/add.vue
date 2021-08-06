<template>
  <div>
    <el-form :model="dataForm" :rules="dataRule" :disabled="operateType==1 && !dataForm.id" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="110px">
      <el-form-item label="类目名称" prop="categoryName">
        <el-input v-model="dataForm.categoryName" maxLength="10" placeholder="请输入类目名称"></el-input>
      </el-form-item>
      <el-form-item label="类目编码" prop="categoryCode">
        <el-input v-model="dataForm.categoryCode" placeholder="请输入类目编码"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="categoryType" v-if="visible">
        <el-select v-model="dataForm.categoryType" placeholder="类型">
          <el-option label="导航类目" :value="1"></el-option>
          <el-option label="展示类目" :value="2"></el-option>
          <el-option label="其他类目" :value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="链接地址" prop="urlAddress" v-if="dataForm.categoryType == 1">
        <el-input v-model="dataForm.urlAddress" placeholder="请输入链接地址"></el-input>
      </el-form-item>
      <el-form-item label="是否启用" prop="isEnable">
        <el-switch v-model="dataForm.isEnable"></el-switch>
      </el-form-item>
      <el-form-item label="图片" v-if="dataForm.isLeaves">
        <UploadImage :actUrl="apiUrl" v-model="dataForm.image"/>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import UploadImage from "@/components/UploadImage";
import {goodsCategoryAddOrUpdate, goodsCategoryGet} from '@/api/goods/category'

export default {
  name: 'goodsCategoryAdd',
  props: ['operateType'],
  components: {UploadImage},
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入名称'));
      } else {
        const reg = /[\-]+/g;
        if (reg.test(this.dataForm.categoryName)) {
          callback(new Error('名称里不能出现 - 字符'));
        }else{
          callback();
        }
      }
    };
    return {
      visible: true,
      apiUrl: '/mall-api/file-m/m/file/upload',
      dataForm: {
        id: undefined,
        parentId: 0,
        categoryName: undefined,
        categoryCode: undefined,
        categoryType: undefined,
        urlAddress: undefined,
        isEnable: true,
        image: []
      },
      dataRule: {
        categoryName: [
          {required: true, validator: validatePass, trigger: 'blur'}
        ],
        categoryCode: [
          {required: true, message: '请输入类目编码', trigger: 'blur'}
        ],
        categoryType: [
          {required: true, message: '请选择类目类型', trigger: 'blur'}
        ],
        urlAddress: [
          {required: true, message: '请输入链接地址', trigger: 'blur'}
        ],
        isEnable: [
          {required: true, message: '请选择是否启用', trigger: 'blur'}
        ],
      },
    }
  },
  methods: {
    init(id, parentId) {
      if (id != this.dataForm.id) {
        console.log('变更id');
      }
      this.dataForm.id = id || undefined;
      this.dataForm.parentId = parentId || 0;
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields();
        this.getDataInfo();
      })
    },
    getDataInfo() {
      if (this.dataForm.id || this.dataForm.parentId) {
        this.visible = false;
      }
      if (this.dataForm.id) {
        console.log('value', this.dataForm.id);
        goodsCategoryGet(this.dataForm.id).then((res) => {
          this.dataForm = res.data;
          if(res.data.categoryPicture){
            const list = []
            list.push({name:'name',url:res.data.categoryPicture})
            this.dataForm.image = list
          }
        });
      }
    },
    // 表单提交
    dataFormSubmit() {
      console.log(this.dataForm)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const params = Object.assign({}, this.dataForm)
          if(this.dataForm.image && this.dataForm.image.length>0){
            params.categoryPicture = this.dataForm.image[0].url
          }
          goodsCategoryAddOrUpdate(params).then((res) => {
            this.$baseMessage('保存成功', 'success')
            this.$emit('refreshDataList', this.dataForm);
          });
        }
      })
    },
  }
}
</script>
