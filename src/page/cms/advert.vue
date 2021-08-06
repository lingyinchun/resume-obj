<template>
    <div class="app-container">
        <el-card
        class="box-card"
        shadow="never"
        style="border: 0"
        body-style="background-color: #f3f3f3;padding: 10px 0 0;"
        >
        <div slot="header">
            <span>广告列表</span>
            <div style="float: right; margin: -5px 0">
            <el-button type="primary" size="small" icon="el-icon-plus" plain @click="handleInfo(null, 1)">新增广告</el-button>
            </div>
        </div>
        </el-card>
        <div class="main-container">
            <div class="app-search">
                <el-form :inline="true" :model="search" ref="search">
                    <el-form-item label="广告名称" prop="advertNameLike">
                        <el-input v-model="search.advertNameLike" placeholder="广告名称" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="创建时间">
                        <el-date-picker
                        v-model="search.createTime" type="datetimerange" :picker-options="pickerOptions"
                        range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" align="right"
                        @change="changeDate" value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>
                    <el-row style="text-align: center;">
                        <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="getDataList()" size="small">查询</el-button>
                        <el-button icon="el-icon-refresh-left"  @click="resetForm('search')" size="small">重置</el-button>
                        </el-form-item>
                    </el-row>
                </el-form>
                <el-table :data="dataList" row-key="id" border size="small">
                    <el-table-column label="id" prop="id" width="80"></el-table-column>
                    <el-table-column label="广告名称" prop="advertName"></el-table-column>
                    <el-table-column label="广告类型" prop="advertType">
                        <template slot-scope="scope">
                            <span v-if="scope.row.advertType == 1">文本</span>
                            <span v-else-if="scope.row.advertType == 2">图片</span>
                            <span v-else-if="scope.row.advertType == 3">视频</span>
                            <span v-else-if="scope.row.advertType == 4">商品</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="广告内容" width="90">
                        <template slot-scope="scope">
                            <span v-if="scope.row.advertType == 1 || scope.row.advertType == 4">{{scope.row.advertContent}}</span>
                            <img v-else-if="scope.row.advertType == 2 || scope.row.advertType == 3" :src="scope.row.advertContent" width="60"></img>
                        </template>
                    </el-table-column>
                    <el-table-column label="广告有效期" width="150">
                        <template slot-scope="scope">
                            <p>{{scope.row.startTime}}</p>
                            <p> 至 </p>
                            <p>{{scope.row.endTime}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="排序" prop="sortNumber" width="150">
                        <template slot-scope="{row}">
                            <template v-if="row.edit">
                                <el-input-number v-model="row.sortNumber" controls-position="right"
                                    :min="1" :max="999999" :precision="0" style="width: 90px;margin-right: 5px;"></el-input-number>
                                <el-button size="small" type="text" @click="handleEdit(row)">保存</el-button>
                            </template>
                            <span v-else>
                                <span>{{ row.sortNumber }}</span>
                                <i @click="row.edit = !row.edit" class="el-icon-edit edit-sort-number" style="font-size: 20px;"></i>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" prop="advertStatus" width="100"></el-table-column>
                    <el-table-column label="创建时间" prop="createTime" width="180"></el-table-column>
                    <el-table-column label="操作" width="150" fixed="right">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" @click="handleInfo(scope.row.id, 3)">查看</el-button>
                            <el-button size="mini" type="text" @click="handleInfo(scope.row.id, 2)">编辑</el-button>
                            <el-button size="mini" type="text" @click="handleDelete(scope.row.id)" style="color: #f56c6c;">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <el-pagination
                    v-show="total > 0"
                    background
                    :current-page="search.pageNo"
                    :page-size="search.pageSize"
                    :layout="layout"
                    :total="total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    style="margin-bottom: 10px;"
                ></el-pagination>
            </div>
        </div>
        <advert-edit v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></advert-edit>
    </div>
</template>

<script>
  import { advertQuery, advertDelete, advertUpdate } from '@/api/cms/advert'
  import { getPickerOptions } from '@/utils'
  import advertEdit from './advertEdit'
  export default {
    name: 'cmsAdvert',
    components: { advertEdit },
    data() {
        return {
            code: undefined,
            addOrUpdateVisible: false,
            // 日期快捷选项
            pickerOptions: getPickerOptions(),
            layout: 'total, sizes, prev, pager, next, jumper',
            search: {
                pageNo: 1,
                pageSize: 10,
                advertSpaceCode: undefined,
                advertNameLike: undefined,
                createTime: undefined,
                createTimeFrom: undefined,
                createTimeTo: undefined,
                orderBy: 'id desc',
            },
            dataList: [],
            total: 0,
        }
    },
    watch:{
      $route(val){
        if(this.$route.query.code != this.search.advertSpaceCode ) {
          console.log('变了',val)
          this.init()
        }
      }
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            let code = this.$route.query.code || undefined;
            if(!code) {
                this.$router.push({path: `/cms/advertSpace`})
            }
            this.search.advertSpaceId = code;
            this.getDataList();
        },
        async getDataList() {
            const { data } = await advertQuery(this.search);
            let dataList = data.records || [];
            this.total = data.totalRecords;
            this.dataList = dataList.map(v => {
                this.$set(v, 'edit', false)
                return v
            })
        },
        handleInfo(id, opt) {
            this.addOrUpdateVisible = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(id, opt, this.search.advertSpaceId);
            })
        },
        // 修改排序值
        handleEdit(row) {
            let data = {id: row.id, sortNumber: row.sortNumber};
            advertUpdate(data).then((res) => {
                this.$baseMessage('修改成功', 'success')
                row.edit = false;
            });
        },
        // 删除广告
        handleDelete(id) {
            this.$confirm('确认要删除此广告吗？').then(_ => {
                advertDelete(id).then((res) => {
                    this.$baseMessage('删除成功', 'success')
                    this.getDataList();
                });
            }).catch(_ => {});
        },
        changeDate() {
            let value = this.search.createTime
            console.log(value)
            if (value) {
                this.search.createTimeFrom = value[0]
                this.search.createTimeTo = value[1]
            } else {
                this.search.createTimeFrom = null
                this.search.createTimeTo = null
            }
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.search.createTime = [];
            this.getDataList()
        },
        handleSizeChange(val) {
            this.search.pageSize = val
            this.getDataList()
        },
        handleCurrentChange(val) {
            this.search.pageNo = val
            this.getDataList()
        },
    }
}

</script>

<style lang="scss" scoped>

    .edit-sort-number{
        margin-left: 10px;
        cursor: pointer;
    }
</style>
