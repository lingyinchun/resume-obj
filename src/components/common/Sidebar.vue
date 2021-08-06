<template>
  <div class="sidebar">
    <el-menu class="sidebar-el-menu"
             :default-active="onRoutes"
             :collapse="collapse"
             background-color="#324157"
             text-color="#ffffff"
             router>
      <template v-for="item in routerData">
        <template v-if="item.childCategoryList">
          <el-submenu :index="item.id+''"
                      :key="item.id">
            <template slot="title">
              <IconTem :icon="item.icon" />
              <span slot="title">{{ item.resourceName }}</span>
            </template>
            <template v-for="subItem in item.childCategoryList">
              <template v-if="subItem.childCategoryList">
                <!--循环三级-->
                <el-submenu :index="subItem.id+''"
                            :key="subItem.id">
                  <template slot="title">
                    <IconTem :icon="subItem.icon" />
                    <span slot="title">{{ subItem.resourceName }}</span>
                  </template>
                  <template>
                    <el-menu-item v-for="subItem2 in subItem.childCategoryList"
                                  :key="subItem2.id"
                                  :index="subItem2.resourceType==3 ? `${subItem.url}/page-${subItem2.id}` : subItem2.url">
                      <template slot="title">
                        <IconTem :icon="subItem2.icon" />
                        <span slot="title">{{ subItem2.resourceName }}</span>
                      </template>
                    </el-menu-item>
                  </template>
                </el-submenu>
              </template>
              <!--二级-->
              <el-menu-item v-else
                            :index="subItem.resourceType==3 ? `${item.url}/page-${subItem.id}` : subItem.url"
                            :key="subItem.id">
                <template slot="title">
                  <IconTem :icon="subItem.icon" />
                  <span slot="title">{{ subItem.resourceName }}</span>
                </template>
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.resourceType==3 ? `page-${item.id}` : item.url"
                        :key="item.id">
            <IconTem :icon="item.icon" />
            <span slot="title">{{ item.resourceName }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from '../common/bus'
export default {
  data() {
    return {
      collapse: false
    }
  },
  computed: {
    onRoutes() {
      return this.$route.path
    },
    routerData() {
      let data = this.$store.state.permission.routes
      if(!data || data.length==0){
        data = [{
          "id": 0,
          "parentId": 0,
          "resourceCode": null,
          "resourceType": 1,
          "resourceName": "系统首页",
          "url": "/",
          "icon": "settings",
          "sortNumber": 1,
          "isEnable": true,
          "createTime": "2020-12-18 14:13:27",
          }]
      }

      // console.log('routerData', this.$store.state.permission.routes)
      return data
    }
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on('collapse', msg => {
      this.collapse = msg
      bus.$emit('collapse-content', msg)
    })
  }
}
</script>

<style scoped lang="scss">
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
  z-index: 6;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 200px;
}
.sidebar-el-menu{
  i{
    color: #fefefe;
  }
}
.sidebar > ul {
  height: 100%;
}
.el-submenu__title i {
  color: #ffffff;
}
/* .el-menu-item:hover {
  background-color: #1890FF !important;
}
::v-deep .el-submenu__title:hover{
  background:#1890FF !important;
} */
::v-deep .el-menu-item:hover {
  background-color: #5c84ad !important;
}
::v-deep .el-menu-item.is-active{
  color: #ffffff !important;
  background: #409EFF !important;
}
</style>
