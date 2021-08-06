<template>
  <i :class="`el-icon-lx-${icon}`" :style="{ fontSize: fontSize+'px'}"></i>
</template>

<script>
export default {
    components: {},
    props: ['icon', 'fontSize'],
    data(){
      return {
        str: ''
      }
    }
};
</script>
