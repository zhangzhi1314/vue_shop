<template>
  <div>
  <el-button @click="logOut">默认按钮</el-button>
  
    </div>
</template>
<script>
export default{

    methods:{
       logOut(){
        window.sessionStorage.clear();
        this.$router.push('/login')
}
    }
}

</script>
