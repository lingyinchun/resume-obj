<template>
  <div class="login-wrap">
    <div class="login-box">
      <div class="left-img">
        <img src="../assets/img/img_03.png" />
      </div>
      <div class="ms-login">
        <div class="ms-title">史泰博后台管理系统</div>
        <el-form :model="param"
                 :rules="rules"
                 ref="login"
                 label-width="0px"
                 class="ms-content">
          <el-form-item prop="username">
            <el-input v-model="param.username"
                      placeholder="账号">
              <el-button slot="prepend"
                         icon="el-icon-lx-people"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password"
                      placeholder="密码"
                      v-model="param.password"
                      @keyup.enter.native="submitForm()">
              <el-button slot="prepend"
                         icon="el-icon-lx-lock"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input placeholder="验证码"
                      v-model="param.code"
                      @keyup.enter.native="submitForm()">
              <el-button slot="prepend"
                         icon="el-icon-key"></el-button>
              <img :src="codeUrl"
                   slot="append"
                   class="code-sty"
                   @click="getCodeFn" />
            </el-input>
          </el-form-item>
          <img :src="codeUrl"
               slot="append"
               class="code-sty" />
          <div class="login-btn">
            <el-button type="primary"
                       :disabled="codeError"
                       @click="submitForm()">登录</el-button>
          </div>
        </el-form>
      </div>
    </div>

  </div>
</template>

<script>
import { getCode } from '@/api/user'
export default {
  data: function() {
    return {
      codeUrl: '',
      codeError: true,
      param: {
        username: '',
        password: '',
        code: '',
        key: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.getCodeFn()
  },
  methods: {
    getCodeFn() {
      getCode().then(data => {
        if (data.code === 200) {
          this.codeError = false
          this.codeUrl = data.data.codeUrl
          this.param.key = data.data.key
        }
      }).catch(()=>{
        this.codeError = true
      })
    },
    submitForm() {
      if (!this.param.code) {
        this.$message.error('请输入验证码')
        return
      }
      this.$refs.login.validate(valid => {
        if (valid) {
          this.$store.dispatch('user/loginByUsername', this.param).then(() => {
            this.$router.push('/')
          })
          // this.$message.success('登录成功');
          // localStorage.setItem('ms_username', this.param.username);
          // this.$router.push('/');
        } else {
          this.$message.error('请输入账号和密码')
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px solid #f5f5f5;
  box-sizing: border-box;
  background-image: url(../assets/img/login-bg.jpg);
  background-size: cover;
  background-repeat: no-repeat;
}
.login-box {
  width: 670px;
  height: 402px;
  // border: 8px;
  background: #ffffff;
  margin: auto;
  border-radius: 15px;
  overflow: hidden;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translatex(-335px) translateY(-200px);
  display: flex;
  .left-img {
    width: 335px;
    img {
      width: 335px;
    }
  }
}
.code-sty {
  width: 99px;
  height: 34px;
  display: block;
  border-left: 1px solid #dcdfe6;
}
.ms-title {
  width: 275px;
  line-height: 50px;
  text-align: center;
  margin: 30px 30px 0;
  font-size: 22px;
  color: #fff;
  color: #66b1ff;
  /* font-weight: bold; */
  border-bottom: 1px solid #66b1ff;
}
.ms-login {
  width: 335px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
  .el-input-group__append {
    padding: 0;
    overflow: hidden;
  }
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>
