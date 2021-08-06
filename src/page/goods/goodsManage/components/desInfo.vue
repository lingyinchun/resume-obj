<template>
  <div class="desinfo">
    <div v-html="info"></div>
  </div>
</template>

<script>
import {getDescription} from "@/api/goods/goods";
export default {
  name: "info.vue",
  data() {
    return {
      info: ''
    }
  },
  mounted() {
    getDescription(this.$route.query.skuCode).then((res)=>{
      if(res.code === 200){
        this.info = res.data
      }
    })
  }
}
</script>

<style lang="scss">
.desinfo{
  img{
    width: 100%;
  }
}
</style>
