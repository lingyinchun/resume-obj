<template>
  <div class="app-container">
    <div class="main-container">
      <el-row :gutter="5" style="margin: 10px 0 10px 0;padding-left: 0">
        <el-col :span="8" style="padding-left: 10px" class="cate-title">
          类目树id：{{dataInfo.id}}
<!--          <el-alert :title="'类目树id：' + dataInfo.id" type="info" :closable="false" effect="dark"></el-alert>-->
        </el-col>
        <el-col :span="8" style="padding-left: 10px" class="cate-title">
          类目类型：{{dataInfo.categoryTypeDesc}}
<!--          <el-alert :title="'类目类型：' + dataInfo.categoryTypeDesc" type="info" :closable="false" effect="dark"></el-alert>-->
        </el-col>
        <el-col :span="8" style="padding-left: 10px" class="cate-title">
          类目名称：{{dataInfo.categoryName}}
<!--          <el-alert :title="'类目名称：' + dataInfo.categoryName" type="info" :closable="false" effect="dark"></el-alert>-->
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-card style="background: #fff;max-height: 700px; overflow-y: auto;">
            <el-row style="margin: 0 0 15px 0;">
              <el-input placeholder="输入关键字进行过滤" v-model="filterText" size="small" clearable></el-input>
            </el-row>
            <el-row>
              <el-tree :data="dataList" :props="defaultProps" :load="loadNode" ref="categoryTree" lazy node-key="id"
                       :expand-on-click-node="false" :filter-node-method="filterNode">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span v-if="jhData && jhData.categoryName == node.label" style="color:#409EFF;">{{ node.label }}</span>
                    <span v-else>{{ node.label }}</span>
                    <span>
                      <i class="el-icon-edit" size="mini" circle @click="() => handleNodeClick(data)"></i>
                      <i class="el-icon-circle-plus-outline" size="mini" circle @click="() => handleAddChild(data)"></i>
                      <i v-if="data.isLeaf && data.categoryType==2" class="el-icon-s-unfold" size="mini" circle @click="() => handleChild(node, data)"></i>
                      <i v-if="data.id != id" class="el-icon-delete" size="mini" circle @click="() => remove(node, data)"></i>

                      <!--                      <el-button type="text" size="mini"-->
<!--                                 @click="() => handleNodeClick(data)">编辑</el-button>-->
<!--                      <el-button  type="text" size="mini" @click="() => remove(node, data)">删除</el-button>-->
<!--                      <el-button type="text" size="mini"-->
<!--                                 @click="() => handleAddChild(data)">新增子类目</el-button>-->
<!--                      <el-button v-if="data.isLeaf" type="text" size="mini"-->
<!--                                 @click="() => handleChild(node, data)">聚合</el-button>-->
                    </span>
                </span>
              </el-tree>
            </el-row>
          </el-card>
        </el-col>
        <el-col v-if="operateType==1 || operateType==2" :span="16" style="padding-right: 0">
          <el-card style="background: #fff;max-height: 700px; overflow-y: auto;">
            <div slot="header" class="clearfix">
              <span>{{ title }}</span>
            </div>
            <category-add ref="categoryAdd" :operateType="operateType" @refreshDataList="updateTreeData"></category-add>
          </el-card>
        </el-col>
        <el-col v-show="operateType==3" :span="16">
          <aggregate :jhData="jhData"/>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {goodsCategoryGet, getGoodsCategoryByParentId, goodsCategoryDelete} from '@/api/goods/category'
import categoryAdd from './components/add'
import aggregate from './components/aggregate'
import closeDeactivatedVNode from "@/mixins/closeDeactivatedVNode";

