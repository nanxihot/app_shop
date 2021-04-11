<!--
 * @Author: 张闯
 * @Date: 2021-03-29 17:01:18
 * @LastEditors: 张闯
 * @LastEditTime: 2021-03-29 22:23:04
 * @Description:
 * @FilePath: \src\components\goods\List.vue
-->
<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryinfo.query"
            class="input-with-select"
            @clear="getGoodsList"
            clearable
          >
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table 表格区 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格（元）"
          width="105px"
          prop="goods_price"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          width="70px"
          prop="goods_weight"
        ></el-table-column>
        <el-table-column label="创建时间" width="140px" prop="add_time">
          <template slot-scope="scope">
            {{ scope.row.add_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column width="130px" label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeId(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      // 搜索框
      searchInput: "",
      // 查询参数对象
      queryinfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      //   商品列表
      goodsList: [],
      total: 0,
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    //   根据分页获取对应的商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryinfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.$message.success(res.meta.msg)
      this.goodsList = res.data.goods;
      this.total = res.data.total;
      console.log(res);
    },
    // 分页器pagesize改变触发的函数
    handleSizeChange(newSize) {
      this.queryinfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage) {
      this.queryinfo.pagesize = newPage
      this.getGoodsList()
    },
    // 根据id删除数据
    async removeId(id) {
      const confirmResult = await this.$confirm('此操作将永久删除产品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') { return this.$message.info('已取消删除') }
      const { data: res } = this.$http.delete(`goods/${id}`)
      if (res.meta.status !== 200) { return this.$message.error(res.meta.msg) }
      this.$message.success(res.meta.msg)
      this.getGoodsList()
    },
    // 添加数据
    goAddPage() {
      this.$router.push('/goods/add')
    }
  },
  components: {},
};
</script>

<style scoped lang="less">
</style>
