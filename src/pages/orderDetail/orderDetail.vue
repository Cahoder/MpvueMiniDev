<template>
  <div class="container">
    <form class="form" report-submit @submit="handleClick">
    <div class="orderDetail">
      <div class="title">订单明细</div>
      <div class="title" v-if="order_detail.get_detail">{{shopName}}</div>
      <div class="Item" v-for="(item, index) in order_detail.get_detail" :key="index">
        <span>{{item.goods_sku}}</span><span class="n"><span class="b">×{{item.good_num}}</span>￥{{item.goods_all_price}}</span>
      </div>
      <div class="Item" v-if="order_detail.get_detail">
        <span>配送费</span><span class="emphasize">￥{{order_detail.freight}}</span>
      </div>
      <div class="Item" v-if="order_detail.get_detail">
        <span>包装费</span><span class="emphasize">￥{{order_detail.get_detail.length}}</span>
      </div>
      <div class="Item" v-if="order_detail.get_detail">
        <span>原价{{order_detail.goods_price}}</span><span class="emphasize">{{order_detail.order_state>=1?'实':'应'}}付￥{{order_detail.order_price}}</span>
      </div>
    </div>
    <div class="orderInfo" v-if="order_detail.get_detail">
      <div class="list">
        <div class="title info"><span>订单信息</span></div>
        <div><span>订单编号:</span><span>{{order_detail.order_num}}</span></div>
        <div><span>订单时间:</span><span>{{order_detail.created_at}}</span></div>
        <div><span>支付方式:</span> <span>在线支付</span></div>
        <div><span>配送方式:</span> <span>外卖配送</span></div>
        <div><span>配送时间:</span> <span>即时配送</span></div>
        <div><span>配送地址:</span><span> {{order_detail.name}} {{order_detail.phone}} {{order_detail.address}}</span></div>
        <div><span>联系商家:</span><span></span></div>
      </div>
    </div>
    
    <div class="btnList" v-if="order_detail.get_detail">
      <button class="btn" @click="toIndexPage">回到首页</button>
      <button class="btn" form-type="submit">{{order_detail.order_state>=1?'再来一单':'继续支付'}}</button>
    </div>
    </form>
  </div>
</template>

<script>
import globalStore from "../../stores/globalStore"
export default {
  data() {
    return {
      order_id:null,
      shopName:null,
      order_detail:{} //订单详情
    }
  },
  methods: {
    launchView(){
      //渲染数据
      this.order_id=null
      this.shopName=null
      this.order_detail={}
      this.order_id = this.$root.$mp.query.orderId
      this.shopName = this.$root.$mp.query.shopName
      this.$http.post("/goods/myOrderList/detail",{order_id:this.order_id}).then((res)=>{
        if(res.status === 200){
          this.order_detail = res.data  //获取订单详情
        }
      })
    },
    handleClick(e) {
      var _self = this
      if(this.order_detail.order_state == 0){
        wx.showModal({
          title:'提示',
          content:'确认支付?',
          success:function(res) {
            //确认支付订单
            if(res.confirm) {
              _self.$http.post("/goods/order/payOrder",{
                order_id:_self.order_id,
                access_token:globalStore.state.access_token,
                form_id:e.target.formId
                }).then((res)=>{
                if(res.data.code==200){
                  globalStore.state.haveNewOrderStatus=true  //告诉全局有新订单状态
                  wx.showToast({
                    title: '支付成功',
                    icon: 'success',
                    duration: 1000
                  })
                  _self.launchView()
                }
              })
            }else{
              console.log('取消支付')
            }
          }
        })
      }else{
        //再来一单状态
        wx.redirectTo({
          url: '/pages/shopDetail/main?shopId='+_self.order_detail.seller_id
        })
      }
    },
    toIndexPage(){
      wx.reLaunch({
        url: '/pages/index/main'
      })
    }
  },
  mounted() {
    this.launchView()
  }
}
</script>

<style lang="scss" scoped>
$titleColor:#80848f;
$listItemBackgroundColor:#ffffff;
$listItemHeight:80rpx;
$btnListBackground:#f8f8f9;
.container{
  width: 100%;
  font-size: 30rpx;
  font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  .form{
    width: 100%;
  }
  .title{
    color: $titleColor;
    font-size: 25rpx;
  }
  .emphasize{
    color: #ed3f14
  }
  div{
    width: 100%;
  }
  .orderDetail{
    width: 96%;
    display: -webkit-flex;
    display: flex;
    flex-flow: column wrap;
    justify-content: center;
    align-items: flex-start;
    align-content: flex-start;
    div{
      line-height: $listItemHeight;
      height: $listItemHeight;
      margin-left: 2%;
      background-color: $listItemBackgroundColor;
      border-bottom: 1rpx solid #e9eaec;
    }
    .Item{
      display: -webkit-inline-flex;
      display: inline-flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      .n{
        width: 200rpx;
        display: inline-flex;
        flex-flow: row wrap;
        justify-content: space-between;
        .b{
          color: $titleColor;
        }
      }
    }
  }
  .orderInfo{
    margin-bottom: 20%;
    .list{
       @extend .orderDetail;
       width: 100%;
       .info{
         margin: 0;
         background-color: #f0eff6;
         span{
           margin-left: 2%
         }
      }
    }
  }
  .btnList{
    position: fixed;
    bottom: 0;
    height: 8%;
    z-index: 9999;
    background-color: $btnListBackground;
    text-align: center;
    .btn{
      width: 50%;
      height: 100%;
      float: left;
    }
  }
}
</style>
