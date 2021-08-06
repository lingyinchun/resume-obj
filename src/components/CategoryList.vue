<template>
  <div >
    <div class="tree-box" v-loading="loading">
      <el-tree ref="tree" :data="data" node-key="id" :default-expanded-keys="expandedKeys" show-checkbox :props="defaultProps"></el-tree>
    </div>
    <el-button @click="getData" type="primary">保存</el-button>
<!--    <el-button @click="setCheckedKeys">设置</el-button>-->
  </div>
</template>

<script>
import { getBackgroundTree } from '@/api/goods/category'
import { batchAdd, getGoodsCategoryId } from '@/api/goods/marketing'
export default {
  props: ['marketingId','marketingType'],
  data() {
    return {
      data: [],
      loading: false,
      expandedKeys: [],
      defaultProps: {
        children: 'childCategoryList',
        label: 'categoryName'
      }
    };
  },
  mounted() {
    this.loading = true
    getBackgroundTree().then((res)=>{
      this.loading = false
      if(res.code===200){
        this.data = res.data
      }
    })
    this.getSkuCode()
  },
  methods: {
    getSkuCode(){
      getGoodsCategoryId({marketingId:this.marketingId,marketingType: this.marketingType}).then((res)=>{
        if(res.code === 200 && res.data && res.data.length>0){
          // this.multioleSelectionData = res.data
          // this.expandedKeys = res.data
          this.$refs.tree.setCheckedKeys(res.data);
        }
      })
    },
    setCheckedKeys() {
      this.$refs.tree.setCheckedKeys([7]);
    },
    getData() {
      const list = this.$refs.tree.getCheckedNodes(true,false);
      // console.log('list', list)
      if(!list || list.length===0){
        return
      }
      let params = list.map((v)=>{
        return {
          goodsCategoryName: v.categoryName,
          marketingId: this.marketingId,
          marketingType: this.marketingType,// 1.优惠券 2.订单促销
          goodsCategoryId: v.id
        }
      })
      // console.log(param);
      batchAdd(params).then((res)=>{
        if(res.code === 200){
          this.$baseMessage('操作成功', 'success')
          this.$emit('initTable')
        }
      })
    }
  }
};
</script>

<style scoped lang="scss">
.tree-box{
  width: 100%;
  min-height: 300px;
  max-height: 550px;
  overflow-y: scroll;
  border: 1px solid #e1e1e1;
  margin-bottom: 15px;
}
</style>
