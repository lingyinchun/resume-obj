<template>
  <div class="app-container">
    <el-tabs v-model="active" type="border-card" @tab-click="handleClick" :lazy="true">
      <el-tab-pane name="1" label="商品详情">
        <GoodsInfo v-if="formInfo.id" :data="formInfo"/>
      </el-tab-pane>
      <el-tab-pane name="2" label="商品图片">
        <el-row v-if="formInfo && formInfo.goodsPictures">
          <el-col :span="4" v-for="(img,index) in formInfo.goodsPictures" :key="index" class="img_box">
            <img :src="'http:'+img" />
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane name="3" label="商品描述" :lazy="true" >
        <el-row :style="{'height':(height+'px'),overflowY:'scroll'}">
          <DesInfo/>
        </el-row>
      </el-tab-pane>
      <el-tab-pane name="4" label="商品属性" :lazy="true">
        <el-row>
          <AttrInfo/>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import closeDeactivatedVNode from "@/mixins/closeDeactivatedVNode";
import GoodsInfo from './goodsInfo'
import AttrInfo from './components/attrInfo'
import DesInfo from './components/desInfo'
import {getGoodsInfo} from "@/api/goods/goods";
import {deepClone} from "@/utils/util";

const objInfo = {
  "id": '',
  "sourceType": undefined,
  "goodsType": undefined,
  "goodsCategoryId": undefined,
  "brandId": undefined,
  "isMoreSpec": false,
  "specValue": null,
  "goodsName": '',
  "goodsNameEn": null,
  "subtitle": '',
  "mainFigure": '',
  "supplyMode": undefined,
  "marketPrice": null,
  "price": undefined,
  "expressFreight": undefined,
  "inventory": undefined,
  "sales": undefined,
  "perPersonLimit": undefined,
  "viewCount": undefined,
  "goodsStatus": undefined,
  "createTime": '',
  "goodsSkuList": null,
  "channel": {}
}

export default {
  name: "goodsInfoTab",
  mixins: [closeDeactivatedVNode],
  components: {GoodsInfo,AttrInfo,DesInfo},
  data() {
    return {
      active: '1',
      formInfo: deepClone(objInfo),
      height: 500
    }
  },
  created() {
    this.init()
    this.height = (document.getElementsByClassName('content-box')[0].clientHeight-105)
  },
  methods: {
    init() {
      getGoodsInfo(this.$route.query.skuCode).then((res) => {
        if (res.code === 200) {
          this.formInfo = res.data
        }
      })
    },
    handleClick(val) {
    },
    goBack() {
      this.$router.push('/goods/goodsManage/goodsList')
      this.$store.dispatch('permission/closeTagsByPath', 'goods/goodsManage/goodsInfo')
    }
  }
}
</script>

<style scoped lang="scss">
.form-box {
  width: 100%;
  padding: 20px;
  background: #ffffff;
  box-sizing: border-box;
}
.img_box{
  img{
    width:100%;
    border: 1px solid #eeeeee;
  }
}
</style>
