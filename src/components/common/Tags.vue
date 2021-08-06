<template>
  <div class="tags"
       v-if="showTags">
    <ul v-if="tagsList.length>0">
      <li class="tags-li"
          v-for="(item,index) in tagsList"
          :class="{'active': item.isActive}"
          :key="index">
        <router-link :to="item.path"
                     class="tags-li-title">
          {{item.title}}
        </router-link>
        <span class="tags-li-icon"
              @click="closeTags(index)"><i class="el-icon-close"></i></span>
      </li>
    </ul>
    <div class="tags-close-box">
      <el-dropdown @command="handleTags">
        <el-button size="mini">
          标签选项<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu size="small"
                          slot="dropdown">
          <el-dropdown-item command="other">关闭其他</el-dropdown-item>
          <el-dropdown-item command="all">关闭所有</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import bus from './bus'
import store from "@/store";
export default {
  data() {
    return {
      // tagsList: []
    }
  },
  computed: {
    showTags() {
      return this.tagsList.length > 0
    },
    tagsList() {
      let list = []
      list = this.$store.state.permission.tagsList.map((v)=>{
        v.isActive = v.path === this.$route.fullPath
        return v
      })
      return list
    }
  },
  watch: {
    $route(newValue, oldValue) {
      this.setTags(newValue)
    }
  },
  methods: {
    // 关闭单个标签
    closeTags(index) {
      // console.log('this.$router', index)
      // console.log(this.$vnode)
      this.$store.dispatch('permission/closeTags', index).then((res)=>{
        console.log('关闭', res)
        if(res.length>0){
          this.$router.push(res[res.length-1].path)
        }else{
          this.$router.push('/')
        }
      });

    },
    // 关闭全部标签
    closeAll() {
      // this.tagsList = []
      this.$store.dispatch('permission/closeAllTagList')
      this.$router.push('/')
    },
    // 关闭其他标签
    closeOther() {
      this.$store.dispatch('permission/closeOther', this.$route.fullPath)
          .then((res)=>{})
    },
    // 设置标签
    setTags(route) {
      this.$store.dispatch('permission/setTags', route).then((res)=>{
      })
      // bus.$emit('tags', this.tagsList)
    },
    handleTags(command) {
      command === 'other' ? this.closeOther() : this.closeAll()
    }
  },
  created() {
    this.setTags(this.$route)
  }
}
</script>


<style lang="scss" scoped>
.tags {
  position: relative;
  width: 100%;
  height: 46px;
  overflow: hidden;
  background: #fff;
  padding-right: 120px;
  box-shadow: 0 5px 10px #ddd;
  z-index: 5;
}

.tags ul {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

.tags-li {
  float: left;
  margin: 5px 5px 2px 5px;
  border-radius: 5px;
  font-size: 12px;
  overflow: hidden;
  cursor: pointer;
  height: 32px;
  line-height: 32px;
  border: 1px solid #e9eaec;
  background: #fff;
  padding: 0 5px 0 12px;
  vertical-align: middle;
  color: #666;
  -webkit-transition: all 0.3s ease-in;
  -moz-transition: all 0.3s ease-in;
  transition: all 0.3s ease-in;
  .tags-li-icon{
    font-size: 18px;
  }
}

.tags-li:not(.active):hover {
  background: #b3d8ff;
}

.tags-li.active {
  color: #fff;
  background: #409EFF;
}
.tags-li.active .tags-li-title {
  color: #fff;
}

.tags-li-title {
  float: left;
  max-width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 5px;
  color: #666;
}
.tags-close-box {
  position: absolute;
  right: 120px;
  top: 0;
  box-sizing: border-box;
  padding-top: 1px;
  text-align: center;
  width: 110px;
  height: 46px;
  padding-top: 5px;
  background: #fff;
  box-shadow: -3px 0 15px 3px rgba(0, 0, 0, 0.1);
  z-index: 10;
  .el-dropdown{
    .el-button{
      height: 34px;
    }
  }
}
</style>
