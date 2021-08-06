<template>
  <div class="html_disabled" v-html="content"></div>
</template>

<script>
export default {
  name: "HtmlContent",
  props: ['content']
}
</script>

<style scoped>
.html_disabled {
  padding: 5px 10px;
  border: 1px solid #eeeeee;
  background: #f5f7fa87;
  border-radius: 4px;
}
</style>
