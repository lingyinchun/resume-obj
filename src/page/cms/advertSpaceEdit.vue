<template>
    <el-dialog :title="title" :close-on-click-modal="false" :visible.sync="visible" width="600px" :close-on-press-escape="false">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px">
            <el-form-item label="广告位名称" prop="advertSpaceName">
                <el-input v-model="dataForm.advertSpaceName" placeholder="请输入广告位名称" :disabled="opt == 3"></el-input>
            </el-form-item>
<!--            <el-form-item label="广告位页面" prop="advertSpacePage">-->
<!--                <el-select v-model="dataForm.advertSpacePage" placeholder="请选择广告位页面" :disabled="opt == 3">-->
<!--                    <el-option v-for="item in spacePageList" :label="item.dictDesc" :value="item.dictValue" :key="item.dictValue"></el-option>-->
<!--                </el-select>-->
<!--            </el-form-item>-->
            <el-form-item label="广告位编码" prop="advertSpaceCode">
                <el-input v-model="dataForm.advertSpaceCode" placeholder="请输入广告位编码" :disabled="opt == 3"></el-input>
            </el-form-item>
            <el-form-item label="前台展示张数" prop="webShowNumber">
                <el-input-number v-model="dataForm.webShowNumber" :precision="0" :min="0" :max="100" :disabled="opt == 3" placeholder="请输入前台展示张数"></el-input-number>
            </el-form-item>
            <el-form-item label="是否启用" prop="isValid">
                <el-switch v-model="dataForm.isValid" :disabled="opt == 3"></el-switch>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
  import { advertSpaceAdd, advertSpaceUpdate, advertSpaceGet, advertSpacePages } from '@/api/cms/advertSpace'
  export default {
    name: 'cmsAdvertSpaceEdit',
    data () {
      return {
        visible: false,
        title: undefined,
        opt: undefined,
        dataForm: {
            id: undefined,
            advertSpaceName: undefined,
            advertSpacePage: undefined,
            advertSpaceCode: undefined,
            webShowNumber: undefined,
            isValid: true,
        },
        // 广告位页面列表
        spacePageList: [],
        dataRule: {
            advertSpaceName: [
                {required: true, message: '请输入广告位名称', trigger: 'blur'}
            ],
            advertSpacePage: [
                {required: true, message: '请选择广告位页面', trigger: 'blur'}
            ],
            advertSpaceCode: [
                {required: true, message: '请输入广告位编码', trigger: 'blur'}
            ],
            webShowNumber: [
                {required: true, message: '请输入前台展示张数', trigger: 'blur'}
            ],
        },
      }
    },
    methods: {
      init (id, opt) {
        this.dataForm.id = id || undefined;
        this.opt = opt;
        if(opt == 1) {
            this.title = '新增广告位';
        } else if(opt == 2) {
            this.title = '编辑广告位';
        } else if(opt == 3) {
            this.title = '查看广告位';
        }
        this.visible = true;
        this.$nextTick(() => {
            this.$refs['dataForm'].resetFields();
            this.getDataInfo();
        })
      },
      getSpacePages() {
        // advertSpacePages().then((res) => {
        //     this.spacePageList = res.data;
        //     this.getDataInfo();
        // });
      },
      getDataInfo() {
        if(this.dataForm.id) {
            advertSpaceGet(this.dataForm.id).then((res) => {
                this.dataForm = res.data;
                this.dataForm.advertSpacePage = res.data.advertSpacePage + '';
            });
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if(this.opt == 1) {
                advertSpaceAdd(this.dataForm).then((res) => {
                    this.$baseMessage('新增成功', 'success')
                    this.visible = false;
                    this.$emit('refreshDataList');
                });
            } else if(this.opt == 2) {
                advertSpaceUpdate(this.dataForm).then((res) => {
                    this.$baseMessage('修改成功', 'success')
                    this.visible = false;
                    this.$emit('refreshDataList');
                });
            } else if(this.opt == 3) {
                this.visible = false;
                this.$emit('refreshDataList');
            }
          }
        })
      }
    }
  }
</script>
