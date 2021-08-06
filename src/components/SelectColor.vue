<template>
  <div class='select-color'>
    <div style="height:36px;cursor: pointer;">
      <div class="select-val" :style="{background: value}" @click="showIcon = !showIcon"></div>
    </div>
    <div class="colorlist" v-show="showIcon">
      <div v-for="item in colorList" :key="item" class="color-box"
      :style="{background: item}" @click="selectColor(item)"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      showIcon: false,
      colorList: ['#e7b05c','#868686','#e96c50','#75b06d','#48a97a','#6ab7de','#6385bd','#9b6fc8','#eec154','#eb962d','#fb9f2e','#aac564','#de5850','#cf3e36']
    }
  },
  created() {
    if(this.list && this.list.length>0){
      this.colorList = this.list
    }
  },
  methods: {
    selectColor(color) {
      this.$emit('input', color)
      this.showIcon = false
    }
  }
}
</script>
<style lang='scss' scoped>
.select-color{
  width: 220px;
  height: 36px;
  box-sizing: border-box;
  position: relative;
  z-index: 2;
  padding-top: 5px;
}
.select-val{
  width: 38px;
  height: 28px;
  box-sizing: border-box;
  border-radius: 5px;
  display: inline-block;
  border: 1px solid #cccccc;
}
.colorlist{
  position: absolute;
  top: 40px;
  left: 0px;
  background: #ffffff;
  width: 210px;
  display: flex;
  box-shadow: 0 2px 8px 0 rgba(200,201,204,.5);
  flex-wrap: wrap;
  padding: 10px 0 0 10px;
  border: 1px solid #ddd;
  .color-box{
    width: 20px;
    height: 20px;
    border-radius: 2px;
    box-shadow: inset 0 0 0 1px rgba(0,0,0,.2);
    margin: 0 10px 10px 0;
    cursor: pointer;
  }
}
</style>
