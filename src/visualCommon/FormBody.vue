<template>
  <div>
    <el-form :model="dataForm" size="small" ref="dataForm" label-width="100px" class="dataform">
      <el-row>
        <div class="headbox">
          <el-form-item label="标题名称:" prop="name">
            <el-input v-model="dataForm.name" size="small" placeholder="请输入标题名称" ></el-input>
          </el-form-item>

          <el-form-item label="描述" prop="textareas">
              <div style="color: #606266; border:1px solid  #dcdfe6;padding: 10px;">
                <div v-for="item in dataForm.textareas" >
                  <h4>{{item.title}}</h4>
                  <p style="color:rgb(157 159 164);;">{{item.describe}}</p>
                  <br />
                </div>
              </div>
          </el-form-item>

          <el-form-item label="权限" prop="">
            <div style="border: 1px solid #dcdfe6;padding: 10px;">
              <check-box :dataObj="dataForm"></check-box>
            </div>
          </el-form-item>
          <el-form-item label="布局" prop="">
            <div class="cardBox">
              <div class="cardBox1">
                <el-card v-for="(card,index) in dataForm.cardList" :key="index"
                  style="float: left;width: 380px;height: 240px;border: #dcdfe6;margin:10px;">
                  {{card}}
                </el-card>
              </div>
                <el-button style="position: absolute;left: 44%;bottom: 10px;" @click="showMore">加载更多</el-button>
            </div>
          </el-form-item>

          <el-form-item label="风格" prop="">
            <el-radio v-model="dataForm.radio" label="1" >浅色风格</el-radio>
            <el-radio v-model="dataForm.radio" label="2" >深色风格</el-radio>
          </el-form-item>
        </div>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import TableList from '@/visualCommon/TableList';
  import CheckBox from '@/visualCommon/CheckBox';
  export default {
    name: "Rule",
    props: {
      dataObj: Object,
    },
    components: {
      TableList,
      CheckBox
    },
    data() {
      return {
        n: 1,
        // radio:1,
        signObj: {
          isShow: false, //模块筛选栏
          operate: false, //操作按钮
          pageSign: false, //分页
          fake: true, //假表格
        },
        dataForm: {
          radio:'1',
          textareas: [],
          cardList: ['布局1', '布局2', '布局3', '布局4', '布局5', '布局6', '布局7', '布局8', '布局9', '布局10'],
          tableData: [],
        },
        cardBoxHeight: 520,
      }
    },
    watch: {
      dataObj: {
        handler(newValue, oldValue) {
          this.dataForm.tableData = newValue.tableData
        },
        deep: true,
        immediate: true
      },
    },
    created() {
      if (this.dataObj.textareas) {
        this.dataForm.textareas = this.dataObj.textareas
      }
    },
    mounted() {},
    methods: {

      handleCheckAllChange(val) {
        this.checkedCities = val ? this.dataForm.tableData : [];
        this.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.dataForm.tableData.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.dataForm.tableData.length;
      },
      showMore() {
        if (this.dataForm.cardList.length<=10) {
          if(this.n> this.dataForm.cardList.length/2){
            return;
          }else{
            this.cardBoxHeight += 260;
            document.querySelector('.cardBox').style.height = this.cardBoxHeight +80+ 'px';
            document.querySelector('.cardBox1').style.height = this.cardBoxHeight -20 + 'px';
            this.n += 2;
          }
        } else if(this.dataForm.cardList.length>10&&this.dataForm.cardList.length<13&&this.n> this.dataForm.cardList.length/2+2){
          return;
        }
        else if(this.dataForm.cardList.length>=13&&this.dataForm.cardList.length<=18&&this.n> this.dataForm.cardList.length/2+4){
          return;
        }
        else if(this.dataForm.cardList.length>18&&this.dataForm.cardList.length<=20 &&this.n>this.dataForm.cardList.length/2+6){
          return;
        }
        else{
            this.cardBoxHeight += 260;
            document.querySelector('.cardBox').style.height = this.cardBoxHeight +80+ 'px';
            document.querySelector('.cardBox1').style.height = this.cardBoxHeight -20 + 'px';
            this.n += 2;
          }
      },
    },

  }
</script>

<style scoped>
  .dataform {
    width: 1000px;
    box-sizing: border-box;
    float: left;
  }

  .cardBox {
    /* float: left; */
    position: relative;
    /* width: 800px; */
    height: 580px;
    overflow: hidden;
    border: 1px double #dcdfe6;
    padding: 20px;}

  .cardBox1 {
    float: left;
    /* position: relative; */
    width: 800px;
    height: 510px;
    overflow: hidden;
    /* border: 1px double #dcdfe6; */
    padding: 20px;
  }
</style>
