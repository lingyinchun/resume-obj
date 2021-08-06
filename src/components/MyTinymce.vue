<template>
  <div>
    <div v-if="!disabled">
      <editor ref="editor" :api-key="apiKey" v-model="content" :init="init">
      </editor>
    </div>
    <div v-else>
      <HtmlContent :content="content"/>
    </div>
  </div>
</template>

<script>
import HtmlContent from "@/components/HtmlContent";
import {uploadFile} from '@/api/index'
import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/themes/silver";
import "tinymce/icons/default/icons";
import "tinymce/themes/silver";
import "tinymce/plugins/image";
import "tinymce/plugins/media";
import "tinymce/plugins/table";
import "tinymce/plugins/lists";
import "tinymce/plugins/contextmenu";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/colorpicker";
import "tinymce/plugins/textcolor";
import "tinymce/plugins/preview";
import "tinymce/plugins/code";
import "tinymce/plugins/link";
import "tinymce/plugins/advlist";
import "tinymce/plugins/codesample";
import "tinymce/plugins/hr";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/textpattern";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/autolink";
import "tinymce/plugins/directionality";
import "tinymce/plugins/visualblocks";
import "tinymce/plugins/visualchars";
import "tinymce/plugins/template";
import "tinymce/plugins/charmap";
import "tinymce/plugins/nonbreaking";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/imagetools";
import "tinymce/plugins/autosave";
import {debounce} from "@/utils/util"

const plugins = "preview searchreplace autolink directionality visualblocks visualchars fullscreen image link template code codesample table charmap hr nonbreaking insertdatetime advlist lists wordcount imagetools textpattern autosave"
const toolbar = "undo redo restoredraft | forecolor backcolor bold italic underline strikethrough link codesample | alignleft aligncenter alignright alignjustify outdent indent formatpainter | \
       bullist numlist | styleselect formatselect fontsizeselect | blockquote subscript superscript removeformat | \
       table image hr pagebreak insertdatetime | fullscreen preview"
export default {
  name: "MyTinymce",
  components: {Editor,HtmlContent},
  props: {
    value: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value(newValue) {
      if(!newValue || newValue==='' || newValue===undefined){
        this.content = '<p></p>'
      }else{
        this.content = newValue;
      }
    },
    content(newValue) {
      this.$emit("input", newValue);
      this.pushContent()
    },
    disabled(val) {
      console.log(tinymce)
    }
  },
  data() {
    return {
      content: '',
      apiKey: "fmpe10wgtn5cy4tq0quwhxd21a2mb6z7pwuf0zsut09xk039",
      init: {
        language_url: "/static/tinymce/langs/zh_CN.js", // 中文语言包路径
        language: "zh_CN",
        skin_url: "/static/tinymce/skins/ui/oxide",
        // height: 770,
        min_height: 420,
        max_height: 770,
        toolbar_mode: "wrap",
        plugins: plugins,
        toolbar: toolbar,
        //启用菜单栏并显示如下项 [文件? 编辑 插入 视图 格式 表格]
        menubar: 'edit insert view format table',
        // 配置每个菜单栏的子菜单项（如下是默认配置）
        menu: {
          file: {title: 'File', items: 'newdocument'},
          edit: {title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall'},
          insert: {title: 'Insert', items: 'link media | hr'},
          view: {title: 'View', items: 'visualaid code'},
          format: {title: 'Format', items: 'bold italic underline strikethrough superscript subscript | formats | removeformat'},
          table: {title: 'Table', items: 'inserttable tableprops deletetable | cell row column'},
        },
        content_style: "p {margin: 5px 0;}",
        fontsize_formats: "12px 14px 16px 18px 24px 36px 48px 56px 72px",
        branding: false,
        //此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
        //如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
        images_upload_handler: (blobInfo, success, failure) => {
          console.log(blobInfo)
          const fd = new FormData()
          fd.append('file', blobInfo.blob())
          uploadFile('/mall-api/file-m/m/file/upload', fd).then((res)=>{
            if(res.code===200){
              // this.$refs['upload'].clearFiles()
              // this.$emit('uploadSuccess')
              success(res.data);
              this.$baseMessage('上传成功', 'success')
            }else{
              this.$baseMessage(res.message, 'error')
            }
          }).catch(()=>{
            failure()
          })
          // const img = "data:image/jpeg;base64," + blobInfo.base64();
          // success(img);
        }
      }
    }
  },
  mounted() {
    tinymce.init({})
  },
  beforeDestroy() {
    console.log('beforeDestroy')
  },
  destroyed() {
    console.log('destroyed')
  },
  methods: {
    pushContent(){
      this.debounceFn(this)
    },
    debounceFn: debounce((vm) => {
      // do something，这里this不指向Vue实例,用vm传入
      vm[0].$emit("getContent", vm[0].content);
    }),
  }
}
</script>

<style scoped>
</style>
