<template>
  <div class="container">
    <form report-submit @submit="payClick">
    <div class="header-c">
      <div class="tab-c">
        <div class="left" :style="{'background-color': tabIndex === 0 ? '#fff' : '#F8F8F8', 'font-weight': tabIndex === 0 ? 'bold' : ''}" @click="deliveryClick">外卖配送</div>
        <div class="right" :style="{'background-color': tabIndex === 1? '#fff' : '#F8F8F8', 'font-weight': tabIndex === 1 ? 'bold' : ''}" @click="pickClick">到店自取</div>
      </div>
      <div class="delivery" v-if="tabIndex === 0">
        <div class="address-c" @click="addressClick">
          <i-icon type="coordinates_fill" size="28" color="#80848f"/>
          <div class="address" v-if="haveAddress">
            <span class="address-info">{{addressInfo.address}} {{addressInfo.address_dec}}</span>
            <span class="user-info">{{addressInfo.name}} 先生  {{addressInfo.phone}}</span>
          </div>
          <div class="noAddress" v-else>
            你还没有添加地址
          </div>
          <i-icon type="enter" size="28" color="#80848f"/>
        </div>
        <div class="line-sp"></div>
        <div class="delivery-time">
          <i class="icon mt-clock-s"></i>
          <div class="content">
            <span class="c-l">{{arrivalInfo.date_type_tip}}</span>
            <span class="c-r">{{arrivalInfo.select_view_time}}</span>
          </div>
          <i class="icon mt-arrow-right-o" :style="{fontSize: 28 + 'rpx', color: '#999'}"></i>
        </div>
      </div>
      <div class="pick" v-if="tabIndex === 1">
        <span class="title">商家地址</span>
        <span class="address">{{shopData.shopAddress}}</span>
        <!-- <div class="map">
          <span class="distance">距您{{shopData.distance}}</span>
          <div class="line"></div>
          <span class="btn" @click="openMap">查看地图</span>
        </div> -->
        <div class="time">
          <div class="l">
            
            <span class="l-t">自取时间</span>
            <div class="l-b">
              <span><i-icon type="service" /> 22：49</span>
            </div>
          </div>
          <div class="line"></div>
          <div class="r">
            <span class="r-t">预留电话</span>
            <div class="r-b">
              <span><i-icon type="mobilephone" /> {{addressInfo.phone}}</span>
              
            </div>
          </div>
        </div>
        <div class="protocol">
          <i-icon type="right" color="#4EAA31"/>
          <span>同意</span>
          <text @click="protocol">《到店自取用户协议》</text>
        </div>
      </div>
    </div>
    <div class="item-list">
      <div class="section">
        <img :src="shopData.shopLogo">
        <span>{{shopData.shopName}}</span>
        <text class="tag">商家自配</text>
      </div>
      <div class="list">
        <div class="item" v-for="(item, index) in foodList" :key="index">
          <img :src="item.cuisine_pic">
          <div class="item-r">
            <div class="r-t">
              <span>{{item.goods_sku}}</span>
              <span>￥{{item.goods_price}}</span>
            </div>
            <span>x{{item.good_num}}</span>
          </div>
        </div>
      </div>
      <div class="footer">
        <!-- <div class="fold">
          <span>展开更多</span>
          <i class="icon mt-arrow-down-o"></i>
        </div> -->
        <div class="package-cast">
          <span>包装费</span>
          <span>￥{{foodList.length}}</span>
        </div>
        <div class="delivery-cast">
          <span>配送费</span>
          <span>￥{{shopData.deliverFee}}</span>
        </div>
        <sep-line></sep-line>
        <div class="discount">
          <div class="item" v-for="(item, index) in itemData.discounts" :key="index">
            <img :src="item.icon_url">
            <span class="name">{{item.name}}</span>
            <span class="info">{{item.info}}</span>
          </div>
        </div>
        <!-- <div class="red-packet" @click="redPacketClick">
          <span class="l">美团红包</span>
          <div class="r">
            <span>4张可用</span>
            <i class="icon mt-arrow-right-o"></i>
          </div>
        </div>
        <div class="coupon" @click="couponClick">
          <span class="l">商家代金券</span>
          <div class="r">
            <span>10张可用</span>
            <i class="icon mt-arrow-right-o"></i>
          </div>
        </div> -->
        <sep-line></sep-line>
        <div class="totle-price">
          <span class="l" v-if="reduceFee > 0">已优惠￥{{reduceFee}}</span>
          <span class="m">小计</span>
          <span class="r">￥{{realFee}}</span>
        </div>
      </div>
    </div>
    <!-- <div class="privacy-c">
      <div class="top">
        <div class="t-l">
          <i class="icon mt-lock-o" :style="{color: '#434343', 'font-size': 32 + 'rpx'}"></i>
          <span>是否隐私保护手机号?</span>
          <i class="icon mt-help-o" :style="{color: '#999', 'font-size': 24 + 'rpx'}"></i>
        </div>
        <switch @change="switch2Change"/>
      </div>
      <span>{{privacy_service.privacy_close_desc}}</span>
    </div> -->
    <div class="bottom-c">
      <div class="b-top">
        <span>支付方式</span>
        <span>在线支付</span>
      </div>
      <div class="b-mid">
        <span class="mid-l">备注</span>
        <div class="mid-r">
          <input class="remarking" type="text" v-model.lazy="remarking"/>
        </div>
      </div>
      <div class="b-btm">
        <span class="b-l">餐具数量</span>
        <div class="b-r">
          <i-icon type="praise" color="#4EAA31"/>
          <span class="s-l">一起为环保助力</span>
          <picker class="picker" mode="selector" :range="tablewareArr">
            <div>
              <span class="s-r">未选择</span>
            </div>
          </picker>
        </div>
      </div>
    </div>
    <button class="pay-btn" form-type="submit">
      <div class="top">
        <span class="s-l">微信支付</span>
        <span class="s-m">￥{{realFee}}</span>
        <span class="s-r">已优惠￥{{reduceFee}}</span>
      </div>
    </button>
    </form>
  </div>
