<template>
  <div class="container">
    <div class="header">
      <div class="userinfo">
        <button v-if="!hasUserInfo && canIUse" open-type="getUserInfo" @getuserinfo="bindGetUserInfo" @click="">授权注册</button>
          <block v-else>
            <image class="userinfo-avatar" :src="userInfo.avatarUrl" mode="cover"></image>
            <text class="userinfo-nickname">{{userInfo.nickName}}</text>
          </block>
      </div>
    </div>
    <div class="list">
      <i-cell-group>
        <block v-for="(item, index) in itemList" :key="index" :data-index="index">
          <i-cell v-if="item.amount" class="listItem" :title="item.title" is-link :url="item.path" :label="item.amount + '张'" link-type="navigateTo"><i-icon slot="icon" :type="item.icon" size="22" color="#80848f"/></i-cell>
          <i-cell v-else class="listItem" :title="item.title" is-link :url="item.path"  link-type="navigateTo"><i-icon slot="icon" :type="item.icon" size="22" color="#80848f"/></i-cell>
        </block>
      </i-cell-group>
    </div>
    <i-button class="logout" @click="logoutClick" long="true">退出账号</i-button>
  </div>
</template>

<script>
import globalStore from "../../stores/globalStore";
export default {
  data() {
    return {
      userInfo:{},
      hasUserInfo: false,
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
      itemList: [
        {
          title: '我的红包',
          icon: 'redpacket',
          path: '/pages/redPacket/main',
          amount: 4
        }, 
        {
          title: '商家代金券',
          icon: 'coupons',
          path: '/pages/couponList/main',
          amount: 10
        },
        {
          title: '我的地址',
          icon: 'coordinates',
          path: '/pages/addressList/main'
        },
        {
          title: '邀请有奖',
          icon: 'share'
        },
        {
          title: '客服中心',
          icon: 'customerservice'
        },
        {
          title: '帮助和反馈',
          icon: 'feedback',
          path: '/pages/feedback/main'
        },
        {
          title: '协议和说明',
          icon: 'more',
          path: '/pages/protocol/main'
        }]
    }
  },
  computed: {

  },
  methods: {
    // 获取用户信息
    bindGetUserInfo(e) {
      if (e.mp.detail.rawData){
          this.globalData.userInfo = e.mp.detail.userInfo
          this.userInfo = e.mp.detail.userInfo
          this.hasUserInfo = true
          this.getSetting()
          console.log('success authSetting')
      } else {
          console.log('refuse authSetting')
      }
    },
    itemClick(e) {
      wx.navigateTo({url: e.path})
    },
    logoutClick() {
      wx.showModal({
        title: '确认退出？',
        content: '退出登录后将无法查看订单，重新登录即可查看',
        confirmColor: '#FFC24A',
        success: function(res) {
          if (res.confirm) {
            
          } else if (res.cancel) {
            
          }
        }
      })
    },
    // 获取用户的地址信息
    getAddressInfo(){
      if(globalStore.state.sessionKey!=null){
        this.$http.post("/users/addresses").then((InfoRes)=>{
          globalStore.state.addressInfo = [...InfoRes.data]
        })
      }else{
        let _self = this
        setTimeout(function(){
          // console.log('没有sessionkey情况')
          _self.getSetting()
        },1000)
      }
    },
    getSetting(){
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            //已经授权，可以直接调用 getUserInfo
            wx.getUserInfo({
              success: res => {
                wx.login({
                  success:res_code=>{
                    this.$http.post("/users/grant",{
                      code:res_code.code,
                      iv:res.iv,
                      encryptedData:res.encryptedData
                      }).then((grantRes)=>{
                        globalStore.commit('sessionKeyBind',{
                          sessionKey:grantRes.data.sessionKey,
                          access_token:grantRes.data.accessToken
                        })
                        this.globalData.userInfo = res.userInfo
                        this.userInfo = res.userInfo
                        this.hasUserInfo = true
                        this.getAddressInfo()
                      })
                  }
                })
                //由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                //所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                  console.log("userInfoReadyCallback Success")
                }
              }
            })
          }
        }
      })
    }
  },
  created(){
    // 检验是否授权
    this.getSetting()
  },
}
</script>

<style lang="scss" scoped>
$headerBackgroundColor:#FFD26B;
.container{
  height: 100%;
  width: 100%;
  .header{
    background-color: $headerBackgroundColor;
    height: 250rpx;
    width: 100%;
    display: -webkit-inline-flex;
    display: inline-flex;
    .userinfo {
      display: flex;
      flex-direction: row;
      align-items: center;
      .userinfo-avatar {
        width: 128rpx;
        height: 128rpx;
        margin: 20rpx;
        border-radius: 50%;
      }
      .userinfo-nickname {
        font-weight: bold;
        color: #1c2438;
      }
    }
  }
  .list{
    width: 100%;
  }
  .logout{
    width: 100%;
  }
}
</style>
