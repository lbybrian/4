<template>
  <div>
    <div class="articleTitleArea">
      <p class="articaltit">{{params.title}}</p>
<!--      <p v-if="!!params.translate_title"> {{params.translate_title}} </p>-->
    </div>
    <el-divider class="titleDivider" style=""></el-divider>
    <p style="text-align: center; width: 100%; position:relative; float: left;">
      <span>{{params.data_source}}</span>
      <span style="margin-left: 20px;">{{params.create_time}}</span>
      <span style="margin-left: 20px;">{{params.author}}</span>
    </p>
    <div style="margin: 15px 0px; height: 170px; display: inline-block; text-align: center; position: relative; width: 100%; float: left;">
      <h2 style="width: 100%; text-align: left; font-weight: 700; max-width: 800px;     margin: auto;">文字抄报：</h2>
      <div
        v-if="state===true"
        style="width: 100%; display: inline-block; overflow: visible; position: relative; max-width: 800px;"
      >
        <el-input
          resize="none"
          :rows="5"
          type="textarea"
          placeholder="请输入内容"
          v-model="params.abstract"
          maxlength="2000"
          show-word-limit
          style="height: auto; "
        ></el-input>
        <el-button
          @click="switchAbstract"
          style="position: absolute; right:0px; bottom: -30px;"
          size="mini"
          type="primary"
          plain
          :disabled="!!params.ylcpStatus && (params.ylcpStatus === '1' || params.ylcpStatus === '2')"
        >确定</el-button>
      </div>
      <div
        v-else
        style="position: relative; margin: auto; border-left: solid 1px #ddd; box-sizing: border-box; border-top: solid 1px #ddd; border-radius: 5px; box-shadow: 1px 1px 1px #999; padding: 5px; height: 114px;max-width: 800px; "
      >
        <p style="text-align: left;text-indent: 2em; height: 100%; overflow:auto; max-width: 800px;">{{params.abstract}}</p>
        <p class="editinfo">
          用户{{params.update_by}}于{{params.update_time}} 最后编辑
          <el-button v-on:click="switchAbstract" size="mini" plain>编辑</el-button>
        </p>
      </div>
    </div>
    <div style="position: relative; width: 100%; float: left;">
      <el-switch
        v-if="params.file_type==='image' && flag===true"
        v-model="ocrFlag"
        @change="transChange"
        active-color="#13ce66"
        inactive-color="#ff4949"
        style="vertical-align: text-bottom; margin: 10px 0px;"
        active-text="开启划选"
        inactive-text="关闭划选"></el-switch>
      <el-button
        v-if="params.file_type==='image' && ocrFlag"
        size="mini"
        @click="ocrRequest(params.file_type)"
        :loading="ocrLoading"
        style="position: absolute; z-index:3; top: 48px; left: 100px;"
        type="primary">OCR识别</el-button>

    </div>


   <el-row style="position: relative; float: left; width: 100%;">
      <el-col :span="24">
        <el-tabs type="card" v-model="activeName">
          <el-tab-pane :label="params.file_type" name="document" style="width:100%">
            <div style="padding: 10px 0 20px;text-indent: 2em; position: relative; overflow: visible;">
              <div class="imageArea"  v-if="params.file_type==='image'" style="position: relative; float: left; width: 100%; height: auto;float:left;">
                <div class="imageItemArea" v-if="!ocrFlag">
                  <el-image
                    style="width: auto; max-width: 100%;"
                    max-height="350px"
                    :src="params.src"
                    :preview-src-list="[params.src]">
                  </el-image>
                </div>
                <div class="imageItemArea imageWithOcr"  v-else>
                  <el-image
                    style="width: auto; max-width: 100%;"
                    ref="imagesArea"
                    max-height="350px"
                    :src="params.src">
                  </el-image>
                  <div :style="selectBoxStyle" class="boxSelectItem">
                    <span class="r"></span>
                    <span class="l"></span>
                    <span class="t"></span>
                    <span class="b"></span>
                    <span class="br"></span>
                    <span class="bl"></span>
                    <span class="tr"></span>
                    <span class="tl"></span>
                    <div class="inner"></div>
                  </div>
                </div>

              </div>
              <div class="videoArea"  v-else-if="params.file_type==='video'" style="position: relative; float: left; width: 100%; height: auto;">
                <div style="position: relative; width: 100%; float: left;">
                  <div style="position: relative; width: 100%; float: left;">
                    <video
                      class="myVideoItem video-js vjs-default-skin vjs-big-play-centered"
                      controls
                      max-width="600px"
                      max-height="350px"
                      min-width="400px"
                      width="auto"
                      preload="auto"
                      style="margin: 0 auto"
                    >
                      <source :src="params.src" type="video/mp4" />
                      <source :src="params.src" type="video/ogg" />
                      <source :src="params.src" type="video/webm" />
                    </video>
                  </div>
                </div>
              </div>
              <div class="audioArea" v-else-if="params.file_type==='audio'" style="position: relative; float: left; width: 600px; height: auto;">
                <div class="audioItemArea">
                  <audio width="100%"  preload="auto" @seeked="dealSeekedEvent" height="auto" controls :src="params.src">您的浏览器不支持 audio 元素。</audio>
                  <!--<audio width="100%"  preload="auto"  height="auto" controls src="static/testData/test.mp3">您的浏览器不支持 audio 元素。</audio>-->
                </div>
                <div style="text-align: left; margin-left: 35px;">
                  <el-button @click="switchAudioRate(-1)" type="text" size="mini" title="慢放" icon="el-icon-d-arrow-left"></el-button>
                  <el-button @click="switchAudioRate(0)" type="text" size="mini" title="正常" icon="el-icon-refresh"></el-button>
                  <el-button @click="switchAudioRate(1)" type="text" size="mini" title="快放" icon="el-icon-d-arrow-right"></el-button>
                  <label style="color: #888;">当前速率: {{audioRate}}x</label>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>
