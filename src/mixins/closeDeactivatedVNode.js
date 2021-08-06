const closeDeactivatedVNode = {
    data() {
        return {
            routeTagName: this.$route.meta.title
        }
    },
    computed: {
        tagsListFlag() {
            return this.$store.state.permission.tagsList
        }
    },
    watch: {
        tagsListFlag(newval) {
            // console.log('user', newval, this.routeTagName)
            let ro = newval.filter((v)=>{ return v.title === this.routeTagName})
            if (!ro || ro.length===0){
                this.destroyVNode()
            }
        }
    },
    methods: {
        destroyVNode() {
            console.log('销毁啊===', this.$vnode, this.$vnode.parent)
            if (this.$vnode && this.$vnode.data.keepAlive) {
                if (this.$vnode.parent && this.$vnode.parent.componentInstance && this.$vnode.parent.componentInstance.cache) {
                    if (this.$vnode.componentOptions) {
                        var key = this.$vnode.key == null
                            ? this.$vnode.componentOptions.Ctor.cid + (this.$vnode.componentOptions.tag ? `::${this.$vnode.componentOptions.tag}` : '')
                            : this.$vnode.key;
                        var cache = this.$vnode.parent.componentInstance.cache;
                        var keys = this.$vnode.parent.componentInstance.keys;
                        console.log('key', key)
                        if (cache[key]) {
                            if (keys.length) {
                                var index = keys.indexOf(key);
                                if (index > -1) {
                                    keys.splice(index, 1);
                                }
                            }
                            delete cache[key];
                        }
                    }
                }
            }
            this.$destroy();
        }
    }
}
export default closeDeactivatedVNode
