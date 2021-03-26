<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <!-- 添加角色按钮区 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区 -->
      <el-row>
        <el-col>
          <el-table :data="roleslist" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id" :class="['vcenter','el-row-bottom-border', i1 == 0 ? 'el-row-top-border':'']">
                  <!-- 一级权限 -->
                  <el-col :span="5">
                    <el-tag                         @close="removeRoleId(scope.row,item1.id)" closable>{{item1.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 二级权限及三级权限 -->
                  <el-col :span="19">
                    <el-row  :class="[i2 != 0 ? 'el-row-top-border':'','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                      <el-col :span="6">
                        <el-tag
                        @close="removeRoleId(scope.row,item2.id)"
                        closable type="success">{{item2.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                      </el-col>
                      <el-col :span="18">
                        <el-tag
                        @close="removeRoleId(scope.row,item3.id)"
                        closable type="warning" v-for="item3 in item2.children" :key="item3.id">
                          {{item3.authName}}
                        </el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作" width="300">
              <template slot-scope="scope">
                   <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">编辑</el-button>
                   <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteRole(scope.row.id)">删除</el-button>
                   <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
               </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <!-- 添加角色对话框 -->
      <el-dialog
        @close="addDialogClose"
        title="添加角色"
        :visible.sync="addDialogVisible"
        width="50%"
      >
        <!-- 内容主体区 -->
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="80px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoles">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改角色对话框 -->
      <el-dialog
        @close="editDialogClose"
        title="添加角色"
        :visible.sync="editDialogVisible"
        width="50%"
      >
        <!-- 内容主体区 -->
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRef"
          label-width="80px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRoles">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配权限的对话框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="setRightsDialogVisible"
        width="50%"
        @close = "setRightDialogClosed"
      >
        <!-- 树形控件 -->
        <el-tree ref="treeRef" :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys"></el-tree>
        <!-- 底部区 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
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
      // 添加角色对话框的显示与隐藏
      addDialogVisible: false,
      // 修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 分配权限对话框的显示与隐藏
      setRightsDialogVisible: false,
      // 所有角色列表数据
      roleslist: [],
      // 添加角色表单数据
      addForm: {
        roleName: "",
        roleDesc: ""
      },
      // 所有权限数据
      rightslist: [],
      // 修改角色表单数据
      editForm: {},
      // 添加角色表单校验规则
      addFormRules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名",
            trigger: "blur",
          }
        ],
        roleDesc: [
          {
            required: true,
            message: "请描述角色",
            trigger: "blur",
          }
        ]
      },
      // 修改角色表单校验规则
      editFormRules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名",
            trigger: "blur",
          }
        ]
      },
      // 树形控件规则
      treeProps: {
        children: "children",
        label: "authName"
      },
      // 树形节点的默认选中的id值数据
      defKeys: [],
      // 当前即将分配权限的角色id
      roleId: ''
    };
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles/'
      )
      if (res.meta.status !== 200) { return this.$message.error(res.meta.msg) }
      this.roleslist = res.data
    },
    // 关闭添加角色对话框时重置表单
    addDialogClose() {
      // 重置表单
      this.$refs.addFormRef.resetFields();
    },
    // 关闭修改角色对话框时重置表单
    editDialogClose() {
      // 重置表单
      this.$refs.editFormRef.resetFields();
    },
    // 添加角色
    addRoles() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post('roles/', this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.addDialogVisible = false
        this.getRolesList()
      })
    },
    // 根据id查询角色
    async showEditDialog(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get(`roles/${id}`)
      if (res.meta.status !== 200) { return this.$message.error(res.meta.msg) }
      this.editForm = res.data
      console.log(this.editForm)
    },
    // 修改角色
    editRoles() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(`roles/${this.editForm.roleId}`, this.editForm)
        if (res.meta.status !== 200) { return this.$message.error(res.meta.msg) }
        this.getRolesList()
        this.editDialogVisible = false
      })
    },
    // 删除角色
    async deleteRole(id) {
      const confirmResult = await this.$confirm("此操作将永久删除角色信息是否继续", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err)
      console.log(confirmResult)
      if (confirmResult !== "confirm") {
        return this.$message.info('已取消删除角色数据')
      }
      const { data: res } = await this.$http.delete(`roles/${id}`)
      if (res.meta.status !== 200) { return this.$message.error(res.meta.msg) }
      this.$message.success(res.meta.msg)
      this.getRolesList()
    },
    // 根据id删除对应的权限
    async removeRoleId(role, rightId) {
      // 提示用户是否要删除角色
      const confirmResult = await this.$confirm(
        "此操作将永久删除此权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除权限')
      }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId
      }`)
      if (res.meta.status !== 200) { return this.$message.error(res.meta.msg) }
      this.$message(res.meta.msg)
      role.children = res.data
    },
    // 显示分配角色对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) { return this.$message.error(res.meta.msg) }
      this.rightslist = res.data
      this.getLeafKeys(role, this.defKeys)
      this.setRightsDialogVisible = true
    },
    // 通过递归的形式获取所有三级权限的id,并保全到defKeys中
    getLeafKeys(node, arr) {
      // 如果当前node节点不包含children属性，则是三级节点
      if (!node.children) { return arr.push(node.id) }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      });
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights() {
      const kefs = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const idstr = kefs.join(",")
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idstr })
      if (res.meta.status !== 200) { return this.$message.error(res.meta.msg) }
      this.$message.success(res.meta.msg)
      this.getRolesList()
      this.setRightsDialogVisible = false
    }
  },
  components: {},
};
</script>

<style scoped lang="less">
.el-tag{
  margin: 7px;
}
.el-row-bottom-border{
  border-bottom: 1px solid #eee;
}
.el-row-top-border{
  border-top: 1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>
