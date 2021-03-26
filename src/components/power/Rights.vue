<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片式图区 -->
    <el-card>
       <el-table border stripe :data = "rightslist">
           <el-table-column type="index"></el-table-column>
           <el-table-column label="权限名称" prop="authName"></el-table-column>
           <el-table-column label="路径" prop="path"></el-table-column>
           <el-table-column label="权限等级" prop="level">
               <template slot-scope="scope">
                   <el-tag v-if="scope.row.level === '0'">一级权限</el-tag>
                   <el-tag type="success" v-else-if="scope.row.level === '1'">二级权限</el-tag>
                   <el-tag type="warning" v-else>三级权限</el-tag>
               </template>
           </el-table-column>
        </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      // 权限列表
      rightslist: []
    };
  },
  created() {
    this.getRightsList()
  },
  methods: {
    // 获取权限列表
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      console.log(res)
      if (res.meta.status !== 200) { return this.$message.error(res.meta.msg) }
      this.rightslist = res.data
    }
  },
  components: {},
};
</script>

<style scoped lang="less">
</style>
