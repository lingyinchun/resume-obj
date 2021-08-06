<template>
  <div class="app-container">
    <el-card
      class="box-card"
      shadow="never"
      style="border: 0"
      body-style="background-color: #f3f3f3;padding: 10px 0 0;"
    >
      <div slot="header">
        <span>会员等级</span>
        <div style="float: right; margin: -5px 0">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            plain
            @click="handleAdd"
          >
            新增等级
          </el-button>
        </div>
      </div>
    </el-card>

    <div class="table-body">
      <div class="app-search">
        <el-form :inline="true" size="small" :model="search" class="demo-form-inline" ref="search">
          <el-form-item label="等级名称">
            <el-input
                v-model="search.levelNameLike"
                size="small"
                placeholder="请输入名称搜索"
                clearable
                @clear="toSearch"
                @keyup.enter.native="toSearch"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="toSearch">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="clearSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table
        ref="multipleTable"
        :data="data"
        row-key="id"
        border
        size="small"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column label="会员等级" prop="id">
          <template slot-scope="scope">
            <span>{{ scope.row.levelCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="等级名称" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.levelName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所需成长值">
          <template slot-scope="scope">
            <span>{{ scope.row.conditions }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="角色">
          <template slot-scope="scope">
            <el-tag size="small">{{ scope.row.roleName }}</el-tag>
          </template>
        </el-table-column> -->
        <el-table-column label="背景颜色">
          <template slot-scope="scope">
            <span class="bgdiv" :style="{'background': scope.row.backGroundColor}"></span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="rowUpdate(scope.row)" style="margin-right: 10px;">修改</el-button>
            <!-- <el-button size="mini" type="text" @click="rowDelete(scope.row)">删除</el-button>-->
            <el-popover placement="bottom" title="警告" width="200" trigger="click" content="危险操作，请联系开发人员删除">
              <el-button size="mini" type="text" slot="reference" style="color: #f56c6c;">删除</el-button>
            </el-popover>
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
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="等级编码" prop="levelCode">
              <el-input v-model="form.levelCode" placeholder="请输入等级编码" :disabled="levelCodeDisabled" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="等级名称" prop="levelName">
              <el-input v-model="form.levelName" placeholder="请输入等级名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="背景色" prop="backGroundColor">
              <!-- <el-color-picker v-model="form.backGroundColor"></el-color-picker> -->
              <SelectColor v-model="form.backGroundColor"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="获得条件" prop="conditions">成长值
              <el-input-number v-model="form.conditions" placeholder="请输入成长值" style="width: 180px;"/>
              <span class="f-tip">&nbsp;&nbsp;  * 修改等级所需成长值</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="时间范围" >
              <el-radio value="1" label="1">永久有效</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div>
        <div class="vip-box" :style="{background: form.backGroundColor}">
          <div class="_22MG">{{form.levelName}}</div>
          <div class="_3csP">
            <div class="_2_NN">7</div>成长值
          </div>
          <div class="_3XnZ"></div>
          <div class="_5lfJ">再获得 {{form.conditions}} 成长值成为 {{form.levelName}}</div>
        </div>
        <div style="color:#bbbbbb;text-align:center;margin-top:8px;">仅为预览，实际以用户查看时为准</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import {
    getList,
    getById,
    deleteItem,
    save,
    update,
  } from '@/api/vip/grade'
  import SelectColor from '@/components/SelectColor'
  // 权限判断指令
  import permission from '@/directive/permission/index'
  import closeDeactivatedVNode from "@/mixins/closeDeactivatedVNode";

  export default {
    name: 'grade',
    components: { SelectColor },
    directives: { permission },
    mixins: [closeDeactivatedVNode],
    data() {
      return {
        data: [],
        //弹窗标题
        title: '',
        levelCodeDisabled: false,
        // 是否显示弹出层
        open: false,

        // 表单参数
        form: {
          levelName: '',
          levelCode: '',
          backGroundColor: undefined,
          conditions: undefined,
          id: null,
        },
        datetime: undefined,
        selectionList: [],
        roleTree: [],
        // 查询参数
        search: {
          pageNo: 1,
          pageSize: 10,
          levelNameLike: undefined,
        },
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper',
        rules: {
          levelCode: [
            { required: true, message: '请输入等级编码', trigger: 'blur' },
            {
              min: 2,
              max: 20,
              message: '长度在 2 到 20 个字符',
              trigger: 'blur',
            },
          ],
          levelName: [
            { required: true, message: '请输入等级名称', trigger: 'blur' },
            {
              min: 2,
              max: 20,
              message: '长度在 2 到 20 个字符',
              trigger: 'blur',
            },
          ],
          backGroundColor: [{ required: true, message: '请选择背景色', trigger: 'blur' },],
          conditions: [
            { required: true, message: '请输入成长值', trigger: 'blur' },
          ],
        },
      }
    },
    computed: {
      ids() {
        let ids = []
        this.selectionList.forEach((ele) => {
          ids.push(ele.id)
        })
        return ids.join(',')
      },
    },
    created() {
      // console.log('grade', this.$route)
      this.init()
    },
    methods: {
      /** 初始化列表 */
      init() {
        this.fetchData()
      },
      fetchData() {
        this.listLoading = true
        getList(this.search).then((response) => {
          this.data = response.data.records || []
          this.total = response.data.totalRecords
          this.listLoading = false
        })
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset()
        this.open = true
        // this.$nextTick(()=>{
        //   this.$refs['form'].resetFields();
        // })
        this.title = '新增等级'
        this.levelCodeDisabled = false;
      },
      selectionChange(list) {
        this.selectionList = list
      },
      toSearch() {
        this.fetchData()
      },
      clearSearch() {
        this.search.levelNameLike = ''
        this.fetchData()
      },
      /** 修改按钮操作 */
      rowUpdate(row) {
        this.reset()
        getById(row.id).then((response) => {
          this.form = response.data
          this.open = true
          this.title = '修改等级'
          this.levelCodeDisabled = true;
        })
      },
      rowDelete(row) {
        this.$confirm('是否确认删除名称为"' + row.levelCode + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(function () {
            return deleteItem(row.id)
          })
          .then(() => {
            this.init()
            this.$baseMessage('删除成功', 'success')
          })
          .catch(function () {})
      },
      /** 提交按钮 */
      submitForm: function () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let request = this.form.id ? update(this.form) : save(this.form)
            request.then((response) => {
              if (response.code === 200) {
                this.$baseMessage('操作成功', 'success')
                this.open = false
                this.init()
              }
            })
          }
        })
      },
      // 取消按钮
      cancel() {
        this.reset()
        this.$nextTick(()=>{
          this.$refs['form'].clearValidate();
        })
        console.log(this.form)
        this.open = false
      },
      // 表单重置
      reset() {
        this.form = {
          levelName: '',
          levelCode: '',
          backGroundColor: undefined,
          conditions: undefined,
          id: null,
        }
      },
      handleSizeChange(val) {
        this.search.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.search.pageNo = val
        this.fetchData()
      },
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
