<template>
  <div>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" style="background-color: #409EFF">
      <el-row>
        <el-col :span="2" :offset="2">
          <el-menu-item index="1"><img src="static/image/csust.png"/></el-menu-item>
        </el-col>
        <el-col :span="1" :offset="16">
          <el-menu-item index="2" class="ele-nav-item"><i class="el-icon-user-solid"></i><a
            href="https://www.ele.me">登录</a></el-menu-item>
        </el-col>
      </el-row>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "NavMenu",
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
