<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-table :data="orderList" stripe border>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="订单编号"
              prop="order_name"
            ></el-table-column>
            <el-table-column
              label="订单价格"
              prop="order_price"
            ></el-table-column>
            <el-table-column label="是否付款" prop="pay_status">
              <template slot-scope="scope">
                <el-tag type="danger" v-if="scope.row.pay_status === '0'"
                  >未付款</el-tag
                >
                <el-tag type="success" v-else>已付款</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="是否发货" prop="is_send"></el-table-column>
            <el-table-column label="下单时间" prop="create_time">
              <template slot-scope="scope">
                {{ scope.row.create_time | dataFormat }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showBox"
                ></el-button>
                <el-button
                  size="mini"
                  type="success"
                  icon="el-icon-location"
                  @click="showProgressBox"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页区 -->
          <div>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[5, 10, 15, 20]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </div>
        </el-col>
      </el-row>
      <!-- 修改地址的对话框区域 -->
      <el-dialog
        title="修改地址"
        :visible.sync="editDialogVisible"
        width="50%"
        :before-close="handleClose"
        @close = 'addressDialogClsose'
      >
        <el-form
          :model="addressesForm"
          :rules="addressesFormRules"
          ref="addressesFormRef"
          label-width="100px"
        >
          <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addressesForm.address1"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressesForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editDialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 展示物流进度的对话框 -->
      <el-dialog
        title="修改地址"
        :visible.sync="progressDialogVisible"
        width="50%"
      >
        <!-- 时间线 -->
          <el-timeline>
    <el-timeline-item
      v-for="(activity, index) in progressInfo"
      :key="index"
      :timestamp="activity.time">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import cityData from "../city.data.js"
// import cityData from "../city.js"
export default {
  props: {},
  data() {
    return {
      cityData,
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      //   总数据条数
      total: 0,
      orderList: [],
      editDialogVisible: false,
      progressDialogVisible: false,
      addressesForm: {
        address1: [],
        address2: '',
      },
      addressesFormRules: {
        address1: [
          { required: true, message: '请输入省市区/县', trigger: 'blur' }
        ],
        address2: [{ required: true, message: '请填写详细地址', trigger: 'blur' }],
      },
      progressInfo: [],
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.orderList = res.data.goods;
      this.total = res.data.total;
    },
    //
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      this.getOrderList();
    },
    showBox() {
      this.editDialogVisible = true;
    },
    handleClose() {
      console.log("iklasd");
    },
    addressDialogClsose() {
      this.$refs.addressesFormRef.resetFields()
    },
    async showProgressBox() {
      console.log('asd')
      const id = '1106975712662' // 测试id
      const { data: res } = await this.$http.get(`/kuaidi/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.message)
      this.$message.success(res.meta.message)
      this.progressInfo = res.data
      console.log(res)
      this.progressDialogVisible = true
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
.el-cascader{
  width: 100%;
}
</style>
