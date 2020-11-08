<template>
  <div>首页 {{ name }}</div>
</template>
<script>

export default {
  data() {
    return {
      name: '',
    };
  },
  created(){
      this.name = window.sessionStorage.getItem('username')
  }
};
</script>
