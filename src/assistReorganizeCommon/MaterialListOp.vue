<template>
  <div
    :info="materialList"
    style="height: 100%; width: 100%; position:  relative; box-sizing: border-box; float: left; position: relative;"
  >

      <el-checkbox
        class="selectAllCheckbox"
        v-model="info.checkAll"
        :indeterminate="info.isIndeterminate"
        name="type"
        label
        v-if="!info.flag"
        @change="handleCheckAllChange"
      ></el-checkbox>
    <p
      style="height: calc( 100% - 80px ); overflow: auto; width: 100%; box-sizing: border-box;position: relative; float: left; "
    >
      <slot>
        <!--文本素材-->
        <el-menu
          :default-openeds="['1']"
          :flag="info.flag"
          class="textMaterialArea">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-document"></i>
              <span>已选素材</span>
            </template>
            <el-menu-item-group >
              <el-menu-item  :key="d.id"  v-for="(d, index) in info.data.text">
                <template slot="title">
                  <div  slot="header" style="line-height:1; cursor: pointer;" class="clearfix">
                    <a
                      :href="'/#/dxscdetail?id=' + d.id"
                      target="_blank"
                      class="titleText"
                      :title="d.title"
                      @click="dealMaterialClick(d);"
                    >{{d.title}}</a>
                    <el-checkbox
                      @change="handleCheckedChange(d)"
                      v-model="d.isChecked"
                      :key="d.id"
                      label
                      v-if="!info.flag"
                      name="type"
                      class="checkboxItem"
                    ></el-checkbox>
                    <i
                      v-if="!info.flag"
                      class="el-icon-delete"
                      @click="$emit('dealMaterialEvent', 'delete','text', index)"
                    ></i>
                  </div>

                </template>
              </el-menu-item>

            </el-menu-item-group>

          </el-submenu>
        </el-menu>
        <!--图片素材-->
        <!-- <el-menu
          :default-openeds="['1']"
          :flag="info.flag"
          class="imageMaterialArea">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-picture"></i>
              <span>图片素材</span>
            </template>
            <el-menu-item-group>
              <el-menu-item :key="d.id"  v-for="(d, index) in info.data.image">
              <template slot="title"  >
                <div  slot="header" style="line-height:1; cursor: pointer;" class="clearfix">
                <a
                  :href="'/#/fwbscdetail?id=' + d.id"
                  class="titleText"
                  :title="d.title"
                  @click="dealMaterialClick(d);"
                >{{d.title}}</a>
                  <el-checkbox
                    @change="handleCheckedChange(d)"
                    v-model="d.isChecked"
                    :key="d.id"
                    label
                    name="type"
                    class="checkboxItem"
                  ></el-checkbox>
                  <i
                    v-if="!info.flag"
                    class="el-icon-delete"
                    @click="$emit('dealMaterialEvent', 'delete','image', index)"
                  ></i>
                </div>

              </template>
              </el-menu-item>
            </el-menu-item-group>

          </el-submenu>
        </el-menu> -->
        <!--音频素材-->
        <!-- <el-menu
          :default-openeds="['1']"
          :flag="info.flag"
          class="audioMaterialArea">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-microphone"></i>
              <span>音频素材</span>
            </template>
            <el-menu-item-group>
              <el-menu-item :key="d.id"  v-for="(d, index) in info.data.audio">
                <template slot="title" >
                  <div  slot="header" style="line-height:1; cursor: pointer;" class="clearfix">
                <a
                  class="titleText"
                  :title="d.title"
                  :href="'/#/fwbscdetail?id=' + d.id"
                  @click="dealMaterialClick(d);"
                >{{d.title}}</a>
                    <el-checkbox
                      @change="handleCheckedChange(d)"
                      v-model="d.isChecked"
                      :key="d.id"
                      label
                      name="type"
                      class="checkboxItem"
                    ></el-checkbox>
                    <i
                      v-if="!info.flag"
                      class="el-icon-delete"
                      @click="$emit('dealMaterialEvent', 'delete','audio', index)"
                    ></i>
                  </div>

                </template>
              </el-menu-item>

            </el-menu-item-group>

          </el-submenu>
        </el-menu> -->
        <!--视频素材-->
        <!-- <el-menu
          :default-openeds="['1']"
          :flag="info.flag"
          class="videoMaterialArea">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-film"></i>
              <span>视频素材</span>
            </template>
            <el-menu-item-group>
              <el-menu-item :key="d.id" v-for="(d, index) in info.data.video">
                <template slot="title"  >
                  <div slot="header" style="line-height:1; cursor: pointer;" class="clearfix">
                <a
                  class="titleText"
                  :title="d.title"
                  :href="'/#/fwbscdetail?id=' + d.id"
                  @click="dealMaterialClick(d);"
                >{{d.title}}</a>
                    <el-checkbox
                      @change="handleCheckedChange(d)"
                      v-model="d.isChecked"
                      :key="d.id"
                      label
                      name="type"
                      class="checkboxItem"
                    ></el-checkbox>
                    <i
                      v-if="!info.flag"
                      class="el-icon-delete"
                      @click="$emit('dealMaterialEvent', 'delete','video', index)"
                    ></i>
                  </div>
                </template>
              </el-menu-item>
            </el-menu-item-group>

          </el-submenu>
        </el-menu> -->

      </slot>
    </p>
  </div>
</template>


<style scoped>
.titleText {
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: calc( 100% - 25px );
  display: inline-block;
  color: #333;
  line-height:50px;
  text-indent: 17px;
}
.clearfix{
 margin-left:0!important;
}
.checkboxItem {
  float: left;
  display: none;
  position: absolute;
  margin-top: 14px;
  left: 2px;
}
/deep/ .el-submenu__title i {
  margin-right: 0px !important;
}
/deep/ .el-submenu__title {
  padding-left: 18px !important;
}

/deep/ .el-menu[flag=true] .el-submenu__title {
  padding-left: 5px !important;
}

.textMaterialArea  .checkboxItem {
   display: inline-block;
 }
  .selectAllCheckbox {
    position: absolute;
    top: 20px;
    left: 12px;
  }
  .el-icon-delete {
    position: absolute;
    bottom: 16px;
    right: 8px;
    cursor: pointer;
  }

</style>


<script>
export default {
  name: "MaterialListOp",
  data() {
    return {
      openeds:[1],
      info: {
        flag: false,
        isIndeterminate: false,
        value: [],
        data: {
          text: [],
          image: [],
          video: [],
          audio: []
        }
      }
    };
  },
  created(){

  },
  beforeMount() {
    this.info = this.materialList;
    console.log(this.info,888)
  },
  methods: {
    dealMaterialClick(d) {
      event.preventDefault();
      this.$emit('dealMaterialEvent', 'viewMaterialItem', d);
      return false;
    },
    handleCheckAllChange(val) {
      this.info.value = [];
      var count = 0;
      this.info.data.text.map(item => {
        this.$set(item, "isChecked", val);
        if (item.isChecked) {
          this.info.value.push(item.id);
          count++;
        }
      });
      this.info.isIndeterminate = false;
    },
    handleCheckedChange(val) {
      var count = 0;
      this.info.value = [];
      this.info.data.text.map(item => {
        if (item.isChecked) {
          this.info.value.push(item.id);
          count++;
        }
      });
      this.info.isIndeterminate = count > 0 && count < this.info.data.text.length;
      if (!this.info.isIndeterminate) {
        this.info.checkAll = count === this.info.data.text.length;
      }
    }
  },
  props: {
    materialList: Object
  }
};
</script>


