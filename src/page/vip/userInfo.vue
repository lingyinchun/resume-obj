<template>
  <div class="app-container">
    <el-card
      class="box-card"
      shadow="never"
      style="border: 0"
      body-style="background-color: #f3f3f3;padding: 10px 0 0;"
    >
      <div slot="header">
        <span>{{title}}</span>
      </div>
    </el-card>
    <div class="main-container">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" inline>
        <el-card>
          <div slot="header">
            <span>基本信息</span>
          </div>
          <el-form-item label="用户ID" prop="id" v-if="opt != 1">
            <el-input v-model="form.id" placeholder="请输入账户名称" disabled />
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="form.mobile" placeholder="请输入手机号" :disabled="opt != 1" />
          </el-form-item>
          <el-form-item label="用户账号" prop="userName" v-if="opt != 1">
            <el-input v-model="form.userName" placeholder="请输入账户名称" disabled />
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickName">
            <el-input v-model="form.nickName" placeholder="请输入昵称" :disabled="opt != 1" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱" :disabled="opt != 1" />
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select v-model="form.sex" placeholder="请选择性别" style="width: 202px;" :disabled="opt == 3">
              <el-option v-for="item in userSexList" :label="item.label" :value="item.value" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="注册时间" prop="createTime" v-if="opt != 1">
            <el-input v-model="form.createTime" placeholder="" disabled />
          </el-form-item>
          <el-form-item label="生日" prop="birthday">
            <el-date-picker v-model="form.birthday" type="date" placeholder="请选择生日" :disabled="opt == 3" value-format="yyyy-MM-dd" style="width: 202px;"></el-date-picker>
          </el-form-item>
          <el-row v-if="opt != 3" style="text-align: center;">
            <el-button type="primary" @click="dataFormSubmit">保 存</el-button>
          </el-row>
        </el-card>
        <el-card style="margin-top: 10px;" v-if="opt == 3">
          <div slot="header">
            <span>会员信息</span>
          </div>
            <el-form-item label="会员等级">
              <el-input v-model="vipInfo.levelName" disabled />
            </el-form-item>
            <el-form-item label="成长值">
              <el-input v-model="vipInfo.growthValue" :disabled="opt != 1" />
            </el-form-item>
        </el-card>
        <el-card style="margin-top: 10px;" v-if="opt == 3">
          <div slot="header">
            <span>权益信息</span>
          </div>
            <el-form-item label="可用积分">
              <el-input v-model="vipInfo.availableIntegral" placeholder="请输入账户名称" disabled />
            </el-form-item>
            <el-form-item label="可用优惠券">
              <el-input v-model="vipInfo.coupon" :disabled="opt != 1" />
            </el-form-item>
        </el-card>
      </el-form>
    </div>
  </div>
</template>

<script>
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import {
    getUserById,
    saveUser,
    updateUser,
    getUserMemberRights,
  } from '@/api/vip/user'
  // 权限判断指令
  import permission from '@/directive/permission/index'
  import closeDeactivatedVNode from "@/mixins/closeDeactivatedVNode";

  export default {
    name: 'userList',
    components: { },
    directives: { permission },
    mixins: [closeDeactivatedVNode],
    data() {
      var validatePass = (rule, value, callback) => {
        var reg = /^[1][0-9]{10}$/;
        if(!reg.test(value)) {
          callback(new Error('请输入正确的手机号'));
        } else {
          callback();
        }
      };
      return {
        // 用户性别列表
        userSexList: [{'value': 0, 'label': '男'},{'value': 1, 'label': '女'}, {'value': 2, 'label': '保密'}],
        title: '新增用户',
        opt: 1,
        form: {
          id: undefined,
        },
        vipInfo: {},
        rules: {
          mobile: [
            { required: true, validator: validatePass, trigger: 'blur' }
          ],
          email: [
            {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
          ]
        }
      }
    },
    watch:{
      $route(val){
        if(this.$route.query.id!=this.form.id || this.$route.query.opt!=this.opt) {
          console.log('变了',val)
          this.init()
        }
      }
    },
    mounted() {
      this.init()
    },
    methods: {
        // 初始化数据，opt: 1.新增 2.编辑 3.查看
        init() {
          // 重置数据
          this.reset();
          this.form.id = this.$route.query.id || undefined;
          this.opt = this.$route.query.opt || undefined;
          if(!this.opt) {
            this.$router.push({path: `/vip/userList`})
          }
          if(this.opt == 1) {
            this.title = '新增用户';
          } else if(this.opt == 2) {
            this.title = '编辑用户';
          } else if(this.opt == 3) {
            this.title = '查看用户';
          }
          this.getData();
        },
        // 获取用户信息
        getData() {
          if(this.form.id ) {
            getUserById(this.form.id).then((res) => {
              this.form = res.data;
              if(this.opt == 3) {
                this.getMemberRights();
              }
            });
          }
        },
        getMemberRights() {
          getUserMemberRights(this.form.uniqueUserId).then((res) => {
              this.vipInfo = res.data;
              this.vipInfo.coupon = this.vipInfo.coupon == null ? 0 : this.vipInfo.coupon;
            });
        },
        // 保存数据
        dataFormSubmit() {
          this.$refs['form'].validate((valid) => {
            if(valid) {
              if(this.opt == 1) {
                // 新增
                saveUser(this.form).then((res) => {
                  this.$baseMessage('新增成功', 'success')
                  this.$emit('refreshDataList');
                });
              } else if(this.opt == 2) {
                // 编辑
                let data = {id: this.form.id, sex: this.form.sex,birthday: this.form.birthday};
                updateUser(data).then((res) => {
                  this.$baseMessage('编辑成功', 'success')
                });
              } else {
              }
            }
          });
        },
        cancel() {
          if(this.opt != 3) {
            this.$confirm('确认关闭？').then(_ => {
              done();
            }).catch(_ => {});
          } else {
          }
        },
        reset() {
          this.form = {
            userName: undefined,
            nickName: undefined,
            mobile: undefined,
            email: undefined,
            sex: undefined,
            birthday: undefined,
            createTime: undefined,
          };
          this.vipInfo = {
            levelName: '加载中',
            growthValue: 0,
            availableIntegral: 0,
            coupon: 0,
          };
          this.$refs['form'].resetFields();
        }
    },
  }
</script>

<style lang="scss" scoped>

</style>
