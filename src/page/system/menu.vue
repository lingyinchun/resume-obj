<template>
  <div class="app-container">
    <el-card
      class="box-card"
      shadow="never"
      style="border: 0"
      body-style="background-color: #f3f3f3;padding: 3px 0 0;"
    >
      <div slot="header">
        <span>菜单列表</span>
        <div style="float: right; margin: -5px 0">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            plain
            @click="handleAdd"
          >
            新增菜单
          </el-button>
        </div>
      </div>
    </el-card>
    <div class="table-body">
      <div class="app-search">
        <el-form :inline="true" size="small" :model="search" class="demo-form-inline" ref="search">
          <el-form-item label="菜单名称">
            <el-input
                v-model="search.resourceName"
                size="small"
                placeholder="请输入菜单名称搜索"
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
      <div>
        <el-alert
        v-show="showError"
          title="您已更新资源，请刷新页面查看"
          type="error"
          show-icon>
        </el-alert>
      </div>

      <!-- <div class="app-batch" flex="dir:left cross:center">
        <el-button
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
        :tree-props="{ children: 'childCategoryList', hasChildren: 'hasChildren' }"
        @selection-change="selectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="菜单名称" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.resourceName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="图标" width="60">
          <template slot-scope="scope">
            <IconTem :icon="scope.row.icon" :fontSize="18"/>
          </template>
        </el-table-column>
        <el-table-column label="组件路径">
          <template slot-scope="scope">
            <span>{{ scope.row.url }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="100">
          <template slot-scope="scope">
            <el-tag size="small" effect="plain" type="success" v-if="scope.row.resourceType === 1">内部菜单</el-tag>
            <el-tag size="small" effect="plain" type="warning" v-if="scope.row.resourceType === 2" >接口</el-tag>
            <el-tag size="small" effect="plain" v-if="scope.row.resourceType === 3">外部菜单</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="50">
          <template slot-scope="scope">
            <span>{{ scope.row.sortNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
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
              @click="handleAdd(scope.row)"
            >
              新增子项
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
    </div>
    <!-- 新增或修改菜单对话框 -->
    <el-dialog v-if="open" v-dialogDrag :title="title" :visible.sync="open" width="600px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单" prop="parentId">
              <Treeselect
                v-model="form.parentId"
                :options="menuOptions"
                @input="changeMenu"
                placeholder="请选择上级菜单"
                />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="resourceType">
              <el-radio-group
                v-model="form.resourceType"
                size="small"
              >
                <el-radio-button label="1">内部菜单</el-radio-button>
                <el-radio-button label="3">外部菜单</el-radio-button>
                <el-radio-button label="2">接口</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="form.resourceType != 2" label="菜单图标">
              <IconCom v-model="form.icon"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称" prop="resourceName">
              <el-input v-model="form.resourceName" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="sortNumber">
              <el-input-number
                v-model="form.sortNumber"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.resourceType == 1">
            <el-form-item label="路由地址" prop="url">
              <el-input v-model.trim="form.url" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.resourceType == 2">
            <el-form-item label="接口地址" prop="url">
              <el-input v-model="form.url" placeholder="请输入接口地址" />
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.resourceType == 3">
            <el-form-item label="外部地址" prop="url">
              <el-input v-model="form.url" placeholder="请输入外部地址" />
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.resourceType == 2">
            <el-form-item  label="资源编码" prop="resourceCode">
              <el-input v-model="form.resourceCode" placeholder="请输入外部链接" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item v-if="form.resourceType != 0" label="权限标识">
              <el-input
                v-model="form.permission"
                placeholder="请权限标识"
                maxlength="50"
              />
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="菜单状态">
              <el-radio-group v-model="form.isEnable" size="mini">
                <el-radio-button :label="true">启用</el-radio-button>
                <el-radio-button :label="false">禁用</el-radio-button>
              </el-radio-group>
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
    getList,
    saveMenu,
    updateMenu,
    getSysMenuById,
    deleteMenu,
  } from '@/api/system/menu'
  import IconCom from '@/components/IconCom'
  import { deepClone, getSelect } from '@/utils/util'
  // import the styles
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import permission from '@/directive/permission/index'
  import closeDeactivatedVNode from "@/mixins/closeDeactivatedVNode";

  export default {
    components: { IconCom, Treeselect },
    directives: { permission },
    mixins: [closeDeactivatedVNode],
    data() {
      var validatePass = (rule, value, callback) => {
        console.log('this.form.parentId', this.form.parentId)
        if (this.form.parentId !== 0 && !this.form.parentId) {
          callback(new Error('请选择上级菜单'));
        } else {
          callback();
        }
      };
      return {
        data: [],
        showError: false,
        menuOptions: [], // 菜单列表
        selectionList: [],
        sort: 1,
        // 查询参数
        search: {
          resourceName: undefined,
        },
        datetime: undefined,
        //弹窗标题
        title: '',
        // 是否显示弹出层
        open: false,
        sortNumber: 0,
        // 表单参数
        form: {
          parentId: undefined,
          icon: '',
          resourceType: 1,
          sortNumber: 1,
          isEnable: true,
          resourceName: '',
          url: '',
          resourceCode: ''
        },
        // 显示状态数据字典
        visibleOptions: [],
        // 菜单状态数据字典
        statusOptions: [],
        multipleSelection: [],
        isEdit: false,
        rules: {
          resourceName: [
            { required: true, message: '请输入菜单名称', trigger: 'blur' },
            {
              min: 2,
              max: 20,
              message: '长度在 2 到 20 个字符',
              trigger: 'blur',
            },
          ],
          parentId: [
            { required: true, validator: validatePass, trigger: 'input' }
          ],
          url: [
            { required: true, message: '请输入地址', trigger: 'blur' },
            {
              min: 2,
              max: 500,
              message: '长度在 2 到 500 个字符',
              trigger: 'blur',
            },
          ],
          resourceCode: [
            { required: true, message: '请输入编码', trigger: 'blur' },
            {
              min: 2,
              max: 200,
              message: '长度在 2 到 200 个字符',
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
    methods: {
      init() {
        this.fetchData()
      },
      fetchData() {
        getList(this.search).then((response) => {
          this.data = []
          this.data = response.data
          let data2 = deepClone(response.data)
          this.menuOptions = []
          const menu = { id: 0, label: '主类目', children: [] }
          menu.children = getSelect(data2)
          this.menuOptions.push(menu)
        })
      },
      // 取消按钮
      cancel() {
        this.reset()
        this.$refs['form'].resetFields();
        console.log('this.form', this.form)
        this.open = false
        this.$refs['form'].clearValidate('parentId')
      },
      // 表单重置
      reset() {
        this.form = {
          parentId: undefined,
          icon: '',
          resourceType: 1,
          sortNumber: 1,
          isEnable: true,
          resourceName: '',
          url: ''
        }
      },
      /** 新增按钮操作 */
      handleAdd(row) {
        console.log(this.form, row)
        this.reset()
        // this.getTreeSelect();
        if (row != null) {
          this.form.parentId = row.id
        }
        this.open = true
        this.title = '新增菜单'
        this.$nextTick(()=>{
          this.$refs['form'].resetFields();
        })
      },
      /** 修改按钮操作 */
      rowUpdate(row) {
        this.reset()
        getSysMenuById(row.id).then((response) => {
          this.form = response.data
          this.open = true
          console.log(this.form)
          this.title = '修改菜单'
        })
      },
      rowDelete(row) {
        this.$confirm('是否确认删除名称为"' + row.resourceName + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(function () {
            return deleteMenu(row.id)
          })
          .then(() => {
            this.showError = true
            this.init()
            this.$baseMessage('删除成功', 'success')
          })
          .catch(function () {})
      },
      /** 批量删除操作 */
      handleDelete() {
        if (this.selectionList.length === 0) {
          this.$baseMessage('请选择大于一条数据', 'error')
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
            return deleteMenu(this.ids)
          })
          .then(() => {
            this.init()
            this.$baseMessage('删除成功', 'success')
          })
          .catch(function () {})
      },
      /** 提交按钮 */
      submitForm: function () {
        console.log('this.form', this.form)
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let param = Object.assign({}, this.form)
            param.url = param.url.replace(/\s*/g,"")
            // console.log(param)
            let request = param.id ? updateMenu(param) : saveMenu(param)
            request.then((response) => {
              if (response.code === 200) {
                this.showError = true
                this.$baseMessage('操作成功', 'success')
                this.open = false
                this.init()
              }
            })
          }
        })
      },
      selectionChange(list) {
        this.selectionList = list
      },
      toSearch() {
        this.init()
      },
      clearSearch() {
        this.datetime = []
        this.search.resourceName = ''
        this.init()
      },
      changeMenu(){
        this.$refs.form.validateField('parentId');
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>
