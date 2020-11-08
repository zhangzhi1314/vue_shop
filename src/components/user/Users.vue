<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--添加按钮弹出内容-->
    <el-dialog
      title="请输入用户信息"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
    >
      <el-form
        label-width="80px"
        :rules="rules"
        ref="ruleForm"
        :model="ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="ruleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            :span="8"
            v-model="queryInf.query"
            @keyup.native.enter="getUserList"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="7">
          <el-button type="success" @click="centerDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="userList" stripe style="width: 100%" border="">
        <el-table-column type="index" width="50" label="编号">
        </el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" width="180">
        </el-table-column>
        <el-table-column prop="role_name" label="角色" width="180">
        </el-table-column>
        <el-table-column label="状态" width="180">
          <!-- 添加选择开关按钮 -->
          <!--通过scope.row获取当前列的数据-->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userStatus(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="180">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="Top Left 提示文字"
              placement="top-start"
            >
              <el-button type="primary" icon="el-icon-edit" circle> </el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top-start"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                circle
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除成员"
              placement="top-start"
            >
              <el-button type="danger" icon="el-icon-delete" circle @click="delUser(scope)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页功能区域 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInf.pagenum"
          :page-sizes="[1, 2, 3, 4]"
          :page-size="queryInf.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 8,
            max: 20,
            message: "长度在 8 到 20 个字符",
            trigger: "blur",
          },
        ],
        email: [{ required: true, message: "请输入活动邮箱", trigger: "blur" }],
        mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }],
      },
      centerDialogVisible: false,
      total: 0,
      userList: [],
      queryInf: {
        // 搜索关键字
        query: "",
        // 当前页数显示多少条数据
        pagenum: 1,
        // 页码数
        pagesize: 4,
      },
    };
  },

  created() {
    this.getUserList();
  },
  methods: {
    // 删除用户
   async delUser(inf){
     console.log(inf);
     const {data:msg} = await this.$http.delete(`users/${inf.row.id}`);
     console.log(msg);
     this.getUserList()
    },
    // 添加新用户
   async addUser() {
      this.centerDialogVisible = false;
      console.log(this.ruleForm);
      const {data:msg} = await this.$http.post('users',
        this.ruleForm);
    
      this.getUserList();

    },
    // 监听switch开关
    async userStatus(userinf) {
      const { data: res } = await this.$http.put(
        `users/${userinf.id}/state/${userinf.mg_state}`
      );
      if (res.meta.status !== 200) {
        userinf.msg.mg_state = !userinf.msg.mg_state;
        console.log(res.meta.msg);
      }
    },
    handleSizeChange(newSize) {
      this.queryInf.pagesize = newSize;
      this.getUserList();
    },
    handleCurrentChange(newPage) {
      this.queryInf.pagenum = newPage;
      this.getUserList();
    },
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInf,
      });
      if (res.meta.status !== 200) {
        console.log(res.mets.msg);
      }
      console.log(res);
      //   将后台获取的管理员信息赋值给this.userList
      this.userList = res.data.users;
      this.total = res.data.total;
    },
  },
};
</script>
<style scoped>
</style>