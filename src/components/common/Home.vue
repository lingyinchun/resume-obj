<template>
  <div class="wrapper">
    <v-head />
    <!--    <v-sidebar></v-sidebar>-->
    <div
      class="content-box"
      v-loading="pageLoading"
      :class="{'content-collapse':collapse}"
      element-loading-background="rgb(44 105 123 / 8%)"
    >
      <!--      <v-tags></v-tags>-->
      <!--无iframe-->
      <div style="overflow:scroll;height:100%;">
        <section class="app-main">
          <keep-alive>
            <router-view />
          </keep-alive>
        </section>
        <div style="height:30px;width:100%;"></div>
      </div>
    </div>
  </div>
</template>

<script>
import vHead from './Header.vue';
import vSidebar from './Sidebar.vue';
import vTags from './Tags.vue';
import bus from './bus';
export default {
  data() {
    return {
      tagsList: [],
      collapse: false,
      editableTabsValue: '',
      editableTabs: []
    };
  },
  components: {
    vHead,
    vSidebar,
    vTags
  },
  watch: {
    $route(newValue, oldValue) {
      this.addTab(newValue);
    }
  },
  computed: {
    pageLoading() {
      return this.$store.state.permission.pageLoading
    }
  },
  created() {
    bus.$on('collapse-content', msg => {
      this.collapse = msg;
    });

    // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
    bus.$on('tags', msg => {
      // let arr = [];
      // for (let i = 0, len = msg.length; i < len; i++) {
      //     msg[i].name && arr.push(msg[i].name);
      // }
      // this.tagsList = arr;
      // console.log('tagsList', this.tagsList)
      console.log('msg', msg)
      this.editableTabs = msg
      if (!this.editableTabsValue && msg && msg.length > 0) {
        this.$nextTick(() => {
          this.editableTabsValue = msg[msg.length - 1].id + ''
        })
      }
      // console.log(this.editableTabsValue)
      // console.log('bus.$on', this.editableTabs)
    });
  },
  mounted() {
    this.listenPage()
  },
  methods: {
    addTab(tab) {
      // console.log('addtab', tab)
      this.$nextTick(() => {
        this.editableTabsValue = tab.meta.id + ''
      })
    },
    listenPage() {
      // window.onbeforeunload = function (e) {
      //   e = e || window.event;
      //   if (e) {
      //     e.returnValue = '关闭提示aaaa';
      //   }
      //   return '关闭提示aaaa';
      // };
    }
  }
};
</script>

<style lang="scss">
.app-main {
    padding: 12px;
}
.home-tabs {
    .el-tabs__content {
        width: 100%;
        height: 100%;
        //overflow: hidden scroll;
        .el-tab-pane {
            width: 100%;
            height: 100%;
            overflow: scroll;
        }
    }
}
.home-tabs > .el-tabs__header {
    display: none;
}

.hello-box {
    text-align: center;
    margin-top: 30%;
    font-size: 50px;
    color: #337ba5;
}
</style>
