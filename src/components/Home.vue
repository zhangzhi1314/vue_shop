<template>
  <div class="home-div">
    <el-container class="home-container">
      <el-header>
        <div>
          <span>后台管理系统</span>
        </div>
        <el-button @click="logOut">退出</el-button></el-header
      >
      <el-container>
        <el-aside width="iscollapse ? 56px:200px">
          <!-- 菜单区域 -->
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409BFF"
            :collapse="iscollapse" 
            :collapse-transition="false"
            
            :router="true"
          >
            <div class="btn-zhedie" @click="isFold">|||</div>
            <!-- 为每一模板添加唯一的id值 -->
            <el-submenu
              :index="item.id + ''"
             
              v-for="item in list"
              :key="item.id"
             
            >
              <!-- 一级菜单的模板区域 -->
              <template slot="title">
                <i :class="icons[item.id]"></i>

                <span class="item-title">{{ item.authName }}</span>
              </template>
              <!-- 二级菜单 -->
              <!-- v-bind:index绑定索引值 -->
              <!-- secondIte.path指定路由的路径 -->

              <el-menu-item
                :index="'/'+secondIte.path"
                v-for="secondIte in item.children"
                :key="secondIte.id"
              >
                <template slot="title">
                  <i class="iconfont icon-all"></i>
                  <span class="sub-title">{{ secondIte.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main><router-view></router-view></el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: [],
      iscollapse: false,
      icons: {
        125: "iconfont icon-user",
        103: "iconfont icon-fenghuangxiangmutubiao_quanxian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-dingdan",
        145: "iconfont icon-gouwuche",
      },
    };
  },
  // 页面创建时，立即获取左侧列表信息
  created() {
    this.getMenuList();
  },
  methods: {
    isFold() {
      this.iscollapse = !this.iscollapse;
    },
    logOut() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 从后台获取列表数据
    async getMenuList() {
      const { data: listInf } = await this.$http.get("menus");
      console.log(listInf);
      // 做出判断，当成功从接口获取权限列表时才进行赋值
      if (listInf.meta.status !== 200) {
        console.log(listInf.meta.msg);
      }
      this.list = listInf.data;
    },
  },
};
</script>
<style scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: whitesmoke;
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedfe;
}
.home-div,
.home-container {
  height: 100%;
}
.item-title {
  margin-left: 8px;
  margin-right: 15px;
}
.sub-title {
  margin-left: 5px;
}
.btn-zhedie {
  color: white;
  font-size: 15px;
  line-height: 28px;
  text-align: center;
  background-color: #4a506c;
 
  cursor: pointer;
}
</style>
