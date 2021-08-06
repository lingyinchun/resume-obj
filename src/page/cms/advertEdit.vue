<template>
    <el-dialog :title="title" :close-on-click-modal="false" :visible.sync="visible" width="600px" :close-on-press-escape="false">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px">
            <el-form-item label="广告位名称" prop="advertName">
                <el-input v-model="dataForm.advertName" placeholder="请输入广告名称" :disabled="opt == 3"></el-input>
            </el-form-item>
            <el-form-item label="广告有效期" prop="validityTime">
                <el-date-picker  v-model="dataForm.validityTime" type="datetimerange" :picker-options="pickerOptions"
                    range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" align="right"
                    @change="changeDate" value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="广告类型" prop="advertType">
                <el-radio v-model="dataForm.advertType" :label="1">文本</el-radio>
                <el-radio v-model="dataForm.advertType" :label="2">图片</el-radio>
                <el-radio v-model="dataForm.advertType" :label="3">视频</el-radio>
                <el-radio v-model="dataForm.advertType" :label="4">商品</el-radio>
            </el-form-item>
            <el-form-item label="广告内容" prop="advertContent">
                <el-upload v-show="dataForm.advertType == 2 || dataForm.advertType == 3" :headers="headers"
                    action="/mall-api/file-m/m/file/upload"
                    list-type="picture-card" :multiple="false"
                    :on-preview="handlePictureCardPreview"
                    :on-success="handleSuccess" :before-upload="beforeAvatarUpload"
                    :file-list="fileList">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2M</div>
                </el-upload>
                <el-input v-model="dataForm.advertContent" v-show="dataForm.advertType == 1 || dataForm.advertType == 4" placeholder="请输入广告内容" :disabled="opt == 3"></el-input>
            </el-form-item>
            <el-form-item label="跳转链接" prop="jumpUrl">
                <el-input v-model="dataForm.jumpUrl" placeholder="请输入跳转链接" :disabled="opt == 3"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="sortNumber">
                <el-input-number v-model="dataForm.sortNumber" :precision="0" :min="1" :max="999999" :disabled="opt == 3" placeholder="请输入排序数"></el-input-number>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { advertAdd, advertUpdate, advertGet } from '@/api/cms/advert'
import { getAfterPickerOptions } from '@/utils'
import { getSessionId } from '@/utils/SessionId'
export default {
    name: 'cmsAdvertEdit',
    computed: {
        headers() {
            return {Authorization: getSessionId()}
        }
    },
    data () {
        return {
            fileList: [],
            // 日期快捷选项
            pickerOptions: getAfterPickerOptions(),
            visible: false,
            title: undefined,
            opt: undefined,
            dataForm: {
                id: undefined,
                advertSpaceId: undefined,
                advertName: undefined,
                advertType: undefined,
                advertContent: undefined,
                jumpUrl: undefined,
                validityTime: undefined,
                startTime: undefined,
                endTime: undefined,
                sortNumber: undefined,
            },
            // 广告位页面列表
            spacePageList: [],
            dataRule: {
                advertName: [
                    { required: true, message: '请输入广告名称', trigger: 'blur' }
                ],
                validityTime: [
                    { type: 'array', required: true, message: '请选择有效期', trigger: 'change' }
                ],
                advertType: [
                    { required: true, message: '请选择广告类型', trigger: 'blur' }
                ],
                advertContent: [
                    { required: true, message: '请填写内容或选择文件', trigger: 'blur' }
                ],
                jumpUrl: [
                    { required: true, message: '请输入跳转链接', trigger: 'blur' }
                ],
                sortNumber: [
                    { required: true, message: '请输入排序数', trigger: 'blur' }
                ],
            },
        }
    },
    methods: {
        init(id, opt, advertSpaceId) {
            if(opt == 1) {
                this.title = '新增广告';
            } else if(opt == 2) {
                this.title = '编辑广告';
            } else if(opt == 3) {
                this.title = '查看广告';
            }
            this.visible = true;
            this.$nextTick(() => {
                this.$refs['dataForm'].resetFields();
                this.dataForm = {};
                this.dataForm.id = id || undefined;
                this.fileList = [];
                this.opt = opt;
                this.dataForm.advertSpaceId = advertSpaceId;
                this.getDataInfo();
            })
        },
        changeDate() {
            let value = this.dataForm.validityTime;
            if (value) {
                this.dataForm.startTime = value[0]
                this.dataForm.endTime = value[1]
            } else {
                this.dataForm.startTime = null
                this.dataForm.endTime = null
            }
        },
        getDataInfo() {
            if(this.dataForm.id) {
                advertGet(this.dataForm.id).then((res) => {
                    this.dataForm = res.data;
                    this.$set(this.dataForm, 'validityTime', [this.dataForm.startTime, this.dataForm.endTime])
                    // this.dataForm.validityTime = [this.dataForm.startTime, this.dataForm.endTime];
                    if(this.dataForm.advertType == 2 || this.dataForm.advertType == 3) {
                        this.fileList = [{url: this.dataForm.advertContent}]
                    }
                });
            }
        },
        // 表单提交
        dataFormSubmit () {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    if(this.opt == 1) {
                        advertAdd(this.dataForm).then((res) => {
                            this.$baseMessage('新增成功', 'success')
                            this.visible = false;
                            this.$emit('refreshDataList');
                        });
                    } else if(this.opt == 2) {
                        advertUpdate(this.dataForm).then((res) => {
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
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleSuccess(response, file, fileList) {
            console.log(fileList);
            if(response.code === 200) {
                this.dataForm.advertContent = response.data;
                this.fileList = [file]
            } else {
                this.$baseMessage(response.message, 'error')
            }
        },
        beforeAvatarUpload(file) {
            let isType = false;
            if(file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png') {
                isType = true;
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isType) {
                this.$baseMessage('上传图片只能是 jpg/png 格式', 'error');
            }
            if (!isLt2M) {
                this.$baseMessage('上传图片大小不能超过 2MB', 'error');
            }
            return isType && isLt2M;
        }
    }
}
</script>
