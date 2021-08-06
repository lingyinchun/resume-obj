<template>
  <div class='icon-box'>
    <div class="icon-input" @click="showIcon = !showIcon">
      <IconTem :icon="value"/>&nbsp;<span>{{value}}</span>
      <i class="el-icon-close close-sty" @click.stop="checkIcon('')"></i>
    </div>
    <div v-show="showIcon" class="icon-content">
      <div class="search-box">
        <el-input class="search"
                  size="mini"
                  v-model="keyword"
                  clearable
                  placeholder="请输入图标名称"></el-input>
      </div>
      <ul class="icon-ul-box">
        <li class="icon-li"
            v-for="(item,index) in list"
            :key="index">
          <div class="icon-li-content" @click="checkIcon(item)">
            <IconTem :icon="item"/>
            <span>{{item}}</span>
          </div>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
export default {
    props: {
      value: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        showIcon: false,
        keyword: '',
        iconList: [
            'attentionforbid',
            'attentionforbidfill',
            'attention',
            'attentionfill',
            'tag',
            'tagfill',
            'people',
            'peoplefill',
            'notice',
            'noticefill',
            'mobile',
            'mobilefill',
            'voice',
            'voicefill',
            'unlock',
            'lock',
            'home',
            'homefill',
            'delete',
            'deletefill',
            'notification',
            'notificationfill',
            'notificationforbidfill',
            'like',
            'likefill',
            'comment',
            'commentfill',
            'camera',
            'camerafill',
            'warn',
            'warnfill',
            'time',
            'timefill',
            'location',
            'locationfill',
            'favor',
            'favorfill',
            'skin',
            'skinfill',
            'news',
            'newsfill',
            'record',
            'recordfill',
            'emoji',
            'emojifill',
            'message',
            'messagefill',
            'goods',
            'goodsfill',
            'crown',
            'crownfill',
            'move',
            'add',
            'hot',
            'hotfill',
            'service',
            'servicefill',
            'present',
            'presentfill',
            'pic',
            'picfill',
            'rank',
            'rankfill',
            'male',
            'female',
            'down',
            'top',
            'recharge',
            'rechargefill',
            'forward',
            'forwardfill',
            'info',
            'infofill',
            'redpacket',
            'redpacket_fill',
            'roundadd',
            'roundaddfill',
            'friendadd',
            'friendaddfill',
            'cart',
            'cartfill',
            'more',
            'moreandroid',
            'back',
            'right',
            'shop',
            'shopfill',
            'question',
            'questionfill',
            'roundclose',
            'roundclosefill',
            'roundcheck',
            'roundcheckfill',
            'global',
            'mail',
            'punch',
            'exit',
            'upload',
            'read',
            'file',
            'link',
            'full',
            'group',
            'friend',
            'profile',
            'addressbook',
            'calendar',
            'text',
            'copy',
            'share',
            'wifi',
            'vipcard',
            'weibo',
            'remind',
            'refresh',
            'filter',
            'settings',
            'scan',
            'qrcode',
            'cascades',
            'apps',
            'sort',
            'searchlist',
            'search',
            'edit'
        ],
        icon: true
      };
    },
    computed: {
        list() {
            return this.iconList.filter(item => {
                return item.indexOf(this.keyword) !== -1;
            });
        }
    },
    watch: {},
    methods: {
      checkIcon(icon) {
        // console.log(icon)
        this.$emit('input', icon)
        this.showIcon = false
      }
    },
    created() {},
    mounted() {}
};
</script>
<style lang='scss' scoped>
.icon-box {
    width: 100%;
    // background: #ffffff;
    padding: 5px 0 0 0;
    position: relative;
    z-index: 99;

    .icon-input{
      width: 100%;
      padding: 0 15px;
      box-sizing: border-box;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      height: 32px;
      line-height: 32px;
      background: #ffffff;
    }

    .icon-content{
      width: 100%;
      background: #fdfdfd;
      position: absolute;
      top: 38px;
      left: 0px;
      z-index: 99;
      border: 1px solid #dcdfe6;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      border-radius: 0px 0px 5px 5px;
    }
}
.search-box {
    width: 100%;
    padding: 8px 0;
    background: #f5f5f5;
}
.search {
    width: 96%;
    margin-left: 2%;
}
.icon-ul-box {
    width: 100%;
    // background: #ffffff;
    max-height: 240px;
    overflow-y: scroll;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding: 10px 0;
}
.icon-li {
    display: inline-block;
    padding: 10px;
    width: 120px;
    // height: 120px;
    // float: left;
  span{
    height: 25px;
    overflow: hidden;
    line-height: 25px;
    white-space: nowrap;
    width: 100%;
    display: block;
    text-overflow: ellipsis;
    text-align: center;
  }

  &:hover{
    background: #ddebff;
  }
}
.icon-li-content {
    display: flex;
    // height: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
.icon-li-content i {
    font-size: 22px;
    color: #606266;
}
.icon-li-content span {
    margin-top: 8px;
    color: #787878;
}
</style>
