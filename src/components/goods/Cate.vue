<template>
  <div>
    <!--添加分类的弹出框-->
    <el-dialog title="添加分类" :visible.sync="dialogVisible" width="30%" @close="clearDialog" >
      <el-form
        :model="sortInf"
        ref="sortInf"
        label-width="100px"
        class="demo-ruleForm"
        :rules="rules"
      >
        <el-form-item label="分类名称" prop="sort_name">
          <el-input v-model="sortInf.sort_name"></el-input>
        </el-form-item>
        <el-form-item label="父类分级">
          <!--option指定数据源-->
          <!--props指定配置对象-->
          <div class="block">
            <el-cascader
              clearable
              change-on-select="true"
              expand-trigger="hover"
              :props="cascaderProps"
              :options="parentInf"
              v-model="selectedOptions2"
              @change="parentChange"
            >
            </el-cascader>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="startAdd">确 定</el-button>
      </span>
    </el-dialog>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addGoodSort"
            >添加分类</el-button
          ></el-col
        >
      </el-row>
      <el-table :data="goodList" stripe style="width: 100%" border>
        <el-table-column type="expand" label="展开" width="50">
          <template slot-scope="props">
            <el-table border :data="props.row.children" style="width: 100%">
              <el-table-column type="expand" label="展开" width="180">
                <!--第三层 详细的商品信息-->
                <template slot-scope="thirdItem">
                  <el-table
                    :data="thirdItem.row.children"
                    stripe
                    style="width: 100%"
                    border
                  >
                    <el-table-column
                      prop="cat_name"
                      label="商品名称"
                      width="180"
                    >
                    </el-table-column>
                    <el-table-column label="详细类别" >
                      <template slot-scope="jibie">
                        <el-tag v-if="jibie.row.cat_level === 0">一级</el-tag>
                        <el-tag
                          v-else-if="jibie.row.cat_level === 1"
                          type="success"
                          >二级</el-tag
                        >
                        <el-tag v-else type="warning">三级</el-tag>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column prop="cat_name" label="详细类别" width="180">
              </el-table-column>
              <el-table-column label="类别等级" width="180">
                <template slot-scope="jibie">
                  <el-tag v-if="jibie.row.cat_level === 0">一级</el-tag>
                  <el-tag v-else-if="jibie.row.cat_level === 1" type="success"
                    >二级</el-tag
                  >
                  <el-tag v-else type="warning">三级</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column type="index" label="编号" width="180">
        </el-table-column>
        <el-table-column prop="cat_name" label="分类名称" width="180">
        </el-table-column>
        <el-table-column label="是否有效" width="180">
          <template slot-scope="scope">
            <i
              class="el-icon-success"
              v-if="scope.row.cat_deleted === false"
              style="color: lightgreen"
            ></i>
            <i
              class="el-icon-error"
              v-else-if="scope.row.cat_deleted === true"
            ></i>
          </template>
        </el-table-column>
        <el-table-column prop="cat_level" label="类别等级">
          <template slot-scope="jibie">
            <el-tag v-if="jibie.row.cat_level === 0">一级</el-tag>
            <el-tag v-else-if="jibie.row.cat_level === 1" type="success"
              >二级</el-tag
            >
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <el-button type="primary">编辑</el-button
          ><el-button type="danger">删除</el-button></el-table-column
        >
      </el-table>
      <!--显示分页功能的部分-->
      <div class="block">
        <span class="demonstration"></span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 3, 4, 5, 6]"
          :page-size="queryInfo.pagesize"
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
      rules: {
        sort_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 2 到 10 个字符", trigger: "blur" },
        ],
      },
      sortInf: {
        sort_id: 0, //父级分类的id
        sort_name: "", //将要添加的分类名称
        sort_level: 0, //分类的等级，默认一级
      },
      dialogVisible: false,
      total: 0, //总的分类数量
      goodList: [],
      queryInfo: { pagenum: 1, pagesize: 6 },
      parentInf: [], //从后台获得的父级商品类别
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      selectedOptions2: [], //已经选择的父级分类id
    };
  },
  created() {
    this.getGoodList();
  },
  methods: {
    clearDialog() {
      this.$refs.sortInf.resetFields();
      this, (this.selectedOptions2 = []);
      this.sortInf.sort_level = 0;
      this.sortInf.sort_id = 0;
    },
    //开始添加分类
    startAdd() {
      this.$refs.sortInf.validate(async (valid) => {
        if (!valid) {
          return;
        } else {
          const { data: msg } = await this.$http.post("categories", {
            cat_id: this.sortInf.sort_id,
            cat_name: this.sortInf.sort_name,
            cat_level: this.sortInf.sort_level,
          });
          console.log(msg);
          this.dialogVisible = false;
        }
      });
    },
    //级联选择框数据变化触发函数
    parentChange() {
      console.log(this.selectedOptions2);
      if (this.selectedOptions2.length > 0) {
        this.sortInf.sort_id = this.selectedOptions2[
          this.selectedOptions2.length - 1
        ];
        this.sortInf.sort_level = this.selectedOptions2.length; //为当前分类的等级分类
      } else {
        this.sortInf.sort_id = 0;
        this.sortInf.sort_level = 0;
      }
    },
    async getParentList() {
      const { data: msg } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (msg.meta.status !== 200) {
        return console.log(msg.meta.msg);
      }
      this.parentInf = msg.data;
    },
    //点击添加分类
    addGoodSort() {
      this.dialogVisible = true;

      this.getParentList();
    },
    //手动改变当前显示的页码数
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodList();
    },
    //通过分页手动改变当前页显示的数量
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodList();
    },
    async getGoodList() {
      const { data: msg } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (msg.meta.status !== 200) {
        return console.log(msg.meta.msg);
      }
      this.goodList = msg.data.result;
      this.total = msg.data.total;

    },
  },
};
</script>
<style scope>
.el-cascader {
  width: 100%;
}
</style>