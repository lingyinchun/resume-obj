<template>
  <iframe :src="'https://element.eleme.cn/#/zh-CN/component/tabs'" />
</template>

<script>
export default {
  components: {},
  data() {
    return {}
  },
  computed: {},
  watch: {
    $route(newValue, oldValue){
      this.setUrl(newValue);
    }
  },
  methods: {
    setUrl(route) {
      console.log('setUrl', route)
    }
  },
  created() {},
  mounted() {}
}
</script>
<style lang='scss' scoped>
</style>
