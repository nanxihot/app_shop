<!--
 * @Author: 张闯
 * @Date: 2021-03-29 22:23:48
 * @LastEditors: 张闯
 * @LastEditTime: 2021-03-30 09:12:36
 * @Description: 添加商品行为区域 页面存在bug
 * @FilePath: \src\components\goods\Add.vue
-->
<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <el-row>
        <el-col>
          <!-- 提示区 -->
          <el-alert
            title="消息提示的文案"
            type="info"
            center
            show-icon
            :closable="false"
          >
          </el-alert>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <!-- 步骤条 -->
          <el-steps
            align-center
            :space="200"
            :active="activeIndex - 0"
            finish-status="success"
          >
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="完成"></el-step>
          </el-steps>
        </el-col>
      </el-row>
      <!-- tab栏区域 -->
      <el-row>
        <el-col>
          <el-form
            :model="addForm"
            :rules="addFormRules"
            ref="addFormRef"
            label-width="100px"
            label-position="top"
          >
            <el-tabs
              @tab-click="tabClicked"
              :before-leave="beforeTabLeave"
              v-model="activeIndex"
              :tab-position="'left'"
            >
              <el-tab-pane name="0" label="基本信息">
                <el-form-item label="商品名称" prop="goods_name">
                  <el-input v-model="addForm.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="goods_price">
                  <el-input
                    v-model="addForm.goods_price"
                    type="number"
                  ></el-input>
                </el-form-item>
                <el-form-item label="商品重量" prop="goods_weight">
                  <el-input
                    v-model="addForm.goods_weight"
                    type="number"
                  ></el-input>
                </el-form-item>
                <el-form-item label="商品数量" prop="goods_number">
                  <el-input
                    v-model="addForm.goods_number"
                    type="number"
                  ></el-input>
                </el-form-item>
                <el-form-item label="商品分类" prop="goods_cat">
                  <el-cascader
                    v-model="addForm.goods_cat"
                    :options="cateList"
                    :props="cateProps"
                    @change="handleChange"
                  ></el-cascader>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane name="1" label="商品参数">
                <el-form-item
                  v-for="item in manyTableData"
                  :key="item.attr_id"
                  :label="item.attr_name"
                >
                  <el-checkbox-group v-model="item.attr_vals">
                    <el-checkbox
                      :label="ite"
                      v-for="(ite, i) in item.attr_vals"
                      :key="i"
                      border
                    ></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane name="2" label="商品属性">
                <el-form-item
                  :label="item.attr_name"
                  v-for="item in onlyTableData"
                  :key="item.attr_id"
                >
                  <el-input v-model="item.attr_vals"></el-input>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane name="3" label="商品图片">
                <el-upload
                  :action="uploadURL"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  list-type="picture"
                  :headers="headersObj"
                  :on-success="handlSuccess"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">
                    只能上传jpg/png文件，且不超过500kb
                  </div>
                </el-upload>
              </el-tab-pane>
              <el-tab-pane name="4" label="商品内容">
                <quill-editor v-model="addForm.goods_introduce">

                </quill-editor>
                <el-button @click="add" class="btnAdd" type="primary">添加商品</el-button>
              </el-tab-pane>
            </el-tabs>
          </el-form>
        </el-col>
      </el-row>
      <!-- 图片预览 -->
      <el-dialog
        title="图片预览"
        :visible.sync="previewVisible"
        width="50%"
      >
        <img :src="previewPath" alt="" class="proviewImg">
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  props: {},
  data() {
    return {
      activeIndex: "0",
      // 添加商品form表单的绑定的对象
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 商品图片地址数组
        pics: [],
        // 商品的详情描述
        goods_introduce: "",
        // 商品参数
        attrs: [],
      },
      // 添加商品form表单验证规则
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      // 商品分类列表
      cateList: [],
      // 商品分类联机选择框动态配置属性
      cateProps: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      // 商品参数面板列表数据
      manyTableData: [],
      // 商品属性面板列表数据
      onlyTableData: [],
      // 图片上传的url
      uploadURL: "https://www.liulongbin.top:8888/api/private/v1/upload",
      // 图片上传的请求头对象
      headersObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      // 预览图片的路径
      previewPath: "",
      // 图片处理对话框的显示与隐藏
      previewVisible: false,
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取所有商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.cateList = res.data;
      console.log(this.cateList);
      console.log(res);
    },
    // 级联选择其选中项变化触发的函数
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    // el-tabs标签页切换之前的回调函数
    beforeTabLeave(activeName, oldActiveName) {
      if (this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },
    // tabs标签被选中时的回调函数
    async tabClicked() {
      console.log(this.activeIndex);
      if (this.activeIndex === "1") {
        console.log("1");
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "many" },
          }
        );
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        this.manyTableData = res.data;
        console.log(this.manyTableData);
      } else if (this.activeIndex === "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "only" },
          }
        );
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.onlyTableData = res.data;
        console.log(this.onlyTableData);
      }
    },
    // 处理图片预览效果
    handlePreview(file) {
      console.log(file)
      this.previewPath = file.response.data.url;
      this.previewVisible = true
    },
    // 处理移除图片的操作
    handleRemove(file) {
      console.log(file);
      const filePath = file.response.data.tmp_path;
      const i = this.addForm.pics.findIndex((x) => x.pic === filePath);
      this.addForm.pics.splice(i, 1);
      console.log(this.addForm);
    },
    // 监听图片上传成功的函数
    handlSuccess(response) {
      console.log(response);
      const picInfo = { pic: response.data.tmp_path };
      this.addForm.pics.push(picInfo);
      console.log(this.addForm);
    },
    // 添加商品
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写必要的表单项')
        // 执行添加的业务逻辑
        const from = _.cloneDeep(this.addForm)
        from.goods_cat = from.goods_cat.join(',')
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        from.attrs = this.addForm.attrs
        console.log(from)
        // 发起添加商品的网络请求
        // 商品的名称必须是唯一的
        const { data: res } = await this.$http.post('goods', from)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) return this.addForm.goods_cat[2];
      return null;
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
.el-checkbox {
  margin: 0px 10px 0px 0px !important;
}
.proviewImg{
  width: 100%;
}
.btnAdd{
  margin-top: 20px;
}
</style>