</template>
<script>
import globalStore from "../../stores/globalStore";
import mpvuePicker from 'mpvue-picker';
export default {
  components:{mpvuePicker},
  data() {
    return {
      shopId:null,
      realFee:0, //实际支付
      reduceFee:0, //优惠价钱
      totalFee:0, //总价
      tabIndex: 0,
      shopData: {},
      itemData:{},
      addressInfo: {},
      arrivalInfo: {},
      foodList: [],
      privacy_service: {},
      remarking:'',
      tablewareArr: ['不需要餐具','1双','2双','3双'],
      haveAddress:false //判断是否有可选地址
    }
  },
  computed: {
    //设置默认地址
    defaultAddress:function(){
      const addressList = globalStore.state.addressInfo
      if(addressList.length!=0){
        this.haveAddress = true
        if(addressList.length==1){
          return this.addressInfo = globalStore.state.addressInfo[0]
        }else if(addressList.length>1){
          addressList.filter((e)=>{
            if(e.address_flag==='1'){
              return this.addressInfo = JSON.parse(JSON.stringify(e))  //防止触发双向数据修改
            }
          })
        }
      }
      return ''
    },
    //更新小计的总价格
    updateRealFee:function(){
      if(this.foodList.length!=0){
        let bagging = this.foodList.length*1 //包装费
        let freight = this.shopData.deliverFee*1 //配送费
        let foodList = this.foodList
        let price = 0
        foodList.filter(function(e){
          price += e.goods_all_price
        })
        this.totalFee = price
        return this.realFee = price + freight + bagging
      }else{
        return ''
      }
    }
  },
  methods: {
    addressClick() {
      wx.navigateTo({url: '/pages/addressList/main'})
    },
    remarkClick() {
      wx.navigateTo({url: '/pages/remark/main'})
    },
    deliveryClick() {
      this.tabIndex = 0;
    },
    pickClick() {
      this.tabIndex = 1;
    },
    payClick(e) {
      //发起支付
      wx.showLoading({title: '支付中'})
      let prepareInfo = {
        seller_id:this.shopData.shopId,
        address:this.addressInfo.address,
        name:this.addressInfo.name,
        order_price:this.realFee,
        goods_price:this.totalFee,
        phone:this.addressInfo.phone,
        detail:this.foodList
      }
      let _self = this
      _self.$http.post("/goods/order/putOrder",prepareInfo).then((res)=>{
        if(res.data.code == 200){
          let orderId = res.data.new_order_id.id  //保存订单ID
          wx.hideLoading()
          wx.showModal({
            title:'提示',
            content:'确认支付?',
            success:function(res) {
              //确认支付订单
              if(res.confirm) {
                _self.$http.post("/goods/order/payOrder",{
                  order_id:orderId,
                  access_token:globalStore.state.access_token,
                  form_id:e.target.formId
                  }).then((res)=>{
                  if(res.data.code==200){
                    globalStore.state.haveNewOrderStatus=true  //告诉全局有新订单状态
                    //清空购物车
                    globalStore.dispatch('computedPrice', {
                      shopId:_self.shopId,
                      goods:null,
                      handle: 'clearShopCart'
                    })
                    wx.redirectTo({url: '/pages/orderDetail/main?orderId='+orderId+'&shopName='+_self.shopData.shopName})
                  }
                })
              }else{
                console.log('取消等待支付')
                //清空购物车
                globalStore.dispatch('computedPrice', {
                  shopId:_self.shopId,
                  goods:null,
                  handle: 'clearShopCart'
                })
                globalStore.state.haveNewOrderStatus=true  //告诉全局有新订单状态
                wx.redirectTo({url: '/pages/orderDetail/main?orderId='+orderId+'&shopName='+_self.shopData.shopName})
              }
            }
          })
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    redPacketClick() {
      wx.navigateTo({url: '/pages/redPacket/main'})
    },
    couponClick() {
      wx.navigateTo({url: '/pages/couponList/main'})
    },
    protocol() {
      //用户协议
    }
  },
  mounted() {
    this.shopId = this.$root.$mp.query.shopId
    this.shopData = globalStore.state.shopCart[this.shopId]  //最好就再处理缩减数据量一下需要的值给子页面 现在先这样写
    this.foodList = globalStore.state.settlementInfo
  },
  onShow(){
    this.$forceUpdate() //强制刷新，解决页面不会重新渲染的问题
  }
}
</script>

<style lang="scss" scoped>
$textDarkGray-color:#404040;
$page-bgcolor:#f4f4f4;
$theme-color:#f9d173;
$mtRed-color:#e74c3c;
$textBlack-color:#333333;
$textDarkGray-color:#666666;
$textGray-color:gray;
$spLine-color:#e4e4e4;
$shopCartBackgroundColor:#e4e4e4;
.container {
  display: flex;
  flex-direction: column;
  background-color: #F9F9F9;
  .header-c {
    display: flex;
    flex-direction: column;
    margin: 20rpx;
    background-color: white;
    .tab-c {
      display: flex;
      height: 88rpx;
      align-items: center;
      background-color: white;
      .left {
        align-items: center;
        justify-content: center;
        display: flex;
        flex: 1;
        font-size: 32rpx;
        color: $textBlack-color;
        height: 88rpx;
      }
      .right {
        @extend .left;
        background-color: $page-bgcolor;
      }
    }
    .delivery {
      display: flex;
      background-color: white;
      flex-direction: column;
      .address-c {
        display: flex;
        background-color: white;
        padding: 20rpx 0;
        i {
          font-size: 36rpx;
          margin: 20rpx;
          color: #434343;
        }
        .address {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          flex: 1;
          span{
            margin: 2% 0;
          }
          .address-info {
            font-size: 32rpx;
            color: $textBlack-color;
          }
          .user-info {
            font-size: 24rpx;
            color: $textDarkGray-color;
          }
        }
        .noAddress{
          margin-left: 50%;
        }
      }
      .line-sp {
        height: 2rpx;
        background-color: $spLine-color;
        flex: 1;
        margin: 0 20rpx;
      }
      .delivery-time {
        display: flex;
        align-items: center;
        background-color: white;
        padding: 0 20rpx;
        i {
          font-size: 28rpx;
          color: $textBlack-color;
        }
        .content {
          display: flex;
          align-items: center;
          flex: 1;
          margin: 20rpx;
          .c-l {
            font-size: 32rpx;
            color: $textBlack-color;
          }
          .c-r {
            font-size: 24rpx;
            color: #5584E2;
            margin-left: 20rpx;
          }
        }
      }
    }
    .pick {
      display: flex;
      flex-direction: column;
      background-color: white;
      padding: 30rpx;
      .title {
        font-size: 28rpx;
        color: $textBlack-color;
      }
      .address {
        font-size: 36rpx;
        color: $textBlack-color;
        font-weight: bold;
        margin-top: 10rpx;
      }
      .map {
        display: flex;
        align-items: center;
        margin-top: 20rpx;
        .distance {
          font-size: 28rpx;
          color: #000;
        }
        .line {
          width: 2rpx;
          height: 20rpx;
          background-color: $textGray-color;
          margin: 0 16rpx;
        }
        .btn {
          font-size: 28rpx;
          color: #2F84E9;
        }
      }
      .time {
        display: flex;
        align-items: center;
        border-top: 2rpx solid $spLine-color;
        border-bottom: 2rpx solid $spLine-color;
        margin: 30rpx 0;
        height: 140rpx;
        .l {
          display: flex;
          flex-direction: column;
          flex: 1;
          .l-t {
            font-size: 24rpx;
            color: $textDarkGray-color;
          }
          .l-b {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-top: 10rpx;
            span {
              font-size: 24rpx;
              color: #000;
            }
            i {
              font-size: 28rpx;
              color: $textGray-color;
              margin-left: 10rpx;
            }
          }
        }
        .line {
          width: 2rpx;
          height: 100rpx;
          background-color: $spLine-color;
        }
        .r {
          display: flex;
          flex-direction: column;
          flex: 1;
          margin-left: 30rpx;
          .r-t {
            font-size: 24rpx;
            color: $textDarkGray-color;
          }
          .r-b {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-top: 10rpx;
            span {
              font-size: 24rpx;
              color: #000;
            }
            i {
              font-size: 28rpx;
              color: $textGray-color;
              margin-left: 10rpx;
            }
          }
        }
      }
      .protocol {
        display: flex;
        align-items: center;
        i {
          font-size: 36rpx;
          color: $theme-color;
        }
        span {
          font-size: 28rpx;
          color: $textBlack-color;
          margin-left: 30rpx;
        }
        text {
          font-size: 28rpx;
          color: #626381;
        }
      }
    }
  }
  .item-list {
    display: flex;
    flex-direction: column;
    margin: 0 20rpx;
    background-color: white;
    .section {
      display: flex;
      align-items: center;
      align-items: center;
      height: 88rpx;
      padding: 0 20rpx;
      img {
        width: 40rpx;
        height: 40rpx;
        border-radius: 20rpx;
      }
      span {
        font-size: 28rpx;
        color: $textDarkGray-color;
        flex: 1;
        margin-left: 20rpx;
      }
      text {
        color: $textBlack-color;
        font-size: 20rpx;
        padding: 3rpx 6rpx;
        border: 2rpx solid $textBlack-color;
      }
    }
    .list {
      display: flex;
      flex-direction: column;
      background-color: white;
      .item {
        display: flex;
        height: 120rpx;
        flex: 1;
        background-color: $page-bgcolor;
        margin-bottom: 10rpx;
        padding-top: 20rpx;
        img {
          width: 100rpx;
          height: 100rpx;
          margin-left: 20rpx;
        }
        .item-r {
          display: flex;
          flex: 1;
          flex-direction: column;
          margin: 0 20rpx;
          .r-t {
            display: flex;
            align-items: center;
            justify-content: space-between;
            span {
              font-size: 28rpx;
              color: $textBlack-color;
            }
          }
          span {
            font-size: 20rpx;
              color: $textDarkGray-color;
          }
        }
      }
    }
    .footer {
      display: flex;
      flex-direction: column;
      background-color: white;
      .fold {
        display: flex;
        align-self: center;
        align-items: center;
        justify-content: center;
        padding: 6rpx;
        margin-top: 30rpx;
        border: 2rpx solid $spLine-color;
        i {
          font-size: 24rpx;
          color: $textDarkGray-color;
        }
        span {
          font-size: 20rpx;
          color: $textDarkGray-color;
          margin-right: 6rpx;
        }
      }
      .package-cast {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 20rpx;
        span {
          font-size: 28rpx;
          color: $textBlack-color;
        }
      }
      .delivery-cast {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 20rpx;
        span {
          font-size: 28rpx;
          color: $textBlack-color;
        }
      }
      .discount {
        display: flex;
        margin: 20rpx;
        flex-direction: column;
        .item {
          display: flex;
          align-items: center;
          margin-top: 10rpx;
          img {
            width: 30rpx;
            height: 30rpx;
          }
          .name {
            font-size: 28rpx;
            color: $textDarkGray-color;
            flex: 1;
            margin-left: 10rpx;
          }
          .info {
            font-size: 28rpx;
            color: $mtRed-color;
          }
        }
      }
      .red-packet {
        display: flex;
        align-content: center;
        margin: 20rpx;
        justify-content: space-between;
        .l {
          font-size: 28rpx;
          color: $textBlack-color;
        }
        .r {
          display: flex;
          align-items: center;
          span {
            font-size: 24rpx;
            color: $mtRed-color;
          }
          i {
            font-size: 28rpx;
            margin-left: 10rpx;
            color: $textGray-color;
          }
        }
      }
      .coupon {
        display: flex;
        align-content: center;
        margin: 20rpx;
        justify-content: space-between;
        .l {
          font-size: 28rpx;
          color: $textBlack-color;
        }
        .r {
          display: flex;
          align-items: center;
          span {
            font-size: 24rpx;
            color: $mtRed-color;
          }
          i {
            font-size: 28rpx;
            margin-left: 10rpx;
            color: $textGray-color;
          }
        }
      }
      .totle-price {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin: 20rpx;
        .l {
          font-size: 24rpx;
          color: $textDarkGray-color;
        }
        .m {
          font-size: 28rpx;
          color: $textBlack-color;
          margin: 0 20rpx;
        }
        .r {
          font-size: 28rpx;
          color: $mtRed-color;
        }
      }
    }
  }
  .privacy-c {
    display: flex;
    flex-direction: column;
    height: 160rpx;
    background-color: white;
    margin: 20rpx;
    justify-content: center;
    .top {
      display: flex;
      align-items: center;
      margin: 0 20rpx;
      .t-l {
        display: flex;
        align-items: center;
        flex: 1;
        span {
          font-size: 28rpx;
          color: $textBlack-color;
          margin: 0 10rpx;
        }
      }
    }
    span {
      font-size: 20rpx;
      color: $textDarkGray-color;
      margin: 0 20rpx;
    }
  }
  .bottom-c {
    display: flex;
    background-color: white;
    margin: 20rpx;
    margin-top: 0;
    justify-content: center;
    flex-direction: column;
    margin-bottom: 186rpx;
    .b-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 88rpx;
      margin: 0 20rpx;
      border-bottom: 2rpx solid $spLine-color;
      span {
        font-size: 28rpx;
        color: $textBlack-color;
      }
    }
    .b-mid {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 88rpx;
      margin: 0 20rpx;
      border-bottom: 2rpx solid $spLine-color;
      .mid-l {
        font-size: 28rpx;
        color: $textBlack-color;
      }
      .mid-r {
        display: flex;
        align-items: center;
        span {
          font-size: 28rpx;
          color: $textDarkGray-color;
        }
        i {
          font-size: 28rpx;
          color: $textGray-color;
          margin-left: 10rpx;
        }
      }
    }
    .b-btm {
      display: flex;
      background-color: white;
      margin: 20rpx;
      align-items: center;
      .b-l {
        font-size: 28rpx;
        color: $textBlack-color;
        flex: 1;
      }
      .b-r {
        display: flex;
        align-items: center;
        margin: 0 20rpx;
        margin-right: 0;
        .s-l {
          font-size: 24rpx;
          color: #00CB91;
          margin: 0 10rpx;
        }
        .picker {
          div {
            display: flex;
            align-items: center;
            .s-r {
              font-size: 28rpx;
              color: $textDarkGray-color;
              margin-right: 10rpx;
              flex: 1;
            }
          }
        }
      }
    }
  }
  .pay-btn {
    display: flex;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 126rpx;
    background-color: #4EAA31;
    justify-content: center;
    z-index: 9999;
    .top {
      display: flex;
      height: 50rpx;
      align-items: center;
      margin-top: 30rpx;
      .s-l {
        font-size: 32rpx;
        color: white;
      }
      .s-m {
        font-size: 36rpx;
        color: white;
        font-weight: bold;
        margin: 0 20rpx;
      }
      .s-r {
        font-size: 24rpx;
        color: white;
      }
    }
  }
}
</style>
