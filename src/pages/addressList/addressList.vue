<template>
  <div class="container">
    <div class="list-c">
      <div class="item" v-for="(item, index) in getAddressList" :key="index">
        <div class="i-l">
          <div>
            <span @click="changeDefault(index)">
              <input type="radio" v-if="item.address_flag == 1" checked>
              <input type="radio" v-else>
            </span>
          </div>
          <div><span class="address">{{item.address}}</span></div>
          <div class="user-info">
            <span class="s-l">{{item.name}}</span>
            <span class="s-m">先生</span>
            <span class="s-r">{{item.phone}}</span>
          </div>
        </div>
        <i-icon type="editor"/>
      </div>
    </div>
    <div class="add-btn" @click="addAddress">
      <i-icon type="add" />
      <span>新增收货地址</span>
    </div>
  </div>
</template>

<script>
import globalStore from "../../stores/globalStore"
export default {
  data() {
    return {
    }
  },
  methods: {
    addAddress() {
      wx.navigateTo({url: '/pages/addAddress/main'})
    },
    changeDefault(index){
      // 前端修改默认地址
      let AL = globalStore.state.addressInfo
      AL.filter((e,idx)=>{
        idx===index ? e.address_flag = '1' : e.address_flag = '0'
      })
    }
  },
  computed: {
    //更新获取数据仓库的地址列表
    getAddressList () {
      return globalStore.state.addressInfo
    }
  }
}
</script>
<style lang="scss" scoped>
$spLine-color:#e4e4e4;
$textDarkGray-color:#404040;
$page-bgcolor:#f4f4f4;
$theme-color:#f9d173;
$mtRed-color:#e74c3c;
$textBlack-color:#333333;
$textDarkGray-color:#666666;
$textGray-color:gray;
$shopCartBackgroundColor:#e4e4e4;
.container {
  .list-c {
    width: 100%;
    margin-bottom: 88rpx;
    display: flex;
    flex-direction: column;
    .item {
      width: 100%;
      flex-flow: row nowrap;
      align-items: center;
      background-color: white;
      padding: 30rpx;
      border-top: 2rpx solid $spLine-color;
      .i-l {
        display: flex;
        flex-direction: column;
        .address {
          font-size: 32rpx;
          color: $textBlack-color;
        }
        .user-info {
          display: flex;
          margin-top: 10rpx;
          .s-l {
            font-size: 32rpx;
            color: $textDarkGray-color;
          }
          .s-m {
            font-size: 32rpx;
            color: $textDarkGray-color;
            margin-left: 20rpx;
          }
          .s-r {
            font-size: 32rpx;
            color: $textDarkGray-color;
            margin-left: 60rpx;
          }
        }
      }
      i{
        font-size: 32rpx;
        color: $textDarkGray-color;
      }
    }
  }
  .add-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 88rpx;
    background-color: rgb(245, 245, 245);
    border-top: 2rpx solid  $spLine-color;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    i {
      font-size: 36rpx;
      color: $theme-color;
    }
    span {
      font-size: 28rpx;
      color: $textBlack-color;
      margin-left: 10rpx;
    }
  }
}
</style>
