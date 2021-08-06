<template>
  <div>
    <el-row style="padding: 10px;">
      <el-col :span="8">
        <el-input v-model="item.name"/>
      </el-col>
      <el-col :span="16">
        <el-row v-for="chi in item.children" :key="chi.index">
          <el-col :span="12">
            <el-input v-model="chi.url"/>
          </el-col>
          <el-col :span="12">
            <el-input-number v-model="chi.price"/>
            <el-button @click="deleteChi(chi.index)">删除</el-button>
          </el-col>
        </el-row>
        <el-button @click="add">增加</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "info",
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      str: ''
    }
  },
  methods: {
    add() {
      this.item.children.push({url: '',price: '',index: new Date().getTime()})
    },
    deleteChi(index) {
      const list = this.item.children.filter((v)=>{
        return v.index != index
      })
      this.$set(this.item,'children',list)
    }
  }
}
</script>

<style scoped>

</style>
