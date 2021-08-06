<template>
  <div class="app-container">
    <el-card
      class="box-card"
      shadow="never"
      style="border: 0"
      body-style="background-color: #f3f3f3;padding: 10px 0 0;"
    >
      <div slot="header">
        <span>用户列表</span>
        <div style="float: right; margin: -5px 0">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            plain
            @click="handleAdd"
          >
            新增用户
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
          <el-form-item label="昵称">
            <el-input
                v-model="search.userNameLike"
                size="small"
                placeholder="请输入昵称搜索"
                clearable
                @clear="toSearch"
                @keyup.enter.native="toSearch"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="toSearch">搜索</el-button>
            <el-button
                class="filter-item"
                size="small"
                icon="el-icon-refresh-left"
                @click="clearSearch"
            >
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- <div class="app-batch" flex="dir:left cross:center">
        <el-button
          v-permission="['sys:user:enable']"
          size="mini"
          type="primary"
          icon="el-icon-unlock"
          @click="handleStatus('0')"
        >
          启用
        </el-button>

        <el-button
          v-permission="['sys:user:disable']"
          size="mini"
          type="primary"
          icon="el-icon-lock"
          @click="handleStatus('1')"
        >
          禁用
        </el-button>

        <el-button
          v-permission="['sys:user:delete']"
          size="mini"
          type="danger"
          icon="el-icon-delete"
          @click="handleDelete"
        >
          批量删除
        </el-button>
      </div> -->

      <el-table
        ref="multipleTable"
        :data="data"
        row-key="id"
        border
        size="small"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @selection-change="selectionChange"
        @sort-change="sortChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="用户编号" prop="id">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="账号" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.userName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="昵称">
          <template slot-scope="scope">
            <span>{{ scope.row.nickName }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="角色">
          <template slot-scope="scope">
            <el-tag size="small">{{ scope.row.roleName }}</el-tag>
          </template>
        </el-table-column> -->
        <el-table-column label="管理员">
          <template slot-scope="scope">
            <el-tag size="small">{{ scope.row.isSuperAdmin ? '是' : '否' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="手机号码">
          <template slot-scope="scope">
            <span>{{ scope.row.mobile }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.userStatus === 1">启用</el-tag>
            <el-tag size="small" type="info" v-else>禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="238">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="rowUpdate(scope.row)"
              v-if="scope.row.userName != 'admin'"
            >
              修改
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="rowReset(scope.row)"
              v-if="scope.row.userName != 'admin'"
            >
              重置密码
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="rowDelete(scope.row)"
              v-if="scope.row.userName != 'admin'"
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
    </div>

    <!-- 新增或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="680px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="账户" prop="userName">
              <el-input v-model="form.userName" placeholder="请输入账户名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="昵称" prop="nickName">
              <el-input v-model="form.nickName" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col v-if="!form.id" :span="12">
            <el-form-item label="密码" prop="userPwd">
              <el-input
                v-model="form.userPwd"
                type="password"
                placeholder="请输入密码"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="!form.id" :span="12">
            <el-form-item label="确认密码" prop="rePassword">
              <el-input
                v-model="form.rePassword"
                type="password"
                placeholder="请输入确认密码"
              />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="性别" size="mini">
              <el-radio-group v-model="form.sex">
                <el-radio-button label="0">未知</el-radio-button>
                <el-radio-button label="1">男</el-radio-button>
                <el-radio-button label="2">女</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="telephone">
              <el-input v-model="form.telephone" placeholder="请输入手机号码" />
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="管理员">
              <el-radio-group v-model="form.isSuperAdmin" size="mini">
                <el-radio-button :label="true">是</el-radio-button>
                <el-radio-button :label="false">否</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.userStatus" size="mini">
                <el-radio-button :label="1">启用</el-radio-button>
                <el-radio-button :label="0">禁用</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属平台" prop="platformList">
              <el-select v-model="form.platformList" placeholder="请选择" multiple >
                <el-option
                  v-for="item in platformList"
                  :key="item.value"
                  :label="item.desc"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="!form.isSuperAdmin">
            <el-form-item label="角色" prop="roleIdList">
              <el-select v-model="form.roleIdList" placeholder="请选择" multiple >
                <el-option
                  v-for="item in roleList"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 新增或修改菜单对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="resetPwd"
      width="600px"
      append-to-body
    >
      <el-form ref="pwdForm" :model="pwdForm" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="密码" prop="userPwd">
              <el-input
                v-model="pwdForm.userPwd"
                type="password"
                placeholder="请输入密码"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="确认密码" prop="resetPassword">
              <el-input
                v-model="pwdForm.resetPassword"
                type="password"
                placeholder="请输入确认密码"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitPwdForm">确 定</el-button>
        <el-button @click="pwdCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getList,
    statusUser,
    getUserById,
    deleteUser,
    saveUser,
    updateUser,
    updateUserPwd,
  } from '@/api/system/user'
  import { getRoleList } from '@/api/system/role'
  import { getPlatformList } from '@/api/user'
  
  // 权限判断指令
  import permission from '@/directive/permission/index'
  import closeDeactivatedVNode from '@/mixins/closeDeactivatedVNode'

  export default {
    name: 'user',
    directives: { permission },
    mixins: [closeDeactivatedVNode],
    data() {
      const rePassword = (rule, value, callback) => {
        if (value) {
          if (this.form.userPwd !== value) {
            callback(new Error('两次输入的密码不一致'))
          } else {
            callback()
          }
        } else {
          callback(new Error('请再次输入密码'))
        }
      }
      const resetPassword = (rule, value, callback) => {
        if (value) {
          if (this.pwdForm.userPwd !== value) {
            callback(new Error('两次输入的密码不一致'))
          } else {
            callback()
          }
        } else {
          callback(new Error('请再次输入密码'))
        }
      }
      return {
        data: [],
        //弹窗标题
        title: '',
        // 是否显示弹出层
        open: false,
        resetPwd: false,


        // 表单参数
        form: {
          userName: '',
          nickName: '',
          userPwd: '',
          rePassword: '',
          departId: '',
          roleIdList: [],
          userStatus: 1,
          isSuperAdmin: false,
          // 所属平台
          platformList: [],
          platformAttribution: undefined,
        },
        // 平台列表
        platformList: [],
        pwdForm: {
          id: '',
        },
        datetime: undefined,
        selectionList: [],
        roleTree: [],
        // 查询参数
        search: {
          pageNo: 1,
          pageSize: 10,
          userNameLike: undefined,
          createTimeFrom: undefined,
          createTimeTo: undefined,
        },
        total: 0,
        roleList: [],
        layout: 'total, sizes, prev, pager, next, jumper',
        rules: {
          userName: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            {
              min: 2,
              max: 20,
              message: '长度在 2 到 20 个字符',
              trigger: 'blur',
            },
          ],
          nickName: [
            { required: true, message: '请输入昵称', trigger: 'blur' },
            {
              min: 2,
              max: 20,
              message: '长度在 2 到 20 个字符',
              trigger: 'blur',
            },
          ],
          userPwd: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            {
              min: 6,
              max: 20,
              message: '长度在 6 到 20 个字符',
              trigger: 'blur',
            },
          ],
          rePassword: [
            { required: true, validator: rePassword, trigger: 'blur' },
          ],
          resetPassword: [
            { required: true, validator: resetPassword, trigger: 'blur' },
          ],
          departId: [
            { required: true, message: '请选择部门', trigger: 'change' },
          ],
          platformList: [
            { required: true, message: '请选择所属平台', trigger: 'change' },
          ],
          roleIdList: [
            { required: true, message: '请选择角色', trigger: 'change' },
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
      console.log(this.$vnode)
      this.init()
      getRoleList({
        pageNo: 1,
        pageSize: 1000
      }).then((response) => {
        if (response.data.records) {
          this.roleList = response.data.records || []
        }
      })
    },
    methods: {
      /** 初始化列表 */
      init() {
        this.fetchData()
      },
      /** 排序列表 */
      sortChange(column, prop, order) {
        // if (column.prop != null && column.order != null) {
        //   this.search.prop = column.prop
        //   this.search.order = column.order === 'ascending' ? 'asc' : 'desc'
        // }
        // this.fetchData()
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
        this.$nextTick(()=>{
          this.$refs['form'].resetFields();
          this.getAllPlatformList();
        })
        this.title = '新增用户'
      },
      selectionChange(list) {
        this.selectionList = list
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
      toSearch() {
        this.changeDate()
      },
      clearSearch() {
        this.datetime = []
        this.search.userNameLike = ''
        this.search.createTimeFrom = null
        this.search.createTimeTo = null
        this.init()
      },
      handleStatus(status) {
        if (this.selectionList.length === 0) {
          this.$message.warning('请选择大于一条数据')
          return
        }
        let statusName = ''
        if (status == '0') {
          statusName = '启用'
        } else if (status == '1') {
          statusName = '禁用'
        }
        this.$confirm(
          `确认${statusName}选中的${this.selectionList.length}条数据?`,
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
          .then(() => {
            return statusUser(this.ids, status)
          })
          .then(() => {
            this.init()
            this.$baseMessage('操作成功', 'success')
          })
          .catch(function () {})
      },
      /** 批量删除操作 */
      handleDelete() {
        if (this.selectionList.length === 0) {
          this.$message.warning('请选择大于一条数据')
          return
        }
        this.$confirm(
          `确认删除选中的${this.selectionList.length}条数据?`,
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
          .then(() => {
            return deleteUser(this.ids)
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
        getUserById(row.id).then((response) => {
          this.form = response.data
          this.open = true
          this.title = '修改用户'
          this.getAllPlatformList();
        })
      },
      getAllPlatformList() {
        getPlatformList().then((response) => {
          this.platformList = response.data;
        });
      },
      /** 重置密码操作 */
      rowReset(row) {
        this.pwdReset()
        this.pwdForm = row
        this.pwdForm.userPwd = ''
        this.resetPwd = true
      },
      rowDelete(row) {
        this.$confirm('是否确认删除名称为"' + row.userName + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(function () {
            return deleteUser(row.id)
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
            let request = this.form.id ? updateUser(this.form) : saveUser(this.form)
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
      /** 提交密码重置按钮 */
      submitPwdForm: function () {
        this.$refs['pwdForm'].validate((valid) => {
          if (valid) {
            updateUserPwd(this.pwdForm).then((response) => {
              if (response.code === 200) {
                this.$baseMessage('操作成功', 'success')
                this.resetPwd = false
                this.init()
              }
            })
          }
        })
      },
      // 取消按钮
      cancel() {
        this.open = false
      },
      // 取消按钮
      pwdCancel() {
        this.resetPwd = false
      },
      // 表单重置
      reset() {
        this.form = {
          // menuId: undefined,
          // menuName: undefined,
          userName: '',
          nickName: '',
          rePassword: '',
          roleIdList: [],
          userPwd: undefined,
          sort: 1,
          // orderNum: undefined,
          isSuperAdmin: false,
          sex: '0',
          id: null,
          userStatus: 1
        }

        // this.resetForm("form");
      },
      pwdReset() {
        this.pwdForm = {
          userPwd: undefined,
          resetPassword: undefined,
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
    }
  }
</script>

<style lang="scss" scoped>

</style>
