<template>
  <!--This is navigate component!!!-->
  <div class="tab_bar">
    <i-tab-bar v-bind:current="currentPage" color="#4da5ff" v-on:change="tabChange">
      <i-tab-bar-item key="index" icon="homepage" current-icon="homepage_fill" title="首页"></i-tab-bar-item>
      <i-tab-bar-item key="piazza" icon="group" current-icon="group_fill" title="广场" ></i-tab-bar-item>
      <i-tab-bar-item key="shopCar" icon="remind" current-icon="remind_fill" title="订单"></i-tab-bar-item>
      <i-tab-bar-item key="mine" icon="mine" current-icon="mine_fill" title="我的"></i-tab-bar-item>
    </i-tab-bar>
  </div>
</template>

<script>
export default {
  props: ["initPage"],
  data () {
    return {
      currentPage:this.initPage
    }
  },
  methods: {
    tabChange (e) {
      this.currentPage = e.target.key
      let url = '';
      switch (this.currentPage){
        case "index":
          url = "/pages/index/main";
          break;
        case "shopCar":
          url = "/pages/shopCar/main";
          break;
        case "mine":
          url = "/pages/mine/main";
          break;
      }
      wx.switchTab({ url })
    }
  }
}
</script>

<style>
  .tab_bar{
    position: fixed;
    bottom: 0;
    width: 100%;
  }
</style>
