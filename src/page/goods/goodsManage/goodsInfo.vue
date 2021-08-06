<template>
  <div class="app-container">
    <el-row class="form-box">
      <el-divider content-position="left">基本信息</el-divider>
      <el-form :inline="true" :model="formInfo" class="demo-form-inline" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="商品名称">
              <el-input v-model="formInfo.goodsName" placeholder="商品名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="副标题">
              <el-input v-model="formInfo.subtitle" placeholder="副标题"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品编码">
              <el-input v-model="formInfo.skuCode" placeholder="审批人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品牌名称">
              <el-input v-model="formInfo.brandName" placeholder="品牌名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="类目名称">
              <el-input v-model="formInfo.categoryName" placeholder="类目名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品英文名">
              <el-input v-model="formInfo.goodsNameEn" placeholder="商品英文名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">渠道信息</el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="库存">
              <el-input v-model="formInfo.channel.channelInventory" placeholder="库存"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="市场价">
              <el-input v-model="formInfo.channel.channelMarketPrice" placeholder="市场价"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="标准价">
              <el-input v-model="formInfo.channel.channelPrice" placeholder="标准价"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="权重">
              <el-input v-model="formInfo.channel.weight" placeholder="权重"></el-input>
            </el-form-item>
          </el-col>
<!--          <el-col :span="8">-->
<!--            <el-form-item label="限购数量">-->
<!--              <el-input v-model="formInfo.perPersonLimit" placeholder="限购数量"></el-input>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="8">
            <el-form-item label="销量">
              <el-input v-model="formInfo.channel.channelSales" placeholder="销量"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="浏览量">
              <el-input v-model="formInfo.channel.channelViewCount" placeholder="浏览量"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
<!--        <el-col :span="8">-->
<!--          <el-form-item label="是否多规格">-->
<!--            <el-switch v-model="formInfo.isMoreSpec"></el-switch>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="8">-->
<!--          <el-form-item label="送货方式">-->
<!--            <el-radio-group v-model="formInfo.supplyMode">-->
<!--              <el-radio label="1">直送</el-radio>-->
<!--              <el-radio label="2">自送</el-radio>-->
<!--            </el-radio-group>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
      </el-form>
    </el-row>
  </div>
</template>

<script>
import closeDeactivatedVNode from "@/mixins/closeDeactivatedVNode";

export default {
  name: "goodsInfo",
  mixins: [closeDeactivatedVNode],
  props: ['data'],
  data() {
    return {
      formInfo: this.data
    }
  },
  mounted() {
    console.log(this.formInfo)
  },
  methods: {
    initTable() {
      // getGoodsInfo(this.$route.query.skuCode).then((res) => {
      //   if (res.code === 200) {
      //     this.formInfo = res.data
      //   }
      // })
    },
    goBack() {
      this.$router.push('/goods/goodsManage/goodsList')
      this.$store.dispatch('permission/closeTagsByPath', 'goods/goodsManage/goodsInfo')
    }
  }
}
</script>

<style scoped>
.form-box {
  width: 100%;
  padding: 20px;
  background: #ffffff;
  box-sizing: border-box;
}
</style>