export default {
  name: 'goodsCategoryEdit',
  components: {categoryAdd,aggregate},
  mixins: [closeDeactivatedVNode],
  data() {
    return {
      id: undefined,
      filterText: '',
      title: '编辑类目',
      // 当前页面的数据
      dataInfo: {},
      dataList: [],
      defaultProps: {
        children: 'children',
        label: 'categoryName',
        isLeaf: 'isLeaf'
      },
      operateType: 0,
      jhData: {}
    }
  },
  watch: {
    $route(val) {
      if (this.$route.query.id != this.id) {
        console.log('变了', val)
        this.init()
      }
    },
    filterText(val) {
      this.$refs.categoryTree.filter(val);
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      let id = this.$route.query.id || undefined;
      if (!id) {
        return
      }
      this.id = id;
      this.$nextTick(() => {
        if (id) {
          goodsCategoryGet(id).then((res) => {
            this.dataInfo = res.data;
            this.dataList = [res.data];
            this.$set(this.dataList, 'categoryName', res.data.categoryName)
          });
        }
        // console.log('this.$refs.categoryAdd', this.$refs.categoryAdd)
        // this.$refs.categoryAdd && this.$refs.categoryAdd.init(id);
      })
    },
    // 加载树
    async loadNode(node, resolve) {
      console.log('node', node);
      if (node.level === 0) {
        // const {data} = await goodsCategoryGet(this.id);
        // this.data = data;
        // this.dataList = [data];
        // resolve(this.dataList);
        // this.$set(this.dataList, 'categoryName', data.categoryName)
      } else {
        // 根据父id查询子列表
        getGoodsCategoryByParentId(node.data.id).then((res) => {
          if (res.data) {
            // 当类目=3(后台类目)，总共有7级
            if (node.data.categoryType == 3 && node.level == 6) {
              res.data = res.data.map(v => {
                v.isLeaf = true;
                // this.$set(v, 'categoryName', v.categoryName)
                return v
              })
            }
            res.data.forEach((v) => {
              v.isLeaf = v.isLeaves
            })
            resolve(res.data);
          } else {
            resolve([]);
          }
        });
      }
    },
    // 点击节点，加载编辑数据
    handleNodeClick(data, node) {
      this.operateType = 1
      this.jhData = data
      this.$nextTick(() => {
        this.title = '编辑类目';
        this.$refs.categoryAdd.init(data.id);
      })
    },
    handleAddChild(data) {
      this.operateType = 2
      this.jhData = {}
      this.$nextTick(() => {
        this.title = '新增子类目';
        this.$refs.categoryAdd.init(undefined, data.id);
      })
    },
    // 编辑后更新树数据
    updateTreeData(data) {
      console.log('修改的数据', data);
      if (data.id) {
        // 编辑
        this.$refs.categoryTree.getNode(data.id).data.categoryName = data.categoryName;
      } else {
        // 新增子类目
        // this.$refs.categoryTree.append(data, data.parentId);
        // 根据父id查询子列表
        getGoodsCategoryByParentId(data.parentId).then((res) => {
          if (res.data) {
            let node = this.$refs.categoryTree.getNode(data.parentId);
            // 当类目=3(后台类目)，总共有7级
            if (node.data.categoryType == 3 && node.level == 6) {
              res.data = res.data.map(v => {
                v.isLeaf = true;
                return v
              })
            }
            res.data.forEach((v) => {
              v.isLeaf = v.isLeaves
            })
            // 当在末节点新增时
            if(node.isLeaf){
              console.log('末尾节点新添节点')
              node.isLeaf = false
              node.data.isLeaf = false
              node.expand()
              return
            }
            this.$refs.categoryTree.updateKeyChildren(data.parentId, res.data)
            node.expand()
          } else {
            this.$refs.categoryTree.updateKeyChildren(data.parentId, [])
          }
        });
      }
    },
    remove(node, data) {
      const t = this
      const deleFn = () => {
        goodsCategoryDelete(data.id).then((res) => {
          if (res.code === 200) {
            this.$refs.categoryTree.remove(data.id)
          }
        })
      }

      // 给出提示
      t.$confirm(`确认删除 ${data.categoryName} 数据？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleFn()
        t.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
      })
    },
    filterNode(value, data) {
      if(!value) return true
      return data.categoryName.indexOf(value) !== -1
    },
    handleChild(node, data) {
      this.operateType = 3
      console.log('handleChild',node, data)
      this.jhData = data
    }
  }
}

</script>

<style lang="scss" scoped>
.main-container{
  ::v-deep.el-tree{
    overflow-x: scroll;
    padding-right: 20px;
    .el-tree-node>.el-tree-node__children{
      overflow: visible;
    }
  }
  ::v-deep.el-card__body{
    padding: 10px;
  }

  .cate-title{
    padding: 10px 10px;
    background: #62ac9d;
    color: #ffffff;
    font-size: 15px;
  }
}
.edit-sort-number {
  margin-left: 10px;
  cursor: pointer;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  i{
    margin-left: 8px;
    font-size: 15px;
  }
}
</style>
