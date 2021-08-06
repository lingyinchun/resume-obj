<template>
  <div class="app-container">
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="成长值规则" name="first">
        <user-growth ref="user-growth"></user-growth>
      </el-tab-pane>
      <el-tab-pane label="积分规则" name="second">
        <user-integral ref="user-integral"></user-integral>
      </el-tab-pane>
      <el-tab-pane label="订单失效设置" name="third">
        <order-aging ref="order-aging"></order-aging>
      </el-tab-pane>
      <el-tab-pane label="隐私政策" name="four">
        <agreement ref="agreement"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import userGrowth from './components/userGrowth'
import userIntegral from './components/userIntegral'
import orderAging from './components/orderAging'
import agreement from './components/agreement'

export default {
  name: 'settingRule',
  components: {userGrowth, userIntegral, orderAging, agreement},
  data() {
    return {
      activeName: 'first',
      name: 'first',
    }
  },
  created() {
  },
  methods: {
    handleClick(tab, event) {
      if (this.name == tab.name) {
        return;
      }
      if (tab.name == 'first') {
        this.$refs['user-growth'].getDataList();
      } else if (tab.name == 'second') {
        this.$refs['user-integral'].getDataList();
      } else if (tab.name == 'third') {
        this.$refs['order-aging'].getDataList();
      } else if (tab.name == 'four') {
        this.$refs['agreement'].getDataList();
      }
      this.name = tab.name;
    }
  }
}

</script>

<style lang="scss" scoped>
.home-tabs .app-container .el-tabs__content .el-tab-pane {
  margin-top: 20px;
}
</style>
