<template>
  <div class="app-container">
    <el-card
        class="box-card"
        shadow="never"
        style="border: 0"
        body-style="background-color: #f3f3f3;padding: 10px 0 0;"
    >
      <div slot="header">
        <span>类目列表</span>
        <div style="float: right; margin: -5px 0">
          <el-button type="primary" size="small" icon="el-icon-plus" plain @click="handleAdd(null, 1)">新增类目</el-button>
        </div>
      </div>
    </el-card>
    <div class="main-container">
      <div class="app-search">
        <el-form :inline="true" :model="search" ref="search">
          <el-form-item label="类目id" prop="id">
            <el-input v-model="search.id" placeholder="类目id" clearable></el-input>
          </el-form-item>
          <el-form-item label="类目名称" prop="categoryName">
            <el-input v-model="search.categoryName" placeholder="类目名称" maxLength="10" clearable></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="categoryType">
            <el-select v-model="search.categoryType" placeholder="类型" clearable style="width: 120px;">
              <el-option label="导航类目" :value="1"></el-option>
              <el-option label="展示类目" :value="2"></el-option>
              <el-option label="后台类目" :value="3"></el-option>
              <el-option label="其他类目" :value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="isEnable">
            <el-select v-model="search.isEnable" placeholder="状态" clearable style="width: 100px;">
              <el-option label="启用" :value="1"></el-option>
              <el-option label="停用" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="getDataList()" size="small">查询</el-button>
              <el-button icon="el-icon-refresh-left" @click="resetForm('search')" size="small">重置</el-button>
            </el-form-item>
          </el-form-item>
        </el-form>
        <el-table :data="dataList" row-key="id" border size="small">
          <el-table-column label="id" prop="id" width="80"></el-table-column>
          <el-table-column label="类目类型" width="120" prop="categoryTypeDesc"></el-table-column>
          <el-table-column label="类目名称" prop="categoryName"></el-table-column>
          <el-table-column label="类目编码" prop="categoryCode"></el-table-column>
          <el-table-column label="状态" width="100">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isEnable" @change="statusChange(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime" width="180"></el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handleEdit(scope.row.id)">编辑</el-button>
              <el-button size="mini" type="text" @click="handleDelete(scope.row.id)" v-if="scope.row.categoryType != 3"
                         style="color: #f56c6c;">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog title="新增类目" :close-on-click-modal="false" :visible.sync="addVisible" width="500px"
               :close-on-press-escape="false">
      <category-add ref="categoryAdd" @refreshDataList="getDataList"></category-add>
    </el-dialog>
  </div>
</template>

<script>
import {getRootGoodsCategory, goodsCategoryUpdateStatus, goodsCategoryDelete} from '@/api/goods/category'
import categoryAdd from './components/add'
import closeDeactivatedVNode from '@/mixins/closeDeactivatedVNode'

export default {
  name: 'goodsCategoryList',
  components: {categoryAdd},
  mixins: [closeDeactivatedVNode],
  data() {
    return {
      addVisible: false,
      search: {
        pageNo: 1,
        pageSize: 10,
        id: undefined,
        categoryName: undefined,
        categoryType: undefined,
        isEnable: undefined,
        orderBy: 'id desc',
      },
      dataList: [],
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getDataList();
    },
    async getDataList() {
      this.addVisible = false;
      const {data} = await getRootGoodsCategory(this.search);
      this.dataList = data;
    },
    handleAdd() {
      this.addVisible = true;
      this.$nextTick(() => {
        this.$refs.categoryAdd.init();
      })
    },
    handleEdit(id) {
      this.$router.push({path: `/goods/category/edit`, query: {id: id}})
    },
    // 删除广告
    handleDelete(id) {
      this.$confirm('确认要删除此类目吗？').then(_ => {
        goodsCategoryDelete(id).then((res) => {
          this.$baseMessage('删除成功', 'success')
          this.getDataList();
        });
      }).catch(_ => {
      });
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
      this.getDataList()
    }
  }
}

</script>

<style lang="scss" scoped>

.edit-sort-number {
  margin-left: 10px;
  cursor: pointer;
}
</style>
