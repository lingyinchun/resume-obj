<template>
  <div class="app-container">
    <el-row>
      <div class="table-body">
        <div class="app-search">
          <el-card class="box-card" v-loading="loading">
            <el-divider content-position="left">前台类目配置</el-divider>
            <el-form :inline="true" size="small" :model="dataForm" :rules="dataRule" class="demo-form-inline"
                     ref="dataForm">
              <el-form-item label="渠道" prop="dictValue">
                <el-select v-model="dataForm.dictValue" @change="changeDict">
                  <el-option v-for="item in dictionaryList" :key="item.dictValue" :label="item.dictDesc"
                             :value="item.dictValue"/>
                </el-select>
              </el-form-item>
              <el-form-item label="类目树" prop="categoryId">
                <el-select v-model="dataForm.categoryId">
                  <el-option v-for="item in rootGoodsCategoryList" :key="item.id" :label="item.categoryName"
                             :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="save">设置</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </div>
    </el-row>
  </div>
</template>

<script>
import {getRootGoodsCategory} from '@/api/goods/category'
import {dictionaryGet, saveCategory} from '@/api/setting/rule'
import closeDeactivatedVNode from "@/mixins/closeDeactivatedVNode";

export default {
  mixins: [closeDeactivatedVNode],
  data() {
    return {
      loading: false,
      pathUrl: 'setting/receptionCategory',
      dataForm: {
        dictValue: '',
        categoryId: ''
      },
      dictionaryList: [],
      rootGoodsCategoryList: [],
      dataRule: {
        dictValue: [
          {required: true, message: '请选择', trigger: 'change'}
        ],
        categoryId: [
          {required: true, message: '请选择', trigger: 'change'}
        ],
      }
    }
  },
  async mounted() {
    await getRootGoodsCategory({
      "pageNo": 1,
      "pageSize": 1000,
      "categoryType": 1,
      "isEnable": 1,
      "orderBy": "id desc"
    }).then((res) => {
      if (res.code === 200) {
        this.rootGoodsCategoryList = res.data
      }
    })
    await this.dictionaryGetFn()
  },
  methods: {
    dictionaryGetFn(val) {
      this.loading = true
      let params = 'CATEGORY_CHANNEL';
      if (val) params = `${params}_${val}`
      dictionaryGet(params).then((res) => {
        this.loading = false
        if (res.code === 200) {
          if (!val) {
            this.dictionaryList = res.data
            if (this.dictionaryList && this.dictionaryList.length > 0) {
              this.dataForm.dictValue = this.dictionaryList[0].dictValue
              this.dictionaryGetFn(this.dictionaryList[0].dictValue)
            }
          } else {
            if (res.data && res.data.length > 0) {
              this.dataForm.categoryId = parseInt(res.data[0].dictValue)
            }
          }
        }
      })
    },
    save() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const item = this.dictionaryList.filter((v) => {
            return v.dictValue === this.dataForm.dictValue
          })[0]
          const params = {
            dictKey: `${item.dictKey}_${item.dictValue}`,
            dictDesc: item.dictValue,
            dictValue: this.dataForm.categoryId
          }
          saveCategory(params).then((res) => {
            if (res.code === 200) {
              this.$baseMessage('保存成功', 'success')
            }
          })
        }
      })
    },
    changeDict(val) {
      this.dictionaryGetFn(val)
    }
  }
}
</script>

<style lang="scss" scoped>
.table-body {
  padding: 40px 20px;
}
</style>
