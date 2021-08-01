<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created(){
    // localStorage.setItem('userinfo','{"role":[{"label":"知识图谱","parentId":null,"id":"2f37c500993a4bb1888ac25debce458b","menuUrl":"/index","menuType":"0","orderby":1,"children":[]},{"label":"文档标注","parentId":null,"id":"6dc96da864ae42d5990c1fb6443dd1f7","menuUrl":"/tool","menuType":"0","orderby":2,"children":[]},{"label":"标签管理","parentId":null,"id":"808820e9adf0424f897c87e756e86886","menuUrl":"/labelManager","menuType":"0","orderby":3,"children":[]},{"label":"系统管理","parentId":null,"id":"3593d7ba70b741f6b38b7939cb92bbeb","menuUrl":"/sysManager","menuType":"0","orderby":4,"children":[{"label":"用户管理","parentId":"3593d7ba70b741f6b38b7939cb92bbeb","id":"7f710c7a98f140fcb64f8a9d85d19158","menuUrl":"userManager","menuType":"1","orderby":1,"children":[]},{"label":"角色管理","parentId":"3593d7ba70b741f6b38b7939cb92bbeb","id":"23939b14f4dd4be2bf2ce57b78cca104","menuUrl":"roleManager","menuType":"1","orderby":2,"children":[]}]}],"nickname":"管理员","isAdmin":"0","userId":"0d0f3841847449e88cfa4ae655421d5a","token":"eyJhbGciOiJIUzI1NiJ9.eyJ1SWQiOiIwZDBmMzg0MTg0NzQ0OWU4OGNmYTRhZTY1NTQyMWQ1YSIsInBzIjoiZGQ3ZmIxM2IxZDk1NDA4YjNiYzZhNjY3OTQ2N2Q5YWEiLCJleHAiOjE2MTY0NzgyNTF9.XecZM_fJOFh6drjnvUEezRRI8EnXdR6IC_1uZ-iz_Ns"}')
    // localStorage.setItem('token','eyJhbGciOiJIUzI1NiJ9.eyJ1SWQiOiIwZDBmMzg0MTg0NzQ0OWU4OGNmYTRhZTY1NTQyMWQ1YSIsInBzIjoiZGQ3ZmIxM2IxZDk1NDA4YjNiYzZhNjY3OTQ2N2Q5YWEiLCJleHAiOjE2MTY1NDk4MTJ9.D9arcHxnyDUznATQhuQrSPchUM_ASu73qssvjIWPO-g')

  },
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
  html,
  body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    background: #F9FAFC;
  }
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;;
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}
</style>
