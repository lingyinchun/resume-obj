<template>
    <el-row style="margin-top: 40px; width: 400px;">
        <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="平台">
                <el-select v-model="form.systemPlatform" placeholder="请选择平台">
                    <el-option label="M端" value="m"></el-option>
                    <el-option label="C端" value="c"></el-option>
                    <el-option label="B端" value="b"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="token" label="token" :rules="[{ required: true, message: '请输入token', trigger: 'blur' }]">
                <el-input v-model="form.token" placeholder="请填写token" ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit('form')">清除登录信息</el-button>
            </el-form-item>
        </el-form>
    </el-row>
</template>

<script>
    import { clearLoginStatus } from '@/api/sysAdmin/admin'
    export default {
        data() {
            return {
                form: {
                    systemPlatform: 'm',
                    token: undefined,
                }
            }
        },
        methods: {
            onSubmit(formName) {
                let _t = this;
                _t.$refs[formName].validate((valid) => {
                    if (valid) {
                        _t.$confirm('此操作将用户退出登录, 是否继续?', '警告', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            clearLoginStatus(_t.form.systemPlatform, _t.form.token).then((res) => {
                                _t.$baseMessage('清除成功', 'success')
                                _t.form.token = '';
                            });
                        }).catch(() => {
                        });
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>