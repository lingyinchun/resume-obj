<template>
  <el-date-picker
      v-model="value2"
      type="datetimerange"
      :picker-options="pickerOptions"
      range-separator="至"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
      align="right"
      :size="size"
      value-format="yyyy-MM-dd HH:mm:ss"
      :default-time="defaultTime"
      :disabledDate="disabledDate"
  >
  </el-date-picker>
</template>

<script>
import {getPickerOptions} from "@/utils";

export default {
  name: "ElDatePickerCom",
  props: {
    size: {
      type: String,
      default: ''
    },
    value: {
      type: Array,
      default() {
        return []
      }
    },
    disabledDate: {
      type: Boolean,
      default: false
    },
    defaultTime:{
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      pickerOptions: getPickerOptions(),
      value2: this.value,
    }
  },
  watch: {
    value(val) {
      this.value2 = val
    },
    value2(val) {
      this.$emit('input', val)
      this.$emit('change', val)
    }
  },
  created() {
    if(this.disabledDate){
      this.pickerOptions.shortcuts = null
      this.pickerOptions.disabledDate = (time) => {
        return time.getTime() < Date.now() - (24*60*60*1000);
      }
    }
  }
}
</script>

<style scoped>

</style>
