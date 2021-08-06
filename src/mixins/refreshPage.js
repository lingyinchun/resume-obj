const refreshPage = {
    data() {
        return {
            layout: 'total, sizes, prev, pager, next, jumper',
            total: 0,
        }
    },
    watch:{
        $route(val){
            if(this.pathUrl && this.$route.path.indexOf(this.pathUrl)>0){
                console.log('刷新页面',this.$route)
                this.initTable()
            }
        }
    },
    mounted() {
        this.initTable()
    },
    methods: {
        searchFn(){
            this.search.pageSize = 10
            this.search.pageNo = 1
            this.initTable()
        },
        resetSearch(){
            this.search = {
                pageNo: 1,
                pageSize: 10
            }
            this.initTable()
        },
        handleSizeChange(val) {
            this.search.pageNo = 1
            this.search.pageSize = val
            this.initTable()
        },
        handleCurrentChange(val) {
            this.search.pageNo = val
            this.initTable()
        }
    }
}

export default refreshPage
