<!--
 * @Author: 张闯
 * @Date: 2021-03-26 18:07:38
 * @LastEditors: 张闯
 * @LastEditTime: 2021-03-28 19:39:02
 * @Description:
 * @FilePath: \src\components\goods\Categories.vue
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
          <el-button type="primary" @click="showAddCatedialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格区 -->
      <tree-table
        class="treeTable"
        :data="catelist"
        :show-row-hover="false"
        border
        index-text="#"
        show-index
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            style="color: lightgreen"
            v-if="!scope.row.cat_deleted"
          ></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            @click="showEditCatedialog(scope.row)"
            size="mini"
            type="primary"
            icon="el-icon-edit"
            >编辑</el-button
          >
          <el-button @click="removeCate(scope.row.cat_id)" size="mini" type="danger" icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 添加分类的对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addCatedialogVisible"
        width="50%"
        @close="addCateDialogClosed"
      >
        <!-- 添加分类的表单 -->
        <el-form
          :model="addCateForm"
          :rules="addCateFormRules"
          ref="addCateFormRef"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader
              v-model="selectedKeys"
              :options="parentCateList"
              :props="cascaderProps"
              @change="parentcateChanged"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCatedialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑分类对话框 -->
      <el-dialog
        title="编辑分类"
        :visible.sync="editCatedialogVisible"
        width="50%"
      >
        <!-- 编辑分类的表单 -->
        <el-form
          :model="editCateForm"
          :rules="editCateFormRules"
          ref="editCateFormRef"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editCateForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editCatedialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCate">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      // 添加分类对话框的显示与隐藏
      addCatedialogVisible: false,
      // 编辑分类对话框的显示与隐藏
      editCatedialogVisible: false,
      // 查询条件 分页数据
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 商品分类的数据列表
      catelist: [],
      // 总数据条数
      total: 0,
      // 为tree-table指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          prop: "cat_deleted",
          type: "template",
          template: "isok",
        },
        {
          label: "排序",
          prop: "cat_level",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
      // 添加分类表单数据对象
      addCateForm: {
        // 分类名称
        cat_name: "",
        // 父级分类的id
        cat_pid: 0,
        // 添加分类的等级
        cat_level: 0,
      },
      // 添加分类的验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      // 编辑分类的验证规则
      editCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      // 父级分类数据
      parentCateList: [],
      // 级联选着器的配置选项
      cascaderProps: {
        checkStrictly: true,
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 选中的父级分类的id数据
      selectedKeys: [],
      // 编辑分类表单数据
      editCateForm: {},
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.querInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.catelist = res.data.result;
      console.log(this.catelist);
      this.total = res.data.total;
    },
    // 监听pagesize的改变
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize;
      this.getCateList();
    },
    // 监听pagenum的改变
    handleCurrentChange(pageNum) {
      this.querInfo.pagenum = pageNum;
      this.getCateList();
    },
    // 添加分类兑换框处理事件
    showAddCatedialog() {
      this.getParentCateList();
      this.addCatedialogVisible = true;
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.parentCateList = res.data;
      console.log(this.parentCateList);
    },
    // 级联选着器发生变化执行的函数
    parentcateChanged() {
      console.log(this.selectedKeys);
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        this.addCateForm.cat_level = this.selectedKeys.length;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    // 添加新的分类
    addCate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg);
        }
        this.$message.success(res.meta.msg);
        this.getCateList();
        this.addCatedialogVisible = false;
      });
    },
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    },
    // 展示编辑分类对话框
    showEditCatedialog(catName) {
      this.editCateForm = catName
      console.log(this.editCateForm)
      this.editCatedialogVisible = true
    },
    // 编辑分类
    editCate() {
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) { return }
        const { data: res } = await this.$http.put(`categories/${this.editCateForm.cat_id}`, { cat_name: this.editCateForm.cat_name })
        if (res.meta.status !== 200) { return this.$message.error(res.meta.msg) }
        this.$message.success(res.meta.msg)
        this.getCateList()
        this.editCatedialogVisible = false
      })
    },
    // 移除角色
    async removeCate(id) {
      const confirmResult = await this.$confirm("此操作将永久删除分类信息是否继续", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err)
      console.log(confirmResult)
      if (confirmResult !== "confirm") {
        return this.$message.info('已取消删除角色数据')
      }
      const { data: res } = await this.$http.delete(`categories/${id}`)
      if (res.meta.status !== 200) { return this.$message.error(res.meta.msg) }
      this.$message.success(res.meta.msg)
      this.getCateList()
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
.treeTable {
  margin-top: 15px;
}
.el-pagination {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
