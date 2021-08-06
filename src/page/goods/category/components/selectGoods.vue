<template>
  <el-row>
    <el-button type="text" @click="openFn">选择商品</el-button>
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
          prop="goodsName"
          label="商品名称">
      </el-table-column>
    </el-table>
    <div style="text-align: right">
      <el-pagination
          v-show="total > 0"
          background
          :current-page="search.pageNo"
          :page-size="search.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog title="选择商品" :visible.sync="openDialog" width="1000px" append-to-body :close-on-click-modal="false"
               :close-on-press-escape="false">
      <SelectQueryGoodsList :checkMore="true" :multioleSelectionData.sync="multioleSelectionData" @selectItem="selectItem" @close="openDialog=false"/>
    </el-dialog>
  </el-row>
</template>

<script>
import {
  goodsCategoryGoodsAdd,goodsCategoryGoodsDel,goodsCategoryGoodsGet,goodsCategoryGoodsQuery
} from "@/api/goods/category";
import SelectQueryGoodsList from "@/components/SelectQueryGoodsList";

export default {
  name: "aggregate",
  components: {SelectQueryGoodsList},
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
      id: '',
      selectTable: [],
      openDialog: false,
      multioleSelectionData: [],
      total: 0,
      search: {
        leftId: '',
        pageNo: 1,
        pageSize: 10,
      }
    }
  },
  watch: {
    'jhData': {
      deep: true,
      handler(newval) {
        if (this.jhData.id) {
          this.getTable()
          this.getIdList()
        }
      }
    }
  },
  created() {
    if (this.jhData.id) {
      this.getTable()
      this.getIdList()
    }
  },
  methods: {
    getIdList() {
      return new Promise((resolve,reject)=>{
        // 获取已选择的 id
        goodsCategoryGoodsGet(this.jhData.id).then((res) => {
          if (res.code === 200) {
            // this.tableData = res.data
            this.multioleSelectionData = res.data || []
          }
          resolve(200)
        }).catch(()=>{
          reject(0)
        })
      })
    },
    getTable() {
      this.search.leftId = this.jhData.id
      goodsCategoryGoodsQuery(this.search).then((res) => {
        if (res.code === 200) {
          this.total = res.data.totalRecords
          this.tableData = res.data.records
        }
      })
    },
    handleSizeChange(val) {
      this.search.pageSize = val
      this.getTable()
    },
    handleCurrentChange(val) {
      this.search.pageNo = val
      this.getTable()
    },
    handleSelectionChange(val) {
      this.selectTable = val
    },
    openFn(){
      this.getIdList().then((res)=>{
        this.openDialog = true
      })
    },
    deleteData() {
      if (!this.selectTable || this.selectTable.length === 0) {
        return
      }
      const params = this.selectTable.map((v) => {
        return v.id
      })
      goodsCategoryGoodsDel(params).then((res) => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.getTable()
        }
      })
    },
    selectItem(list) {
      const t = this;
      console.log('selectItem',list)
      // return
      if (this.jhData.id) {
        const params = {
          leftId: this.jhData.id,
          // leftName: this.jhData.categoryName,
          // goodsId: list[0].id,
          // goodsName: list[0].goodsName
          goodsIdList: list.map((v)=>{return v.id})
        }
        goodsCategoryGoodsAdd(params).then((res) => {
          if (res.code === 200) {
            t.$message({
              type: 'success',
              message: '操作成功!'
            })
            t.getTable()
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
</style>
