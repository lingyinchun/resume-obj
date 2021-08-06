<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <!--    <div class="collapse-btn" @click="collapseChage">-->
    <!--      <i v-if="!collapse" class="el-icon-s-fold"></i>-->
    <!--      <i v-else class="el-icon-s-unfold"></i>-->
    <!--    </div>-->
    <div class="logo">1</div>
    <div class="platform">
      <router-link to='/'>
        <el-button
          type="text"
          style="margin-right: 10px"
        >首页</el-button>
      </router-link>
      <router-link to='/BaseCharts'>
        <el-button type="text">BaseCharts</el-button>
      </router-link>
    </div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 全屏显示 -->
        <div
          class="btn-fullscreen"
          @click="handleFullScreen"
        >
          <el-tooltip
            effect="dark"
            :content="fullscreen?`取消全屏`:`全屏`"
            placement="bottom"
          >
            <i class="el-icon-rank"></i>
          </el-tooltip>
        </div>
        <!-- 消息中心 -->
        <div class="btn-bell">
          <el-tooltip
            effect="dark"
            :content="message?`有${message}条未读消息`:`消息中心`"
            placement="bottom"
          >
            <router-link to="/tabs">
              <i class="el-icon-bell"></i>
            </router-link>
          </el-tooltip>
          <span
            class="btn-bell-badge"
            v-if="message"
          ></span>
        </div>
        <!-- 用户头像 -->
        <div class="user-avator">
          <img src="../../assets/img/login-bg.jpg" />
        </div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown
          class="user-name"
          trigger="click"
          @command="handleCommand"
        >
          <span class="el-dropdown-link">
            {{ username }}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              divided
              command="updatePwd"
            >修改密码</el-dropdown-item>
            <el-dropdown-item
              divided
              command="loginout"
            >退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <el-dialog
      v-if="open"
      title="修改密码"
      :visible.sync="open"
      width="460px"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="pwdForm"
        :model="pwdForm"
        :rules="rules"
        label-width="80px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="新密码"
              prop="userPwd"
            >
              <el-input
                v-model="pwdForm.userPwd"
                type="password"
                placeholder="请输入密码"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="确认密码"
              prop="resetPassword"
            >
              <el-input
                v-model="pwdForm.resetPassword"
                type="password"
                placeholder="请输入确认密码"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="submitPwdForm"
        >确 定</el-button>
        <el-button @click="open=false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import bus from '../common/bus';
// import {updateUserPwd} from "@/api/system/user";

export default {
  data() {
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
      collapse: false,
      fullscreen: false,
      name: '瀚德',
      message: 2,
      open: false,
      // 表单参数
      pwdForm: {
        id: '',
      },
      rules: {
        userPwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'blur',
          },
        ],
        resetPassword: [
          { required: true, validator: resetPassword, trigger: 'blur' },
        ],
      }
    };
  },
  computed: {
    username() {
      let userInfo = JSON.parse(localStorage.getItem('userInfo'));
      return userInfo ? userInfo.nickName : this.name;
    },
    platformName() {
      let userInfo = JSON.parse(localStorage.getItem('userInfo'));
      return userInfo.platformName ? userInfo.platformName : '惠选';
    },
    platformList() {
      this.$store.dispatch('user/getPlatformList').then(() => {
        localStorage.removeItem('userInfo');
        this.$router.push('/login');
      })
    }
  },
  created() {
    if (this.$store.getters.userInfo && this.$store.getters.userInfo.id) {
      this.pwdForm.id = this.$store.getters.userInfo.id
    } else {
      this.pwdForm.id = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).id : ''
    }
  },
  methods: {
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command == 'loginout') {
        this.$store.dispatch('user/logout').then(() => {
          localStorage.removeItem('userInfo');
          this.$router.push('/login');
        })
      } else {
        this.open = true
      }
    },
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse;
      bus.$emit('collapse', this.collapse);
    },
    // 全屏事件
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
    submitPwdForm() {
      this.$refs['pwdForm'].validate((valid) => {
        if (valid) {
          // updateUserPwd(this.pwdForm).then((response) => {
          //   if (response.code === 200) {
          //     this.$baseMessage('修改成功', 'success')
          //     this.open = false
          //   }
          // })
        }
      })
    }
  },
  mounted() {
    if (document.body.clientWidth < 1500) {
      // this.collapseChage();
    }
  }
};
</script>
<style scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #3c3c3c;
}

.collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
}

.header .logo {
    float: left;
    width: 250px;
    line-height: 70px;
}

.header-right {
    float: right;
    padding-right: 20px;
}

.header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
}

.btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
}

.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
}

.btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #3c3c3c;
}

.btn-bell .el-icon-bell {
    color: #3c3c3c;
}

.user-name {
    margin-left: 10px;
}

.user-avator {
    margin-left: 20px;
    border: 1px solid #000000;
}

.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.el-dropdown-link {
    color: #3c3c3c;
    cursor: pointer;
}

.el-dropdown-menu__item {
    text-align: center;
}

.platform {
    float: left;
    margin-top: 18px;
}
</style>
