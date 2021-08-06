<template>
  <div>
    <el-row v-for="(attr,index) in attrInfo" :key="index" :gutter="20" style="margin-bottom: 8px;">
      <el-col :span="10" :offset="2">
        属性名：{{attr.attributeName}}
      </el-col>
      <el-col :span="10">
        {{attr.attributeNameValue}}
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {getAttribute} from "@/api/goods/goods";
export default {
  name: "info.vue",
  data() {
    return {
      attrInfo: ''
    }
  },
  mounted() {
    getAttribute(this.$route.query.skuCode).then((res)=>{
      if(res.code === 200){
        this.attrInfo = res.data
      }
    })
  }
}
</script>

<style scoped>

</style>
