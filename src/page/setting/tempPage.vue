<template>
  <div class="app-container">
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="邮件模版" name="1" lazy>
        <EmailMessage ref="emailMessage"></EmailMessage>
      </el-tab-pane>
      <el-tab-pane label="任务列表" name="2" lazy>
        <TaskModule ref="FreightSet" @viewRecord="viewRecord"></TaskModule>
      </el-tab-pane>
      <el-tab-pane label="发送记录" name="3" lazy>
        <EmailRecord ref="emailRecord" :emailTaskId="emailTaskId"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import EmailMessage from './emailMessage/list'
import TaskModule from './taskModule/list'
import EmailRecord from './emailRecord'
import closeDeactivatedVNode from "@/mixins/closeDeactivatedVNode";

export default {
  name: 'settingRule',
  mixins: [closeDeactivatedVNode],
  components: {EmailMessage, TaskModule, EmailRecord},
  data() {
    return {
      activeName: '1',
      emailTaskId: ''
    }
  },
  watch: {
    $route: {
      handler(){
        this.activeName = this.$route.query.activeName || '1'
        this.$nextTick(()=>{
          this.changeTab()
        })
      },
      immediate: true
    }
  },
  mounted() {
    // this.activeName = this.$route.query.activeName || '1'
  },
  methods: {
    handleClick(tab) {
      this.activeName = tab.name
      // this.changeTab()
    },
    changeTab() {
      if (this.activeName == '1') {
        this.$refs.emailMessage.initTable()
      } else if (this.activeName == '2') {
        this.$refs.FreightSet.initTable()
      } else {
        this.$refs.emailRecord.initTable()
      }
    },
    viewRecord(id){
      this.emailTaskId = id
      this.activeName = '3'
    }
  }
}

</script>

<style lang="scss" scoped>
.home-tabs .app-container .el-tabs__content .el-tab-pane {
  margin-top: 20px;
}
</style>
