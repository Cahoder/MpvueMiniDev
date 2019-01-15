<template>
  <div class="container">
    <div class="orderAssort">
        <i-tabs i-class="" :current="currentAssort" color="#FFD26B" @change="assortChange" fixed>
          <block v-for="(item, index) in orderType" :index="index" :key="index">
            <i-tab :key="item.keyName" :title="item.typeName"></i-tab>
          </block>
        </i-tabs>
     </div>
     <div class="order">
       <div class="emptyDivUI" :style="EmptyCarUI"></div>
       <div class="ItemList">
        <i-spin size="large" fix v-if="spinShow"></i-spin>
          <block v-if=" currentAssort === 'AllOrders' ">
            <block v-for="(item, index) in computedAllOrderList" :index="index" :key="index">
              <i-card :title="item.order_state == 0 ? '未支付':'待发货'" :extra="item.seller.seller_name" :thumb="item.seller.seller_logo" full>
                <div slot="content">
                  <p v-for="(productList, _index) in item.product_list" :index="_index" :key="_index">{{productList.product_name}}×{{productList.product_count}}</p>
                </div>
                <div slot="footer">
                  <i-button class="orderMore" @click="navShopDetail(item)" type="success" shape="circle" size="small" inline>再来一单</i-button>
                  <i-button class="orderMore" @click="showOrderDetail(item)" type="ghost" shape="circle" size="small" inline>订单详情</i-button>
                </div>
              </i-card>
            </block>
          </block>
          <block v-else >
            <block v-for="(item, index) in computedSortOrderList" :index="index" :key="index">
              <i-card :title="item.order_state == 0 ? '未支付':'待发货'" :extra="item.seller.seller_name" :thumb="item.seller.seller_logo" full>
                <div slot="content">
                  <p v-for="(productList, _index) in item.product_list" :index="_index" :key="_index">{{productList.product_name}}×{{productList.product_count}}</p>
                </div>
                <div slot="footer">
                  <i-button class="orderMore" @click="navShopDetail(item)" type="success" shape="circle" size="small" inline>再来一单</i-button>
                  <i-button class="orderMore" @click="showOrderDetail(item)" type="ghost" shape="circle" size="small" inline>订单详情</i-button>
                </div>
              </i-card>
            </block>
          </block>
       </div>
     </div>
  </div>
</template>
<script>
import { arrayComprise , sortPayTime} from '../../utils/index'  //引入数组对比和数组对象排序
import globalStore from "../../stores/globalStore"
  export default {
    data () {
      return {
        spinShow: false,
        haveOrder:false, //判断该分组内是否有订单
        currentAssort:'AllOrders', //默认当前的分类
        correspondOrderList:[], //符合当前点击分类对应的订单
        sortedOrderList:null, //对所有的订单进行分类后
        AllOrderList:[],  //承载订单原数据
        orderType:[        //默认的订单分类
          {
            typeName:"全部订单",
            key:-1,
            keyName:"AllOrders",
            orderList:[]
          },
          {
            typeName:"待付款",
            keyName:"PendingPay",
            key:0,
            orderList:[]
          },
          {
            typeName:"待发货",
            keyName:"PendingShip",
            key:1,
            orderList:[]
          },
          {
            typeName:"待收货",
            keyName:"Pendingreceive",
            key:2,
            orderList:[]
          },
          {
            typeName:"待评价",
            keyName:"PendingEvaluate",
            key:3,
            orderList:[]
          }
        ]
      }
    },
    methods: {
      assortChange(e){
        //分类切换
        if(this.currentAssort!=e.mp.detail.key){
          this.spinShow = true //显示UI加载效果
        }
        this.currentAssort = e.mp.detail.key
        if(this.sortedOrderList != null){
          const OL = this.sortedOrderList
          OL.forEach(element => {
            if(element.keyName == e.mp.detail.key){
              this.correspondOrderList = element.orderList
              return
            }
          })
        }
      },
      hideSpinShow(){
        // 隐藏UI加载
        setTimeout(res=>{
          this.spinShow = false
        },1000)
      },
      navShopDetail(item){
        globalStore.state.sessionShopInfo[item.seller_id] ? '' : globalStore.state.sessionShopInfo[item.seller_id] = item.seller
        wx.navigateTo({
          url: '../shopDetail/main?shopId='+item.seller_id
        })
      },
      showOrderDetail(item){
        globalStore.state.sessionShopInfo[item.seller_id] ? '' : globalStore.state.sessionShopInfo[item.seller_id] = item.seller
        wx.navigateTo({url: '/pages/orderDetail/main?orderId='+item.id+'&shopName='+item.seller.seller_name})
      }
    },
    computed:{
      //等待sessionkey回调回来之后请求订单
      getOrderList:function(){
        if(globalStore.state.sessionKey!=null||globalStore.state.haveNewOrderStatus===true){
          this.spinShow = true //显示UI加载效果
          this.$http.post("/goods/myOrderList").then((res)=>{
            this.AllOrderList = JSON.parse(JSON.stringify(res.data))
            this.sortedOrderList = JSON.parse(JSON.stringify(arrayComprise(this.orderType,this.AllOrderList,'orderList','id')))  //分类不会刷新...............
            this.hideSpinShow()
          }).catch(err=>{
            console.log(err)
          })
        }else{
          console.log('sessionKey为空')
        }
        if(globalStore.state.haveNewOrderStatus){  //强迫数据重新渲染
          globalStore.state.haveNewOrderStatus = false
        }
        return ''
      },
      EmptyCarUI(){
        //展示空购物车UI
        if(this.haveOrder){
          return 'display: none;'
        }else{
          return 'display: block;'
        }
      },
      //计算所有订单列表
      computedAllOrderList:function(){
        if(this.AllOrderList && this.AllOrderList.length != 0 ){
          this.haveOrder = true
          return this.AllOrderList.sort(sortPayTime('id'))
        }else{
          return null
        }
      },
      //触发刷新符合的分类订单列表
      computedSortOrderList:function(){
        this.hideSpinShow()
        return this.correspondOrderList;
      }
    },
    onShow(){
      //只能用小程序的生命周期触发每次都要执行的功能
    }
  }
</script>
<style lang="scss" scoped>
$emptyShopCarUI:url("../../../static/images/emptyShopCar.png");

.container{
  width: 100%;
  height:100%;
  .orderAssort{
    width: 100%;
    height:100%;
  }
  .order{
    width: 100%;
    height:100%;
    margin-top: 10%;
    .emptyDivUI{
      width: 100%;
      height: 200px;
      background-image: $emptyShopCarUI;
      background-position: center;
      background-repeat: no-repeat;
      opacity: 0.2;
    }
    .ItemList{
      position: relative;
      width: 100%;
      .orderMore{
        float: right;
      }
    }
  }
}
</style>