<style scoped>
  .articleTitleArea {
    float: left;
    position: relative;
    width: 100%;
    font-weight: 900;
    text-align: center;
  }

  .titleDivider {
    position: relative;
    float: left;
    margin: 10px 0;
  }

  .articleTitleAre>p {
    margin-bottom: 10px;
  }

  /deep/ .el-image-viewer__close {
    color: #fff;
  }

  /deep/ .el-image__inner, .el-image {
    float: left;
  }
  /deep/ .imageArea .el-image>img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 400px;
  }
  /deep/  .myVideoItem {
    max-height: 400px!important;
    max-width: 100%!important;
  }
  /deep/ .vjs-menu-item {
    position: relative;
  }
  /deep/ .vjs-menu-item-text {
    margin-left: -20px;
  }
  /deep/ .vjs-menu-item:hover {
    width: 100%;
    /*position: relative!important;*/
    /*display: inline-block !important;*/
  }
  /deep/ .vjs-menu-content {
    overflow: hidden !important;
  }
  .boxSelectItem {
    position: absolute;
    z-index: 2;
    left: 30px;
    top:20px;
    background-color: rgba(255, 255, 255, 0.2);

  }
  /*四边*/
  .boxSelectItem .t,
  .boxSelectItem .b,
  .boxSelectItem .l,
  .boxSelectItem .r {
    position: absolute;
    z-index: 1;
    background: #666;
  }
  .boxSelectItem .l,
  .boxSelectItem .r {
    width: 2px;
    height: 100%;
    cursor: col-resize;
  }
  .boxSelectItem .t,
  .boxSelectItem .b {
    width: 100%;
    height: 2px;
    cursor: row-resize;
  }
  .boxSelectItem .t {
    top: 0;
  }
  .boxSelectItem .b {
    bottom: 0;
  }
  .boxSelectItem .l {
    top: 0;
    left: 0;
  }
  .boxSelectItem .r {
    right: 0;
  }
  /*四角*/
  .boxSelectItem .tl,
  .boxSelectItem .bl,
  .boxSelectItem .br,
  .boxSelectItem .tr {
    width: 10px;
    height: 10px;
    position: absolute;
    background: #fff;
    border:1px solid #666;
    z-index: 2;
    cursor: nwse-resize
  }
  .boxSelectItem .tl {
    left: -5px;
  }
  .boxSelectItem .bl {
    left: -5px;
  }
  .boxSelectItem .tr {
    right: -5px;
  }
  .boxSelectItem .br {
    right: -5px;
    bottom: -5px;
  }
  .boxSelectItem .bl {
    bottom: -5px;
  }
  .boxSelectItem .tl,
  .boxSelectItem .tr {
    top: -5px;
  }
  .boxSelectItem .tr,
  .boxSelectItem .bl {
    cursor: nesw-resize;
  }
  /*内核*/
  .boxSelectItem .inner {
    width: 100%;
    height: 100%;
  }
  .imageItemArea {
    position: relative;
    float: left;
    width: auto;
    height: auto;
    overflow: hidden;
  }

  .editinfo{
    text-align: right;
    font-size: 13px;
    bottom: -35px;
    position: absolute;
    right: 0px;
    color: red;
    overflow: hidden;
    background: floralwhite;
  }
  .articaltit{
    height: 30px;
    line-height: 30px;
    font-size: 18px;
  }

  /deep/ .el-textarea .el-input__count {
    bottom: -20px !important;
    left: 0px !important;
    right: auto !important;
  }

