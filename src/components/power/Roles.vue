<template>
  <div>
    <!-- dialog对话框-->
    <el-dialog
      title="分配权限"
      :visible.sync="dialogVisible"
      width="30%"
      @close="clearKeyArr"
    >
      <el-tree
        ref="treeRef"
        :data="rightList"
        show-checkbox
        node-key="id"
        :default-expanded-keys="keyArr"
        :default-checked-keys="keyArr"
        :props="defaultProps"
      >
      </el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dealRights"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table border :data="rolesList" stripe style="width: 100%">
        <el-table-column type="expand" label="展开" width="50">
          <template slot-scope="scope">
            <el-row v-for="(item, index) in scope.row.children" :key="index">
              <!-- 渲染一级权限,scope.row表示获取当前行的数据-->
              <el-col :span="4">
                <el-tag closable @close="delRightByid(scope.row, item.id)">{{
                  item.authName
                }}</el-tag>
              </el-col>
              <!--渲染二级权限-->
              <el-col :span="20">
                <el-row v-for="(secondItem, id) in item.children" :key="id">
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="delRightByid(scope.row, secondItem.id)"
                      >{{ secondItem.authName }}</el-tag
                    >
                  </el-col>
                  <!-- 三级权限-->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      closable
                      v-for="(thirdItem, num) in secondItem.children"
                      :key="num"
                      @close="delRightByid(scope.row, thirdItem.id)"
                    >
                      {{ thirdItem.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="编号" width="180">
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="280">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="修改用户信息"
              placement="top-start"
            >
              <el-button type="primary" icon="el-icon-edit" circle @click="">
              </el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配权限"
              placement="top-start"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                circle
                @click="setRightDialog(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除成员"
              placement="top-start"
            >
              <el-button type="danger" icon="el-icon-delete" circle></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
     row:{},
      roleId:'',
      keyArr: [],
      rolesList: [], //角色列表数据
      rightList: [], //所有权限数据
      dialogVisible: false,
      defaultProps: {
        children: "children",
        label: "authName",
      },
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    //分配权限
   async dealRights() {
      const key=[...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()];
      const idStr = key.join(',');
      const {data:msg} = await this.$http.post(`roles/${this.roleId}/rights`,{
        rids:idStr
      });
      if (msg.meta.status !== 200){
      return   this.$message.error({message:"分配权限失败",duration:1500})
      }
      this.$message.success({message:"分配权限成功",duration:1500});
     
      console.log(msg);
      this.dialogVisible = false;
      
    },
    //监听事件，当dialog对话框关闭时
    clearKeyArr() {
      this.keyArr = [];
    },
    //获取三级权限的id
    getkeyArr(node, arr) {
      //如果当前node节点不包含children 则是三级节点，将三级节点的id给予arr
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.getkeyArr(item, arr);
      });
    },
    // 分配用户权限
    async setRightDialog(row) {
      this.roleId = row.id;
     this.row=row;
      const { data: msg } = await this.$http.get("rights/tree");
      console.log(msg);
      if (msg.meta.status !== 200) {
        return;
      }
      this.getkeyArr(row, this.keyArr);
      this.dialogVisible = true;
      this.rightList = msg.data;

      console.log(this.rightList);
    },
    async delRightByid(roleId, rightId) {
      const result = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((error) => error);
      if (result !== "confirm") {
        this.$message.info({ message: "取消了删除", duration: 1500 });
      } else {
        const { data: msg } = await this.$http.delete(
          `roles/${roleId.id}/rights/${rightId}`
        );
        console.log(msg);
        if (msg.meta.status !== 200) {
          return this.$message.error("删除失败");
        } else {
          this.$message.success({message:'删除权限成功',duration:1500});
          //返回的data是当前角色下最新的权限
          roleId.children = msg.data;
        }
      }
    },
    async getRolesList() {
      const { data: msg } = await this.$http.get("/roles");
      console.log(msg);
      this.rolesList = msg.data;
      console.log(this.rolesList);
    },
  },
};
</script>
<style scope>
.el-tag {
  margin-right: 15px;
  margin-bottom: 15px;
}
</style>