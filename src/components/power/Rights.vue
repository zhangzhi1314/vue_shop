<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    
    </el-breadcrumb>
  <!--表格区域-->
    <el-card>
      <el-table :data="rightData" stripe style="width: 100%" border>
        <el-table-column type="index" width="180" label="编号">
        </el-table-column>
        <el-table-column prop="id" label="权限ID" width="280">
        </el-table-column>
        <el-table-column prop="authName" label="权限名称" width="280">
        </el-table-column>
        <el-table-column prop="path" label="路径" width="280">
        </el-table-column>
        <el-table-column prop="level" label="权限等级">
        <template slot-scope="scope">
           <el-button type="primary" v-if="scope.row.level==='0'">一级</el-button>
          <el-button type="success" v-else-if="scope.row.level==='1'">二级</el-button>
          <el-button type="warning" v-else>三级</el-button>
        </template>
         
        </el-table-column>
      </el-table></el-card
    >
  </div>
</template>
<script>
export default {
  data() {
    return {
      rightData: [],
    };
  },
  methods: {
    async getRightData() {
      const { data: msg } = await this.$http.get("rights/list");
      console.log(msg);
      if (msg.meta.status !== 200) {
        return this.$message.error("获取权限失败");
      }
      this.rightData = msg.data;
    },
  },
  created() {
    this.getRightData();
  },
};
</script>
