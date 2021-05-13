<template>
  <div style="position: relative">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" style="background-color: #409EFF">
      <el-row>
        <el-col :span="2" :offset="2">
          <el-menu-item index="1"><img src="static/image/csust.png"/></el-menu-item>
        </el-col>
        <!--        <el-col :span="1" :offset="15">-->
        <!--          <i class="el-icon-user-solid"></i>-->
        <!--        </el-col>-->
        <el-col :span="2" :offset="16">
          <el-avatar size="large" src="http://localhost:8080/static/res/images/pikapikaqiu.jpg"
                     style="position: absolute;margin-top: 10px;margin-left: 10px;z-index: 0"></el-avatar>
          <el-submenu index="2" class="ele-nav-item" style="display: inline-block;padding: 0;z-index: 1;opacity: 0">
            <el-menu-item index="2-1"><i class="el-icon-setting"></i>基本设置</el-menu-item>
            <el-menu-item index="2-2"><i class="el-icon-house"></i>个人主页</el-menu-item>
          </el-submenu>
        </el-col>
      </el-row>


    </el-menu>
  </div>
</template>

<script>
export default {
  name: "IndexNavMenu",
  data() {
    return {
      activeIndex: '1',
      activeIndex2: '1'
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>

<style>
@import '../../static/css/ele.css';
</style>