</style>

<script>
  export default {
    beforeMount() {
      this.params = this.options
    },
    mounted() {
      var _self = this;
      if(this.params.file_type === "video") {
        setTimeout(function(){
          _self.initVideoItem(_self.params.src);
        }, 200);
      }
      else if(this.params.file_type === "image") {
        setTimeout(function(){
          _self.initialImageSelect();
        }, 200);
      }
      else {

      }
    },
    updated() {
      this.params = this.options;
      // console.log(this.options);
      var _self = this;
      if(this.params.file_type === "video") {
        setTimeout(function(){
          _self.initVideoItem(_self.params.src);
        }, 200);
      }
      else if(this.params.file_type === "image" &&  !_self.params.inited) {
        setTimeout(function(){
          _self.initialImageSelect();
          _self.params.inited = true;
        }, 200);
      }
      else {

      }
    },
    props: {
      options: Object
    },
    computed: {
      previewList() {
        var ret = [this.params.src];
        if(this.transValue) {
          ret = undefined;
        }
        return ret;
      },
      selectBoxStyle() {
        var style = {
          width: this.boxStyle.width + "px",
          height: this.boxStyle.height + "px",
          top: this.boxStyle.top + "px",
          left: this.boxStyle.left + "px"
        }
        return style;
      }

    },
    data() {
      return {
        activeName: "document",
        transValue: false,
        flag: true,
        state: true,
        ocrFlag: false,
        ocrLoading: false,
        ocrResult: false,
        audioRate: 1,
        params: {
          id: "",
          title: "",
          duration: "",
          file_type: "",
          abstract: "",
          translate_abstract: "",
          translate_content: "",
          translate_title: "",
          sys_translate: "",
          author: "",
          content: "",
          create_by: "",
          create_time: "",
          update_by: "",
          update_time: "",
          data_source: "",
          direction: "",
          language: "",
          publish_time: "",
          src: "",
          source_url: ""
        },
        boxStyle: {
          width: 50,
          height: 50,
          left: 0,
          top: 0
        },
        olderInfo: {
          width: 50,
          height: 50,
          left: 0,
          top: 0,
          x: 0,
          y: 0
        }
      };
    },
    watch: {
      "ocrFlag"(val, older) {
        if(val) {
          var _self = this;
          setTimeout(function(){
            _self.initialImageSelect();
            _self.params.inited = true;
          }, 200);
        }
      }
    },
    methods: {
      displayOcrResult() {
        // this.ocrResult = true;
      },
      ocrRequest(type) {
        //获取图片原始宽高
        var imagesArea = this.$refs.imagesArea
        var imagesAreaH = imagesArea.imageHeight
        var size = 1
        //图片实际展示大小
        if(imagesAreaH > 400){
          size = imagesAreaH/400
        }
        var param = {
          _path: this.params.id,
          type:type,
          x1: Math.floor(this.boxStyle.left*size),
          y1: Math.floor(this.boxStyle.top*size),
          x2: Math.floor((this.boxStyle.left + this.boxStyle.width)*size),
          y2: Math.floor((this.boxStyle.top + this.boxStyle.height)*size)
        }
        var _self = this;
        this.ocrLoading = true;
        this.adapter.ocrRequest(param, function(d) {
          _self.ocrLoading = false;
          var ret = d.data.data || "【识别结果为空】";
          _self.$alert(ret, 'OCR识别结果', {
            confirmButtonText: '确定'
          });
        })
      },
      initialImageSelect() {
        var _self = this;
        $(".boxSelectItem>span").off("mousedown")
        $(".boxSelectItem>span").on("mousedown", function(ev) {
          _self.recordMouseDown(ev, "size");
          var obj = this;
          $(document).off("mousemove");
          $(document).on("mousemove", function(event) {
            if(_self.olderInfo.down) {
              _self.adjustBoxStyle(event, obj.className);
            }
          });

          $(document).off("mouseup");
          $(document).on("mouseup", function(event) {
            $(document).off("mousemove");
            _self.olderInfo.down = false;
          })
        });

        $(".boxSelectItem").off("mousedown")
        $(".boxSelectItem").on("mousedown", function(ev) {
          _self.recordMouseDown(ev, "move");
          $(document).off("mousemove");
          $(document).on("mousemove", function(event) {
            if(_self.olderInfo.down) {
              _self.moveBoxItem(event);
            }
          });
          $(document).off("mouseup");
          $(document).on("mouseup", function(event) {
            $(document).off("mousemove");
            _self.olderInfo.down = false;
          })
        })
        this.boxStyle.left = 0;
        this.boxStyle.top = 0;
        this.boxStyle.width = 50;
        this.boxStyle.height = 50;
      },
      recordMouseDown(ev, type) {
        var oEv = ev || event;
        oEv.stopPropagation();
        this.olderInfo.width = this.boxStyle.width;
        this.olderInfo.height = this.boxStyle.height;
        this.olderInfo.left = this.boxStyle.left;
        this.olderInfo.top = this.boxStyle.top;
        this.olderInfo.x = oEv.clientX;
        this.olderInfo.y = oEv.clientY;
        this.olderInfo.down = true;
      },
      moveBoxItem(ev) {
        var oevent = ev || event;
        var disX = oevent.clientX - this.olderInfo.x;
        var disY = oevent.clientY - this.olderInfo.y;
        //获取图片原始宽高
        var imagesArea = this.$refs.imagesArea
        var imagesAreaW = imagesArea.imageWidth
        var imagesAreaH = imagesArea.imageHeight
        //图片实际展示大小
        if(imagesAreaH > 400){
          imagesAreaW = Math.floor(imagesAreaW/(imagesAreaH/400))
          imagesAreaH = 400
        }
        // 超出边界处理 < 0 以及 超出图片范围
        var finalLeft = this.olderInfo.left + disX
        var finalTop = this.olderInfo.top + disY
        finalLeft = finalLeft < 0 ? 0 : finalLeft
        finalTop = finalTop < 0 ? 0 : finalTop
        finalLeft = finalLeft > imagesAreaW - this.olderInfo.width ? imagesAreaW - this.olderInfo.width : finalLeft
        finalTop = finalTop > imagesAreaH - this.olderInfo.height ? imagesAreaH - this.olderInfo.height : finalTop
        this.boxStyle.left = finalLeft;
        this.boxStyle.top = finalTop;
      },
      adjustBoxStyle(ev, objClassName) {
        var oEv = ev || event;
        //获取图片原始宽高
        var imagesArea = this.$refs.imagesArea
        var imagesAreaW = imagesArea.imageWidth
        var imagesAreaH = imagesArea.imageHeight
        //图片实际展示大小
        if(imagesAreaH > 400){
          imagesAreaW = Math.floor(imagesAreaW/(imagesAreaH/400))
          imagesAreaH = 400
        }
        let disY = (this.olderInfo.top + (oEv.clientY - this.olderInfo.y)),
          disX = (this.olderInfo.left + (oEv.clientX - this.olderInfo.x));
        // if(disX > this.olderInfo.left+this.olderInfo.width){
        //   disX = this.olderInfo.left+this.olderInfo.width
        // }
        // if(disY > this.olderInfo.top+this.olderInfo.height){
        //   disY=this.olderInfo.top+this.olderInfo.height
        // }
        if (objClassName == 'tl') {
          if(disX < 0){
            disX = 0
            oEv.clientX = this.olderInfo.x
          }
          if(disY < 0){
            disY = 0
            oEv.clientY = this.olderInfo.y
          }
          this.boxStyle.width = this.olderInfo.width - (oEv.clientX - this.olderInfo.x);
          this.boxStyle.height = this.olderInfo.height - (oEv.clientY - this.olderInfo.y);
          this.boxStyle.left = disX;
          this.boxStyle.top = disY;
        }
        else if (objClassName == 'bl') {
          if(disX < 0){
            disX = 0
            oEv.clientX = this.olderInfo.x
          }
          if(disY > imagesAreaH - this.olderInfo.height){
            disY = imagesAreaH - this.olderInfo.height
            oEv.clientY = disY + this.olderInfo.y
          }
          this.boxStyle.width = this.olderInfo.width - (oEv.clientX - this.olderInfo.x);
          this.boxStyle.height = this.olderInfo.height + (oEv.clientY - this.olderInfo.y);
          this.boxStyle.left = disX;
          // this.boxStyle.top = this.olderInfo.top + (oEv.clientY - this.olderInfo.y) - this.boxStyle.height;
        }
        else if (objClassName == 'tr') {
          if(disX > imagesAreaW - this.olderInfo.width){
            disX = imagesAreaW - this.olderInfo.width
            oEv.clientX = disX + this.olderInfo.x
          }
          if(disY < 0){
            disY = 0
            oEv.clientY = this.olderInfo.y
          }
          this.boxStyle.width = this.olderInfo.width + (oEv.clientX - this.olderInfo.x);
          this.boxStyle.height = this.olderInfo.height - (oEv.clientY - this.olderInfo.y);
          this.boxStyle.right = this.olderInfo.left - (oEv.clientX - this.olderInfo.x);
          this.boxStyle.top = disY;
        }
        else if (objClassName == 'br') {
          if(disX > imagesAreaW - this.olderInfo.width){
            disX = imagesAreaW - this.olderInfo.width
            oEv.clientX = disX + this.olderInfo.x
          }
          if(disY > imagesAreaH - this.olderInfo.height){
            disY = imagesAreaH - this.olderInfo.height
            oEv.clientY = disY + this.olderInfo.y
          }
          this.boxStyle.width = this.olderInfo.width + (oEv.clientX - this.olderInfo.x);
          this.boxStyle.height = this.olderInfo.height + (oEv.clientY - this.olderInfo.y);
          this.boxStyle.right = this.olderInfo.left - (oEv.clientX - this.olderInfo.x);
          this.boxStyle.bottom = this.olderInfo.top + (oEv.clientY + this.olderInfo.y);
        }
        else if (objClassName == 't') {
          if(disY < 0){
            disY = 0
            oEv.clientY = this.olderInfo.y
          }
          this.boxStyle.height = this.olderInfo.height - (oEv.clientY - this.olderInfo.y);
          this.boxStyle.top = disY;
        }
        else if (objClassName == 'b') {
          if(disY > imagesAreaH - this.olderInfo.height){
            disY = imagesAreaH - this.olderInfo.height
            oEv.clientY = disY + this.olderInfo.y
          }
          this.boxStyle.height = this.olderInfo.height + (oEv.clientY - this.olderInfo.y);
          this.boxStyle.bottom = disY + 'px';
        }
        else if (objClassName == 'l') {
          if(disX < 0){
            disX = 0
            oEv.clientX = this.olderInfo.x
          }
          this.boxStyle.height = this.olderInfo.height;
          this.boxStyle.width = this.olderInfo.width - (oEv.clientX - this.olderInfo.x);
          this.boxStyle.left = disX;
        }
        else if (objClassName == 'r') {
          if(disX > imagesAreaW - this.olderInfo.width){
            disX = imagesAreaW - this.olderInfo.width
            oEv.clientX = disX + this.olderInfo.x
          }
          this.boxStyle.height = this.olderInfo.height;
          this.boxStyle.width = this.olderInfo.width + (oEv.clientX - this.olderInfo.x);
          this.boxStyle.right = disX;
        }
        else {}
      },
      transChange(val) {
        this.transValue = val
      },
      _switchAudioRate(n) {
        var arr = [0.5, 1, 2, 4, 8];
        var current = arr.indexOf(this.audioRate);
        if(n < 0 && current - 1 > -1) {
          this.audioRate = arr[current - 1] || arr[1];
        }
        else if(n > 0 && current + 1 < arr.length) {
          this.audioRate = arr[current + 1] || arr[1];
        }
        else {
          this.audioRate = arr[1];
        }
        var audio = $("audio")[0];
        audio.playbackRate = this.audioRate;
        window.myAudio = audio;
      },
      dealSeekedEvent(val) {
        myAudio.play();
      },
      // 预览区方法
      switchAbstract() {
        if (this.state && this.params.abstract) {
          this.updateAbstract();
        }
        this.state = !this.state;
      },
      updateAbstract() {
        var param = {
          abstract: this.params.abstract,
          id: this.params.id
        };
        var _self = this;
        //  API +"/original/sc/saveOrUpdateAbstract/"
        this.adapter.saveAbstract({
          saveOrUpdate: JSON.stringify(param),
          _path: this.params.id
          // _path: this.params.idocrRequest
        }, function(d) {
          _self.$message({
            message: "保存成功",
            type: "success"
          });
          _self.updateMaterialParam(_self.params.id)
        });
      },
      createVideoItem(src, elem) {
        this.videoItem = elem || $(".videoArea .myVideoItem")[0];
        src = src || this.params.src;
        var player = this.$video(
          this.videoItem,
          {
            controls: true,
            autoplay: false,
            preload: "auto",
            loop: false,
            playbackRates: [0.5, 1, 2, 4, 8],
            controlBar: {
              captionsButton: true,
              chaptersButton: true,
              playbackRateMenuButton: true,
              remainingTimeDisplay: true,
              progressControl: true,
              fullscreenToggle: true
            }
          });
        return  player;
      },
      initVideoItem(src, elem) {
        var _self = this;
        src = src || this.params.src;
        if($(".videoArea .myVideoItem video").length === 0) {
          this.player = this.createVideoItem(src, elem);
          window.player = this.player;
          $(".videoArea .myVideoItem video")[0].src = src;
          this.ocrFlag = false;
        }

      },
      switchAudioRate(n) {
        var arr = [0.5, 1, 2, 4, 8];
        var current = arr.indexOf(this.audioRate);
        if(n < 0 && current - 1 > -1) {
          this.audioRate = arr[current - 1] || arr[1];
        }
        else if(n > 0 && current + 1 < arr.length) {
          this.audioRate = arr[current + 1] || arr[1];
        }
        else {
          this.audioRate = arr[1];
        }
        var audio = $("audio")[0];
        audio.playbackRate = this.audioRate;
        window.myAudio = audio;
      },
      //更新当前素材参数
      updateMaterialParam(id) {
        var _self = this;
        this.adapter.getMaterialParam({
          _path: id
        }, function(d){
          if(d.data && d.data.data) {
            _self.params.update_by = d.data.data.update_by || _self.params.update_by;
            _self.params.update_time = d.data.data.update_time || _self.params.update_time;
            _self.params.abstract = d.data.data.abstract;
          }
          _self.$emit("abstractChange", _self.params);
        })
      }
    },

  };
</script>


