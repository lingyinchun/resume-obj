<template>
  <div class="app-container">
    <el-card
      class="box-card"
      shadow="never"
      style="border: 0"
      body-style="background-color: #f3f3f3;padding: 10px 0 0;"
    >
      <div slot="header">
        <span>查看明细</span>
      </div>
    </el-card>

    <div class="table-body">
      <div class="app-search">
        <div flex="dir:left cross-center">
          <div class="div-box" flex="cross-center">
            <el-form :inline="true" ref="dynamicValidateForm" :model="search" class="demo-form-inline" size="small">
              <el-form-item label="操作人员" prop="updateName">
                <el-input v-model="search.updateName" style="width:120px;"/>
              </el-form-item>
              <el-form-item label="变动类型" prop="growthSource">
                <el-select v-model="search.growthSource">
                  <el-option label="购物" :value="1"></el-option>
                  <el-option label="退款" :value="2"></el-option>
                  <el-option label="人工操作" :value="3"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="变更时间" prop="createTime">
                <el-date-picker
                  v-model="search.createTime" type="datetimerange" :picker-options="pickerOptions"
                  range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" align="right"
                  @change="changeDate" value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>

      <el-table
        ref="multipleTable"
        :data="data"
        row-key="id"
        border
        size="small"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column label="成长值变动详情" prop="id">
          <template slot-scope="scope">
            <span v-if="scope.row.growthSource===1">购物</span>
            <span v-if="scope.row.growthSource===2">退款</span>
            <span v-if="scope.row.growthSource===3">人工操作</span>
          </template>
        </el-table-column>
        <el-table-column label="动态值" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span v-if="scope.row.deductionFlag == 2">
              <el-popover
                placement="top-start"
                title="备注"
                width="200"
                trigger="hover"
                :content="scope.row.operationReason">
                <span slot="reference"><i class="el-icon-minus"/>{{scope.row.growthValue}} <IconTem :icon="'questionfill'" :fontSize="15"/></span>
              </el-popover>
            </span>

            <span v-if="scope.row.deductionFlag == 1"><i class="el-icon-plus"/>{{ scope.row.growthValue }}</span>
          </template>
        </el-table-column>
        <el-table-column label="变动时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作人员">
          <template slot-scope="scope">
            <span>{{ scope.row.updateUserName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="当前成长值">
          <template slot-scope="scope">
            <span>{{ scope.row.totalGrowthValue }}</span>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-show="total > 0"
        background
        :current-page="search.pageNo"
        :page-size="search.pageSize"
        :layout="layout"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>

    <!-- 新增或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false">
      <div>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="等级编码" prop="levelCode">
            <el-input v-model="form.levelCode" placeholder="请输入等级编码" />
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import {
    getList
  } from '@/api/vip/growthValue'
  // import { getTree } from '@/api/system/depart'
  import { getPickerOptions } from '@/utils'
  // 权限判断指令
  import permission from '@/directive/permission/index'
  import closeDeactivatedVNode from "@/mixins/closeDeactivatedVNode";

  export default {
    name: 'grade',
    directives: { permission },
    mixins: [closeDeactivatedVNode],
    data() {
      return {
        data: [],
        title: '',
        pickerOptions: getPickerOptions(),
        // 是否显示弹出层
        open: false,
        datetime: undefined,
        roleTree: [],
        // 查询参数
        search: {
          pageNo: 1,
          pageSize: 10,
          updateName: undefined,
          growthSource: undefined,
          createTime: []
        },
        form:{

        },
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper',
        rules: []
      }
    },
    watch:{
      $route(val){
        if(this.$route.query.uniqueUserId!=this.search.uniqueUserId){
          console.log('变了',val)
          this.init()
        }
      }
    },
    computed: {
    },
    created() {
      // console.log('usergrowth', this.$route)
      this.init()
    },
    methods: {
      /** 初始化列表 */
      init() {
        this.search.uniqueUserId = this.$route.query.uniqueUserId
        this.fetchData()
      },
      changeDate() {
        let value = this.search.createTime
        if (value) {
          this.search.createTimeFrom = value[0]
          this.search.createTimeTo = value[1]
        } else {
          this.search.createTimeFrom = null
          this.search.createTimeTo = null
        }
        this.init()
      },
      fetchData() {
        this.listLoading = true
        getList(this.search).then((response) => {
          this.data = response.data.records || []
          this.total = response.data.totalRecords
          this.listLoading = false
        })
      },
      onSubmit() {
        this.fetchData()
      },
      resetForm(formName) {
        this.reset()
        this.$refs[formName].resetFields()
        this.fetchData()
      },
      reset() {
        this.search= {
          pageNo: 1,
          pageSize: 10,
          updateName: undefined,
          growthSource: undefined,
          createTime: [],
          createTimeFrom: null,
          createTimeTo: null
        }
      },
      handleSizeChange(val) {
        this.search.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.search.pageNo = val
        this.fetchData()
      }
    },
  }
</script>

<style lang="scss" scoped>

  .bgdiv{
    width: 60px;
    height: 23px;
    display: inline-block;
    border: 1px solid #eeeeee;
  }
  .f-tip{
    color:#999999;
    font-size: 12px;
  }
  .dialog-footer{
    text-align: center;
  }
  .vip-box{
    width: 343px;
    height: 180px;
    border-radius: 12px;
    box-sizing: border-box;
    padding: 17px 20px;
    color: #fff;
    position: relative;
    overflow: visible;
    margin: auto;
    ._22MG{
      font-size: 18px;
      line-height: 20px;
      font-weight: 700;
      -ms-flex-align: center;
      align-items: center;
      mix-blend-mode: screen;
    }
    ._3csP {
      padding-top: 30px;
      -ms-flex-align: baseline;
      align-items: baseline;
      font-weight: 500;
      display: flex;
      ._2_NN {
        font-size: 26px;
        margin-right: 8px;
      }
    }
    ._3XnZ {
      margin-top: 26px;
      width: 100%;
      height: 2px;
      background-color: hsla(0,0%,100%,.2);
      overflow: hidden;
    }
    ._5lfJ{
      padding-top: 20px;
      font-size: 12px;
    }
  }
</style>
