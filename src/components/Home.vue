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
        <el-aside width="200px">
          <!-- 菜单区域 -->
          <el-menu
          :default-openeds="openeds"
            default-active="2"
            class="el-menu-vertical-demo"
           
            background-color="#333744"
            text-color="#fff"
            active-text-color="#ffd04b"
          >
            <el-submenu index="1" collapse="true">
            <!-- 一级菜单的模板区域 -->
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>导航一</span>
              </template>
              <!-- 二级菜单 -->
             <el-menu-item index="1-4-1">
             <template slot="title">
                <i class="el-icon-location"></i>
                <span>二级菜单</span>
              </template>
             </el-menu-item>
             
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  data () {
    return {
      openeds: ['1'],
      uniqueOpened: false
    }
},
  methods: {
    logOut() {
      window.sessionStorage.clear();
      this.$router.push("/login");
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
</style>
