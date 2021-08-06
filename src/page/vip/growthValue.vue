<template>
  <div class="app-container">
    <el-card
      class="box-card"
      shadow="never"
      style="border: 0"
      body-style="background-color: #f3f3f3;padding: 10px 0 0;"
    >
      <div slot="header">
        <span>成长值流水</span>
        <!-- <div style="float: right; margin: -5px 0">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            plain
            @click="handleAdd"
          >
            新增等级
          </el-button>
        </div> -->
      </div>
    </el-card>

    <div class="table-body">
      <div class="app-search">
        <div flex="dir:left cross-center">
          <div class="div-box" flex="cross-center">
            <el-form :inline="true" ref="dynamicValidateForm" :model="search" class="demo-form-inline" size="small">
              <el-form-item label="会员手机号" prop="mobile">
                <el-input-number :controls="false" v-model="search.mobile"
                placeholder="手机号搜索" style="width:120px;"/>
              </el-form-item>
              <el-form-item label="成长值" prop="growthValueStart">
                <el-input-number :controls="false" v-model="search.growthValueStart" style="width:100px;"/>
              </el-form-item>
              <el-form-item label="" prop="growthValueEnd">
                -&nbsp;
                <el-input-number :controls="false" v-model="search.growthValueEnd" style="width:100px;"/>
              </el-form-item>
              <el-form-item>
                <el-button icon="el-icon-search" type="primary" @click="onSearch">查询</el-button>
                <el-button icon="el-icon-refresh-left" @click="resetForm('dynamicValidateForm')">重置</el-button>
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
        <el-table-column label="会员ID" prop="id">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="会员昵称" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.nickName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号">
          <template slot-scope="scope">
            <span>{{ scope.row.mobile }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="角色">
          <template slot-scope="scope">
            <el-tag size="small">{{ scope.row.roleName }}</el-tag>
          </template>
        </el-table-column> -->
        <el-table-column label="当前成长值">
          <template slot-scope="scope">
            <span>{{ scope.row.growthValue }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="rowUpdate(scope.row)"
            >
              变更
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="rowView(scope.row)"
            >
              查看明细
            </el-button>
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
    <el-dialog v-if="open" :visible.sync="open" title="变更成长值" width="500px" append-to-body :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false">
      <div style="width:90%;">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="变更类型" required>
            <el-select v-model="form.deductionFlag">
              <el-option label="发放" :value="1"></el-option>
              <el-option label="扣除" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="变更值" prop="growthValue">
            <el-input-number v-model="form.growthValue" :min="1" :max="9999999999" :controls="false" placeholder="请输入正整数" />
          </el-form-item>
          <el-form-item label="理由" :required="form.deductionFlag == 2">
            <el-input
              type="textarea"
              :rows="2"
              v-model="form.operationReason"
            >
            </el-input>
          </el-form-item>
        </el-form>
        <el-row>
          <el-col style="text-align:center;">
            <el-button @click="open=false" size="small">取消</el-button>
            <el-button type="primary" @click="onsubmit()" size="small">提交</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import {
    queryUserGrowth,
    addUserGrowth
  } from '@/api/vip/growthValue'
  // 权限判断指令
  import permission from '@/directive/permission/index'
  import closeDeactivatedVNode from "@/mixins/closeDeactivatedVNode";

  export default {
    name: 'growthValue',
    directives: { permission },
    mixins: [closeDeactivatedVNode],
    data() {
      return {
        data: [],
        title: '',
        // 是否显示弹出层
        open: false,
        datetime: undefined,
        roleTree: [],
        // 查询参数
        search: {
          pageNo: 1,
          pageSize: 10,
          mobile: undefined,
          growthValueEnd: undefined,
          growthValueStart: undefined
        },
        form:{
          deductionFlag: 1,
          operationReason: ''
        },
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper',
        rules: {
          growthValue: [
            { required: true, message: '请输入变更值', trigger: 'blur' }
          ],
          operationReason: [
            { required: true, message: '请输入', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
    },
    created() {
      // console.log('created 方法', this.$route)
      this.init()
    },
    methods: {
      /** 初始化列表 */
      init() {
        this.fetchData()
      },
      fetchData() {
        this.listLoading = true
        queryUserGrowth(this.search).then((response) => {
          this.data = response.data.records || []
          this.total = response.data.totalRecords
          this.listLoading = false
        })
      },
      onSearch() {
        this.fetchData()
      },
      resetForm(formName) {
        this.search.pageSize = 10
        this.search.pageNo = 1
        this.$refs[formName].resetFields()
        this.fetchData()
      },
      handleSizeChange(val) {
        this.search.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.search.pageNo = val
        this.fetchData()
      },
      rowView(row) {
        console.log('查看明细', row)
        this.$router.push({path: `/vip/userGrowth`, query: {uniqueUserId: row.uniqueUserId}})
      },
      rowUpdate(row) {
        console.log(row)
        this.form.uniqueUserId = row.uniqueUserId
        this.form.deductionFlag = 1
        this.open = true
      },
      onsubmit() {
        console.log(this.form)
        this.$refs['form'].validate((valid) => {
          if(this.form.deductionFlag == 2 && !this.form.operationReason){
            this.$baseMessage('请输入扣除理由', 'error')
            return
          }
          addUserGrowth(this.form).then((res)=>{
            if(res.code == 200){
              this.open = false
              this.form.uniqueUserId = ''
              this.form.deductionFlag = 1
              this.form.operationReason = ''
              this.form.growthValue = undefined
              this.init()
            }
          })
        })
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
