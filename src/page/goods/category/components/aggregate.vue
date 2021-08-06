<template>
  <el-row>
    <el-card shadow="hover">
      <div style="color:#666666;font-size: 15px">聚合后台类目，前台类目名：<el-tag>{{ jhData.categoryName }}</el-tag></div>
      <el-tabs>
        <el-tab-pane label="聚合类目">
          <el-row :span="24" :gutter="5">
            <el-col :span="11" >
              <el-row style="margin: 0 0 15px 0;">
                <el-input placeholder="输入关键字进行过滤" v-model="filterText" size="small" clearable></el-input>
              </el-row>
              <div style="width: 100%;max-height: 500px;overflow-y: scroll;margin-top: 8px;">
                <el-tree ref="tree" :data="dataList" node-key="id" :props="defaultProps" @node-click="nodeClick" :filter-node-method="filterNode"></el-tree>
              </div>
            </el-col>
            <el-col :span="13">
              <el-button style="float: right;" type="text" @click="deleteData">批量删除</el-button>
              <el-table
                  :data="tableData"
                  height="500"
                  border
                  style="width: 100%"
                  row-key="id"
                  @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection"
                    width="40">
                </el-table-column>
                <el-table-column
                    prop="leftName"
                    label="前台类目名称">
                </el-table-column>
                <el-table-column
                    prop="rightName"
                    label="后台类目名称">
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="聚合商品">
          <SelectGoodsCom :jhData="jhData"/>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </el-row>
</template>

<script>
import {goodsCategoryRelationAdd, goodsCategoryRelationGet, goodsCategoryRelationDel} from "@/api/goods/category";
import {getBackgroundTree} from '@/api/goods/category'
import SelectGoodsCom from './selectGoods'

export default {
  name: "aggregate",
  components: {SelectGoodsCom},
  props: {
    jhData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      dataList: [],
      tableData: [],
      defaultProps: {
        children: 'childCategoryList',
        label: 'categoryName',
        isLeaf: 'isLeaf'
      },
      id: '',
      selectTable: [],
      openDialog: false,
      filterText: ''
    }
  },
  watch: {
    'jhData': {
      deep: true,
      handler(newval) {
        this.getTable()
      }
    },
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.init()
    this.getTable()
  },
  methods: {
    init() {
      getBackgroundTree().then((res) => {
        if (res.code === 200) {
          this.dataList = res.data
        }
      })
    },
    getTable() {
      if (!this.jhData.id) {
        return
      }
      goodsCategoryRelationGet(this.jhData.id).then((res) => {
        if (res.code === 200) {
          this.tableData = res.data
        }
      })
    },
    nodeClick(data, node) {
      const t = this;
      if (this.jhData.id) {
        console.log('nodeClick', data, node)
        if (!data.childCategoryList) {
          const params = {
            leftId: this.jhData.id,
            leftName: this.jhData.categoryName,
            rightId: data.id,
            rightName: data.categoryName
          }
          // 给出提示
          t.$confirm(`是否聚合该 ${data.categoryName} 类目？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            goodsCategoryRelationAdd(params).then((res) => {
              if (res.code === 200) {
                t.$message({
                  type: 'success',
                  message: '聚合成功!'
                })
                t.getTable()
              }
            })
          }).catch(() => {
          })
        }
      }
    },
    handleSelectionChange(val) {
      this.selectTable = val
    },
    deleteData() {
      if (!this.selectTable || this.selectTable.length === 0) {
        return
      }
      const params = this.selectTable.map((v) => {
        return v.id
      })
      goodsCategoryRelationDel(params).then((res) => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.getTable()
        }
      })
    },
    filterNode(value, data) {
      if(!value) return true
      return data.categoryName.indexOf(value) !== -1
    },
  }
}
</script>

<style lang="scss">
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
