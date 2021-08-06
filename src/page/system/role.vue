<template>
  <div class="app-container">
    <el-card
      class="box-card"
      shadow="never"
      style="border: 0"
      body-style="background-color: #f3f3f3;padding: 10px 0 0;"
    >
      <div slot="header">
        <span>角色列表</span>
        <div style="float: right; margin: -5px 0">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            plain
            @click="handleAdd"
          >
            新增角色
          </el-button>
          <el-button
            v-permission="['sys:role:export']"
            type="success"
            size="small"
            icon="el-icon-download"
            plain
            @click="handleExport"
          >
            角色导出
          </el-button>
        </div>
      </div>
    </el-card>
    <div class="table-body">
      <div class="app-search">
        <el-form :inline="true" size="small" :model="search" class="demo-form-inline" ref="search">
          <el-form-item label="创建时间">
            <el-date-picker
                v-model="datetime"
                size="small"
                type="daterange"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changeDate"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="角色名称">
            <el-input
                v-model="search.roleNameLike"
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
      <!-- <div class="app-batch" flex="dir:left cross:center">
        <el-button
          v-permission="['sys:role:delete']"
          size="mini"
          type="danger"
          icon="el-icon-delete"
          @click="handleDelete"
        >
          批量删除
        </el-button>
      </div> -->
      <el-row :gutter="15">
        <!--角色管理-->
        <el-col style="margin-bottom: 10px">
          <el-table
            ref="multipleTable"
            :data="data"
            row-key="id"
            size="small"
            highlight-current-row
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            @selection-change="selectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="角色编号">
              <template slot-scope="scope">
                <span>{{ scope.row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column label="角色名称" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{ scope.row.roleName }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="角色编码">
              <template slot-scope="scope">
                <span>{{ scope.row.roleCode }}</span>
              </template>
            </el-table-column> -->
            <!-- <el-table-column label="角色描述">
              <template slot-scope="scope">
                <el-tag size="small">{{ scope.row.description }}</el-tag>
              </template>
            </el-table-column> -->
            <el-table-column label="创建时间">
              <template slot-scope="scope" width="30">
                <span>{{ scope.row.createTime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="rowUpdate(scope.row)"
                >
                  修改
                </el-button>
                <el-button
                  size="mini"
                  type="text"
                  @click="rowDelete(scope.row)"
                >
                  删除
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
        </el-col>
      </el-row>
    </div>
    <!-- 新增或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="form.roleName" placeholder="请输入角色名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="权限设置">
              <div class="tree-div">
                <el-tree
                  ref="tree"
                  :data="privData"
                  :default-checked-keys="privIds"
                  default-expand-all
                  show-checkbox
                  check-strictly
                  node-key="id"
                  accordion
                  :props="defaultProps"
                ></el-tree>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getRoleList,
    saveRole,
    updateRole,
    getRoleById,
    deleteRole,
    exportRole,
  } from '@/api/system/role'
  import { getList } from '@/api/system/menu'
  // 权限判断指令
  import permission from '@/directive/permission/index'
  import { downloadFile } from '@/utils'
  import { deepClone, getSelect, getTreeAllData } from '@/utils/util'
  import closeDeactivatedVNode from "@/mixins/closeDeactivatedVNode";

  export default {
    directives: { permission },
    mixins: [closeDeactivatedVNode],
    data() {
      return {
        data: [],
        privData: [],
        privIds: [],
        datetime: undefined,
        //弹窗标题
        title: '',
        // 是否显示弹出层
        open: false,
        priv: false,
        // 表单参数
        form: {},
        selectionList: [],
        // 查询参数
        search: {
          pageNo: 1,
          pageSize: 10,
          roleNameLike: undefined,
          createTimeFrom: undefined,
          createTimeTo: undefined,
        },
        total: 0,
        roleId: 0,
        defaultProps: {
          children: 'children',
          label: 'label',
        },
        layout: 'total, sizes, prev, pager, next, jumper',
        rules: {
          roleCode: [
            { required: true, message: '请输入角色编码', trigger: 'blur' },
            {
              min: 2,
              max: 20,
              message: '长度在 2 到 20 个字符',
              trigger: 'blur',
            },
          ],
          roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
            {
              min: 2,
              max: 20,
              message: '长度在 2 到 20 个字符',
              trigger: 'blur',
            },
          ],
          description: [
            { required: true, message: '请输入角色描述', trigger: 'blur' },
            {
              min: 2,
              max: 20,
              message: '长度在 2 到 20 个字符',
              trigger: 'blur',
            },
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
      this.init()
    },
    mounted() {
      getList().then((response) => {
        if (response.code === 200) {
          this.privData = getSelect(deepClone(response.data))
        }
      })
    },
    methods: {
      /** 初始化列表 */
      init() {
        this.fetchData()
      },
      fetchData() {
        this.listLoading = true
        getRoleList(this.search).then((response) => {
          if (response.data.records) {
            this.data = response.data.records
            this.total = response.data.totalRecords
          } else {
            this.data = []
            this.total = 0
          }
          this.listLoading = false
        })

      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset()
        this.open = true
        this.title = '新增用户'
      },
      selectionChange(list) {
        this.selectionList = list
      },
      toSearch() {
        this.changeDate()
      },
      clearSearch() {
        this.search.roleNameLike = ''
        this.search.createTimeFrom = null
        this.search.createTimeTo = null
        this.init()
      },
      /** 批量删除操作 */
      handleDelete() {
        if (this.selectionList.length === 0) {
          this.$message.warning('请选择大于一条数据')
          return
        }
        this.$confirm(`确认删除选中的${this.selectionList.length}条数据?`,'警告',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(() => {
          return deleteRole(this.ids)
        })
        .then(() => {
          this.init()
          this.$baseMessage('删除成功', 'success')
        })
        .catch(function () {})
      },
      /** 修改按钮操作 */
      rowUpdate(row) {
        this.reset()
        getRoleById(row.id).then((response) => {
          if (response.data) {
            this.form = response.data
            this.open = true
            this.title = '修改角色'
            this.privIds = response.data.resourceIds
            this.$nextTick(()=>{
              this.$refs.tree.setCheckedKeys(response.data.resourceIds)
            })
          }
        })
      },
      /** 权限操作 */
      rowPriv(row) {
        this.reset()
        getList().then((response) => {
          this.privData = response.data
          this.priv = true
          this.title = '修改权限'
        })
      },
      rowDelete(row) {
        this.$confirm('是否确认删除名称为"' + row.roleName + '"的数据项?','警告',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(function () {
          console.log(111, row.id)
          return deleteRole(row.id)
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
            let param = Object.assign({}, this.form)
            param.resourceIds = this.$refs.tree.getCheckedKeys() || []
            let request = param.id ? updateRole(param) : saveRole(param)
            request.then((response) => {
              if (response.code === 200) {
                this.$baseMessage('操作成功', 'success')
                this.$refs.tree.setCheckedKeys([])
                this.open = false
                this.init()
              }
            })
          }
        })
      },
      // 取消按钮
      cancel() {
        this.$refs.tree.setCheckedKeys([])
        this.open = false
      },
      // 表单重置
      reset() {
        this.form = {
          // menuId: undefined,
          // menuName: undefined,
          id: '',
          sort: 1,
          roleNameLike: undefined,
          roleCode: undefined,
          // orderNum: undefined,
        }
        // this.resetForm("form");
      },
      handleSizeChange(val) {
        this.search.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.search.pageNo = val
        this.fetchData()
      },
      handleExport() {
        exportRole().then((response) => {
          downloadFile(response, 'role', 'xlsx')
        })
      },
      changeDate() {
        if (this.datetime) {
          this.search.createTimeFrom = this.datetime[0]
          this.search.createTimeTo = this.datetime[1]
        } else {
          this.search.createTimeFrom = null
          this.search.createTimeTo = null
        }
        this.init()
      },
    },
  }
</script>

<style lang="scss" scoped>

  .role-card ::v-deep .el-card__header {
    padding: 12px 14px;
    font-size: 14px;
  }
  .tree-div{
    width: 220px;
    height: 260px;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    overflow: hidden scroll;
  }
</style>
