<template>
  <!--This is shopDetail page component!!!-->
  <div class="shopDetail">
    <div class="shopTop">
      <div class="shopPoster"><img :src="shopData.seller_logo"></div>
      <div class="shopDesc">
        <div class="dispatching"><span class="timeIcon" style="margin-right:5rpx;"><i-icon type="time" size="20" color="#80848f"/></span>配送约{{shopData.deliver_time}} ({{shopData.seller_status == '1' ? '营业中':'休息中'}})</div>
        <div class="notice"><span style="margin-right:5rpx;">公告:</span>{{shopData.seller_des}}</div>
        <div class="coupon">
          <i-tag 
              v-for="(tag, tagIndex) in couponShopTag" 
              :key="tagIndex" 
              checkable="false" 
              :name="tag" 
              color="red" 
              type="dot"
              style="margin-right:5rpx;">
              {{tag}}
          </i-tag>
          <i-icon type="enter" size="20" color="#80848f" />
        </div>
      </div>
    </div>
    <div class="shopOption">
      <i-tabs :current="optionAssort" color="#FFD26B" @change="assortChange">
        <i-tab key="menu" title="菜单"></i-tab>
        <i-tab key="assess" title="评价"></i-tab>
        <i-tab key="seller" title="商家"></i-tab>
      </i-tabs>
    </div>
    <div class="shopMenu" v-if="optionAssort === nowOption.menu">
      <scroll-view class="list-l"  scroll-y="true">
        <block v-if="tagIndex === -1">
          <div class="l-item active">
            <i-badge :count="shopCart.totalMount"><span>全部</span></i-badge>
          </div>
        </block>
        <block v-else>
          <div class="l-item" :class="{ active:item.seller_type_id === tagIndex}" v-for="(item, index) in shopData.type" :key="index" @click="categoryClick(item.seller_type_id)">
            <i-badge :count="shopCart.cusineType[item.seller_type_id]"><span>{{item.seller_type_name}}</span></i-badge>
          </div>
        </block>
      </scroll-view>
      <scroll-view class="list-r" scroll-y="true">
        <i-sticky scrollTop = '0' >
          <i-sticky-item>
              <div class="title" slot="title">
                  <span>{{tagIndex == -1 ? '全部': typeNameFilter}}</span>
              </div>
              <div class="content" slot="content">
                  <block v-for="(item, index) in CuisineFilterComplete" :key="index">
                    <div class="cuisineItem">
                      <div class="cuisinePic" @click="previewCusine(item)">
                        <img :src="item.cuisine_pic">
                      </div>
                      <div class="cuisineDesc">
                        <div class="cuisineTitle">
                          {{item.cuisine_name}}<span v-if="item.cuisine_state != '1'">(已下架)</span>
                        </div>
                        <div class="cuisineDetail">
                          {{item.cuisine_dec}}
                        </div>
                        <div class="monthSaleAndStock">
                          <span class="monthSale">月销{{item.cuisine_month_sales}}</span>
                          <span class="Stock">库存{{item.cuisine_stock}}</span>
                        </div>
                        <div class="priceAndBtton">
                          <span class="price">￥{{item.cuisine_price}}</span>
                          <span class="btn" v-if="item.has_sku == 0">
                            <span v-for="(good, _index) in shopCart.cartGoods" :key="_index" v-if="good.id == item.id">
                              <button class="addSubcart subCart" type="default" @click="addSubCart(item,'sub')" hover-class="none">-</button>
                              <button class="addSubcart cartNum" disabled >{{good.mounts}}</button>
                            </span>
                            <button class="addSubcart" type="default" @click="addSubCart(item,'add')" hover-class="none">+</button>
                          </span>
                          <span class="btn" v-else-if="item.has_sku == 1">
                            <button
                            class="sku"
                            type="default"
                            @click="skuChoose(item)"
                            hover-class="none">
                            选规格
                            </button>
                          </span>
                        </div>
                      </div>
                    </div>
                  </block>
              </div>
          </i-sticky-item>
        </i-sticky>
      </scroll-view>
      <div class="shopCart" >
        <div class="left" @click="showShopCart">
          <div class="cartLogo">
            <img src="https://i.loli.net/2017/08/21/599a521472424.jpg">
          </div>
          <div class="cartDesc">
            <div v-if="shopCart.totalPrice!=0" class="totalPrice">￥{{shopCart.totalPrice}}</div>
            <div class="Desc"><span>{{shopData.seller_freight === "0" ? '免配送费' : '另需配送费￥'+shopData.seller_freight}}</span>|<span>支持自提</span></div>
          </div>
        </div>
        <div class="right">
          <span v-if="shopCart.totalPrice < shopData.seller_lowest_price">{{shopCart.totalPrice!=0 ? '还差'+(shopData.seller_lowest_price-shopCart.totalPrice )+'元' :shopData.seller_lowest_price +'元起送'}}</span>
          <span v-else-if="shopCart.totalPrice >= shopData.seller_lowest_price" class="Settlement" @click="Settlement">去结算</span>
        </div>
      </div>
      <!-- 查看购物车列表 -->
      <div class="shopCartList" v-if="showShopList">
        <div class="plane">
          <div class="title" @click="addSubCart(null,'clearShopCart')">
          <span>购物车</span><span><i-icon type="trash"/>清空购物车</span>
          </div>
          <div class="list">
            <block v-for="(good, goodIndex) in shopCart.cartGoods" :key="goodIndex">
              <div class="item">
                <div class="itemName">{{good.nowSelected != undefined ? good.all_scale[good.nowSelected].sku_name : good.cuisine_name}}</div>
                <div class="itemPrice">￥{{ good.nowSelected != undefined ? (good.all_scale[good.nowSelected].sku_price*1)*good.mounts : good.cuisine_price*good.mounts}}</div>
                <div class="addSubBtn">
                  <span class="btn">
                    <button class="addSubcart subCart" type="default" @click="addSubCart(good,'sub')" hover-class="none">-</button>
                    <button class="addSubcart cartNum" disabled >{{good.mounts}}</button>
                    <button class="addSubcart" type="default" @click="addSubCart(good,'add')" hover-class="none">+</button>
                  </span>
                </div>
              </div>
            </block>
          </div>
        </div>
      </div>
    </div>
    <div class="shopEvaluate" v-else-if="optionAssort == nowOption.assess">
      评价
    </div>
    <div class="shopSeller" v-else-if="optionAssort == nowOption.seller">
      商家
    </div>
    <!-- 规格页面 -->
    <div class="sku-modal" v-if="visibleSkuModal">
      <div class="modal-c">
        <div class="header">
          <span class="title">{{previewInfo.cuisine_name}}</span>
          <div class="attrs">
            <span class="name">规格：</span>
            <div class="sku">
              <div class="item" :class="{selected: idx === previewInfo.nowSelected}" v-for="(itm, idx) in previewInfo.all_scale" :key="idx" @click="attrClick(idx)">
                <span>{{itm.sku_name}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="footer">
          <div class="f-l">
            <span class="price">￥{{previewInfo.all_scale[previewInfo.nowSelected] ? previewInfo.all_scale[previewInfo.nowSelected].sku_price :''}}</span>
            <span class="sku" v-if="previewInfo.all_scale[previewInfo.nowSelected]">({{previewInfo.all_scale[previewInfo.nowSelected].sku_name}})</span>
          </div>
          <div class="f-r">
            <!-- <div class="shopping-c" :style="showSukShopCartBtn" @click="skuBtnAdd(previewInfo,'add')">
              <i-icon type="publishgoods_fill"/>
              <span>加入购物车</span>
            </div> -->
            <div class="add" v-if="previewInfo.all_scale[previewInfo.nowSelected]">
              <span class="btn" v-if="previewInfo.has_sku == '1'">
                <span v-for="(good, goodIndex) in shopCart.cartGoods" :key="goodIndex" v-if="previewInfo.nowSelected === good.nowSelected">
                  <button class="addSubcart subCart" type="default" @click="addSubCart(previewInfo,'sub')" hover-class="none">-</button>
                  <button class="addSubcart cartNum" disabled >{{good.mounts}}</button>
                </span>
                <button class="addSubcart" type="default" @click="addSubCart(previewInfo,'add')" hover-class="none">+</button>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="cancle" @click="closeSku">
        <i-icon type="close" size="28" color="#80848f"/>
      </div>
    </div>
    <!-- 预览页面 -->
    <div class="previewModal" v-if="visibleItemModal">
      <div class="modal-c">
        <div class="header-p">
          <img class="item-img" :src="previewInfo.cuisine_pic">
          <span class="title">{{previewInfo.cuisine_name}}</span>
          <div class="saled">
            <span class="l">月售{{previewInfo.cuisine_month_sales}}</span>
            <span class="r">赞{{previewInfo.del_flag}}</span>
          </div>
          <span class="desc">描述：{{previewInfo.cuisine_dec}}</span>
        </div>
        <div class="footer-p">
          <span class="l">￥{{previewInfo.cuisine_price}}</span>
          <div class="r">
            <div class="add-c" v-if="previewInfo.has_sku == '0'">
              <span class="btn">
                <span v-for="(good, _index) in shopCart.cartGoods" :key="_index" v-if="good.id == previewInfo.id">
                  <button class="addSubcart subCart" type="default" @click="addSubCart(previewInfo,'sub')" hover-class="none">-</button>
                  <button class="addSubcart cartNum" disabled >{{good.mounts}}</button>
                </span>
                <button class="addSubcart" type="default" @click="addSubCart(previewInfo,'add')" hover-class="none">+</button>
              </span>
            </div>
            <div class="attr" v-if="previewInfo.has_sku == '1' " @click="skuChoose(previewInfo)">
              <span>选规格</span>
            </div>
          </div>
        </div>
      </div>
      <div class="cancle" @click="closePreview">
        <i-icon type="close" size="28" color="#80848f" />
      </div>
    </div>
  </div>
</template>
<script>
import globalStore from "../stores/globalStore"
export default {
  props: {
    shopId:{
      type:Number,
      require:true
    }
  },
  data () {
    return {
      showShopList:false,
      visibleSkuModal:false,
      visibleItemModal:false,
      previewInfo:{},
      tagIndex:-1,
      active:"active",
      CuisineFilterComplete:null,
      shopData:{
        type:[
          {
            created_at:"2018-12-27 10:53:43",
            id:64,
            seller_id:25,
            seller_type_id:1,
            seller_type_name:"A",
            updated_at:"2018-12-27 10:53:43"
          },
          {
            created_at:"2018-12-27 10:53:43",
            id:64,
            seller_id:25,
            seller_type_id:2,
            seller_type_name:"B",
            updated_at:"2018-12-27 10:53:43"
          },
          {
            created_at:"2018-12-27 10:53:43",
            id:64,
            seller_id:25,
            seller_type_id:3,
            seller_type_name:"C",
            updated_at:"2018-12-27 10:53:43"
          },
          {
            created_at:"2018-12-27 10:53:43",
            id:64,
            seller_id:25,
            seller_type_id:4,
            seller_type_name:"D",
            updated_at:"2018-12-27 10:53:43"
          },
          {
            created_at:"2018-12-27 10:53:43",
            id:64,
            seller_id:25,
            seller_type_id:5,
            seller_type_name:"A",
            updated_at:"2018-12-27 10:53:43"
          },
          {
            created_at:"2018-12-27 10:53:43",
            id:64,
            seller_id:25,
            seller_type_id:6,
            seller_type_name:"B",
            updated_at:"2018-12-27 10:53:43"
          },
          {
            created_at:"2018-12-27 10:53:43",
            id:64,
            seller_id:25,
            seller_type_id:7,
            seller_type_name:"C",
            updated_at:"2018-12-27 10:53:43"
          },
          {
            created_at:"2018-12-27 10:53:43",
            id:64,
            seller_id:25,
            seller_type_id:8,
            seller_type_name:"D",
            updated_at:"2018-12-27 10:53:43"
          },
          {
            created_at:"2018-12-27 10:53:43",
            id:64,
            seller_id:25,
            seller_type_id:9,
            seller_type_name:"A",
            updated_at:"2018-12-27 10:53:43"
          },
          {
            created_at:"2018-12-27 10:53:43",
            id:64,
            seller_id:25,
            seller_type_id:10,
            seller_type_name:"B",
            updated_at:"2018-12-27 10:53:43"
          },
          {
            created_at:"2018-12-27 10:53:43",
            id:64,
            seller_id:25,
            seller_type_id:11,
            seller_type_name:"C",
            updated_at:"2018-12-27 10:53:43"
          },
          {
            created_at:"2018-12-27 10:53:43",
            id:64,
            seller_id:25,
            seller_type_id:12,
            seller_type_name:"D",
            updated_at:"2018-12-27 10:53:43"
          },
          {
            created_at:"2018-12-27 10:53:43",
            id:64,
            seller_id:25,
            seller_type_id:13,
            seller_type_name:"A",
            updated_at:"2018-12-27 10:53:43"
          },
          {
            created_at:"2018-12-27 10:53:43",
            id:64,
            seller_id:25,
            seller_type_id:14,
            seller_type_name:"B",
            updated_at:"2018-12-27 10:53:43"
          },
          {
            created_at:"2018-12-27 10:53:43",
            id:64,
            seller_id:25,
            seller_type_id:15,
            seller_type_name:"C",
            updated_at:"2018-12-27 10:53:43"
          },
          {
            created_at:"2018-12-27 10:53:43",
            id:64,
            seller_id:25,
            seller_type_id:16,
            seller_type_name:"D",
            updated_at:"2018-12-27 10:53:43"
          },
          {
            created_at:"2018-12-27 10:53:43",
            id:64,
            seller_id:25,
            seller_type_id:17,
            seller_type_name:"A",
            updated_at:"2018-12-27 10:53:43"
          },
          {
            created_at:"2018-12-27 10:53:43",
            id:64,
            seller_id:25,
            seller_type_id:18,
            seller_type_name:"B",
            updated_at:"2018-12-27 10:53:43"
          },
          {
            created_at:"2018-12-27 10:53:43",
            id:64,
            seller_id:25,
            seller_type_id:19,
            seller_type_name:"C",
            updated_at:"2018-12-27 10:53:43"
          },
          {
            created_at:"2018-12-27 10:53:43",
            id:64,
            seller_id:25,
            seller_type_id:20,
            seller_type_name:"D",
            updated_at:"2018-12-27 10:53:43"
          },
          {
            created_at:"2018-12-27 10:53:43",
            id:64,
            seller_id:25,
            seller_type_id:21,
            seller_type_name:"A",
            updated_at:"2018-12-27 10:53:43"
          },
          {
            created_at:"2018-12-27 10:53:43",
            id:64,
            seller_id:25,
            seller_type_id:22,
            seller_type_name:"B",
            updated_at:"2018-12-27 10:53:43"
          },
          {
            created_at:"2018-12-27 10:53:43",
            id:64,
            seller_id:25,
            seller_type_id:23,
            seller_type_name:"C",
            updated_at:"2018-12-27 10:53:43"
          },
          {
            created_at:"2018-12-27 10:53:43",
            id:64,
            seller_id:25,
            seller_type_id:24,
            seller_type_name:"D",
            updated_at:"2018-12-27 10:53:43"
          }
        ],
        cuisine:[
          {id:65,
          seller_id:2,
          cuisine_name:"麻辣青蛙",
          type_id:1,
          cuisine_pic:"https://i.loli.net/2017/08/21/599a521472424.jpg",
          cuisine_dec:"995",
          cuisine_stock:"804",
          cuisine_ori_price:46,
          cuisine_price:20,
          has_sku:"1",
          cuisine_state:"1",
          cuisine_body:"Qui quia molestiae ut itaque perferendis.",
          cuisine_month_sales:700,
          del_flag:"0",
          update_by:"root",
          remarks:null,
          created_at:"2018-12-26 10:22:10",
          updated_at:"2018-12-26 10:22:10"
          },
          {id:65,
          seller_id:2,
          cuisine_name:"麻辣青蛙",
          type_id:2,
          cuisine_pic:"https://i.loli.net/2017/08/21/599a521472424.jpg",
          cuisine_dec:"995",
          cuisine_stock:"804",
          cuisine_ori_price:46,
          cuisine_price:20,
          has_sku:"0",
          cuisine_state:"1",
          cuisine_body:"Qui quia molestiae ut itaque perferendis.",
          cuisine_month_sales:700,
          del_flag:"0",
          update_by:"root",
          remarks:null,
          created_at:"2018-12-26 10:22:10",
          updated_at:"2018-12-26 10:22:10"
          },
          {id:65,
          seller_id:2,
          cuisine_name:"麻辣青蛙",
          type_id:3,
          cuisine_pic:"https://i.loli.net/2017/08/21/599a521472424.jpg",
          cuisine_dec:"995",
          cuisine_stock:"804",
          cuisine_ori_price:46,
          cuisine_price:20,
          has_sku:"0",
          cuisine_state:"1",
          cuisine_body:"Qui quia molestiae ut itaque perferendis.",
          cuisine_month_sales:700,
          del_flag:"0",
          update_by:"root",
          remarks:null,
          created_at:"2018-12-26 10:22:10",
          updated_at:"2018-12-26 10:22:10"
          },
          {id:65,
          seller_id:2,
          cuisine_name:"麻辣青蛙",
          type_id:4,
          cuisine_pic:"https://i.loli.net/2017/08/21/599a521472424.jpg",
          cuisine_dec:"995",
          cuisine_stock:"804",
          cuisine_ori_price:46,
          cuisine_price:20,
          has_sku:"1",
          cuisine_state:"1",
          cuisine_body:"Qui quia molestiae ut itaque perferendis.",
          cuisine_month_sales:700,
          del_flag:"0",
          update_by:"root",
          remarks:null,
          created_at:"2018-12-26 10:22:10",
          updated_at:"2018-12-26 10:22:10"
          }
        ]
      },
      shopCart:{},
      couponShopTag:['满10减1','满20减2','满30减3','满40减4'],
      optionAssort:'menu',
      nowOption:{
        //顶部选项
        menu:'menu',
        assess:'assess',
        seller:'seller'
      }
    }
  },
  created(){//组件的created只会执行一次
  },
  methods: {
    assortChange(e){
      this.optionAssort = e.mp.detail.key
    },
    categoryClick(seller_type_id){
      if(this.tagIndex != seller_type_id){
        this.tagIndex = seller_type_id
      }
    },
    addSubCart(element,handle){
      if(handle=='clearShopCart'){this.visibleSkuModal=false,this.visibleItemModal=false}
      if(element!=null){element.has_sku == '1' ? '': element.nowSelected = undefined}
      globalStore.dispatch('subAddShopCar', {
        shopId:this.shopId,
        goods:element,
        handle: handle
      }).then(()=>{
        //do something
        return
      })
    },
    previewCusine(item){
      // 预览详情
      if(item.cuisine_state == '0'){
        this.addSubCart(item,'DoNot')
        return //直接停止当前操作
      }
      if(globalStore.state.previewInfo[item.id]){
        this.previewInfo = globalStore.state.previewInfo[item.id]
        this.visibleItemModal = true
      }else{
        this.$http.get("/sellers/cuisines/"+item.id).then((res)=>{
          //获取并且缓存数据
          globalStore.state.previewInfo[item.id] = res.data.detail
          this.previewInfo = globalStore.state.previewInfo[item.id]
          this.visibleItemModal = true
          }).catch(err=>{
            console.log(err)
        })
      }
    },
    closePreview(){
      this.visibleItemModal = false
    },
    skuChoose(item){
      //规格详情
      this.closePreview()
      if(item.cuisine_state == '0'){
        this.addSubCart(item,'DoNot')
        return   //直接停止当前操作
      }
      if(globalStore.state.previewInfo[item.id]){
        this.previewInfo = globalStore.state.previewInfo[item.id]
        this.visibleSkuModal = true
      }else{
        this.$http.get("/sellers/cuisines/"+item.id).then((res)=>{
          //获取并且缓存数据
          globalStore.state.previewInfo[item.id] = res.data.detail
          this.previewInfo = globalStore.state.previewInfo[item.id]
          this.visibleSkuModal = true
          }).catch(err=>{
            console.log(err)
        })
      }
    },
    closeSku(){
      this.visibleSkuModal = false
    },
    attrClick(skuIndex){
      // 点击了规格里面的选项
      this.$set(this.previewInfo, 'nowSelected', skuIndex)
    },
    showShopCart(){
      //展示购物列表
      this.showShopList === false && this.shopCart.cartGoods.length!=0 ? this.showShopList = true : this.showShopList = false
    },
    Settlement(){
      // 进入结算页面
      wx.showLoading({
        title: '结算中',
      })
      globalStore.dispatch('settleing',this.shopId).then(()=>{
        wx.hideLoading()
        wx.navigateTo({url: '/pages/Settlement/main?shopId='+this.shopId})
      })
    }
  },
  computed: {
    //进入了不同的商店ID
    shopIdChange () {
      this.shopData = globalStore.state.sessionShopInfo[this.shopId]
      globalStore.commit('shopCartConstruct',{
        shopId:this.shopId,
        shopAddress: this.shopData.seller_address,
        seller_status:this.shopData.seller_status,
        shopName:this.shopData.seller_name,
        deliverFee:this.shopData.seller_freight,
        shopLogo:this.shopData.seller_logo,
        lowestPrice:this.shopData.seller_lowest_price
      })
      this.shopCart = globalStore.state.shopCart[this.shopId]
      return ''
    },
    //菜单右侧顶部标题筛选
    typeNameFilter(){
      if(this.shopData.type != null || this.shopData.type != undefined ){
        let type = this.shopData.type
        let tagIndex = this.tagIndex
        let result =  type.filter(function (type) {
          if(type.seller_type_id === tagIndex){
            return type.seller_type_name
          }
        })
        return result.length !=0 ? result[0].seller_type_name : ''
      }else{
        return ''
      }
    },
    //筛选出符合的菜列表
    shopDataCuisineFilter(){
      if(this.tagIndex == -1){
        return this.CuisineFilterComplete = this.shopData.cuisine
      }else{
        let cuisine = this.shopData.cuisine
        let tagIndex = this.tagIndex
        let result =  cuisine.filter(function (e) {
          if(e.type_id === tagIndex){
            return e
          }
        })
        return this.CuisineFilterComplete = result
      }
    }
  },
  watch:{
    //监听
    shopData:{
      handler:function(newVal,oldVal){
        this.shopData && this.shopData.type && this.shopData.cuisine ? this.tagIndex = this.shopData.type[0].seller_type_id : this.tagIndex = -1
      },
      deep:true}
  }
}
</script>
<style lang="scss" scoped>
$shopMenuListLeftColor:#666666;
$shopMenuListLeftBackgroundColor:#f7f8f9;
$shopTopBackgroundColor:#333333;
$shopTopFontColor:white;
$shopTopFontSize:21rpx;
$shopTopFontWeight:500;
$shopListRightTopTitleBackgroundColor:#ffffff;
$shopListRightTopTitleColor:#404040;
$buttonBackgroundColor:#ffd161;
$buttonColor:#2b2d31;
$listLeftRightHeight:65%; //滑动列表的高度最大只能75%不然有的看不见
$textDarkGray-color:#404040;
$page-bgcolor:#f4f4f4;
$theme-color:#f9d173;
$mtRed-color:#e74c3c;
$textBlack-color:#333333;
$textDarkGray-color:#666666;
$textGray-color:gray;
$spLine-color:#e4e4e4;
$shopCartBackgroundColor:#e4e4e4;
.shopDetail{
  width: 100%;
  height: 100%;
  display: -webkit-flex;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  .shopTop{
    width: 100%;
    display: -webkit-flex;
    display: flex;
    flex-flow: row nowrap;
    background-color: $shopTopBackgroundColor;
    font-size: $shopTopFontSize;
    color: $shopTopFontColor;
    font-weight: $shopTopFontWeight;
    .shopPoster{
      width: 150rpx;
      height: 150rpx;
      margin: 2%;
    }
    .shopPoster img{
      height: 100%;
      width: 100%;
    }
    .shopDesc{
      margin-top: 2%;
      width: 70%;
      display: -webkit-flex;
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-around;
      align-content: flex-start;
    }
  }
  .shopOption{
    width: 100%;
    border-bottom: 1rpx solid gainsboro;
  }
  .shopMenu{
    width: 100%;
    display: flex;
    display:-webkit-flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: flex-start;
    .list-l
    {
      width: 25%;
      height: $listLeftRightHeight;
      position: fixed;
      display: flex;
      display:-webkit-flex;
      flex-flow: column nowrap;
      background-color: $shopMenuListLeftBackgroundColor;
      ::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
        color: transparent;
      }
      .l-item{
        width: 100%;
        height: 90rpx;
        text-align: center;
        color: $shopMenuListLeftColor;
        background-color: $shopMenuListLeftBackgroundColor;
        span{
          line-height: 90rpx;
        }
      }
      .active{
        background-color: #ffffff;
        span{
          color: black;
          font-weight: 600;
        }
      }
    }
    .list-r{
      position: fixed;
      width: 75%;
      height: $listLeftRightHeight;
      left: 25%;
      display: flex;
      display:-webkit-flex;
      flex-flow: column nowrap;
      justify-content: flex-start;
      align-items: flex-start;
      ::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
        color: transparent;
      }
      .title
      {
        width: 120%;
        background-color: $shopListRightTopTitleBackgroundColor;
        color: $shopListRightTopTitleColor;
      }
      .content{
        width: 100%;
        display: -webkit-flex;
        display: flex;
        flex-flow: column wrap;
        justify-content: flex-start;
        align-items: center;
        .cuisineItem{
          position: relative;
          width: 100%;
          margin: 2% 0%;
          display: -webkit-inline-flex;
          display: inline-flex;
          flex-flow: row nowrap;
          justify-content: flex-start;
          align-items: flex-start;
          .cuisinePic{
            width:120rpx;
            height: 120rpx;
            img{
              width: 100%;
              height: 100%;
            }
          }
          .cuisineDesc{
            margin-left: 4%;
            display: -webkit-flex;
            display: flex;
            flex-flow: column wrap;
            justify-content: flex-start;
            align-items: flex-start;
            div{
              margin-bottom: 8%;
              width: 100%;
              font-size: 22rpx;
              color: #666666;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            .cuisineTitle{
              font-size: 28rpx;
              color: black;
              font-weight: bold;
            }
            .cuisineDetail{
              font-size: 22rpx;
              color: #666666;
            }
            .monthSaleAndStock{
              font-size: 22rpx;
              .month{
                margin-right: 4%;
              }
            }
            .priceAndBtton{
              display: -webkit-inline-flex;
              display: inline-flex;
              flex-flow: row nowrap;
              justify-content: space-between;
              .price{
                font-family: '黑体',sans-serif;
                font-size: 29rpx;
                color: #fc4e44;
              }
              .btn{
                position: absolute;
                bottom: 2%;
                right: 2%;
                button{
                  float: left;
                  font-size: 20rpx;
                  color: $buttonColor;
                  font-weight: bold;
                  background-color: $buttonBackgroundColor;
                }
                .addSubcart{
                  width: 50rpx;
                  height: 50rpx;
                  border-radius: 50%;
                  -webkit-border-radius: 50%;
                  line-height: 50rpx;
                  padding: 0;
                  margin: 0 auto;
                  text-align: center;
                }
                .subCart{
                  background-color: whitesmoke;
                }
                .cartNum{
                  font-size: 30rpx;
                  background: transparent;
                }
                .sku{
                  width: 130rpx;
                }
              }
            }
          }
        }
      }
      
    }
    .shopCart{
      background-color: $shopTopBackgroundColor;
      color: #696969;
      height: 10%;
      z-index: 9999;
      width: 100%;
      position: fixed;
      display: -webkit-inline-flex;
      display: inline-flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      align-content: center;
      bottom: 0rpx;
      .left{
        height: 100%;
        width: 65%;
        display: inline-flex;
        display: -webkit-inline-flex;
        flex: row nowrap;
        justify-content: flex-start;
        align-items: center;
        align-content: center;
        font-size: 22rpx;
        .cartLogo{
          margin:0 2%;
          width: 100rpx;
          height: 100rpx;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .cartDesc {
          div{
            margin: 2% 0;
          }
          .totalPrice{
            font-size: large;
            font-weight: bold;
            color: rgb(241, 241, 241);
          }
          .Desc span{
            margin: 0 2%;
          }
        }
      }
      .right{
        height: 100%;
        width: 35%;
        span{
          width: 100%;
          height: 100%;
          display: box;
          display: -webkit-box;
          -webkit-box-pack:center; /*实现水平居中*/
          -webkit-box-align:center; /*实现垂直居中*/
        }
        .Settlement{
          background: #F0D179;
        }
      }
    }
    .shopCartList{
      z-index: 9998;
      width: 100%;
      height: 100%;
      position: fixed;
      bottom: 10%;
      background: rgba($color: #000000, $alpha: 0.1);
      .plane{
        width: 100%;
        position: absolute;
        bottom: 0;
        .title{
          height: 100rpx;
          width: 100%;
          background-color: white;
          font-size: 25rpx;
          display: inline-flex;
          display: -webkit-inline-flex;
          flex-flow: row nowrap;
          justify-content: space-between;
          align-items: center;
          border-bottom: $textGray-color;
          span{
            line-height: 100rpx;
            margin: 0 2%;
          }
        }
        .list{
          width: 100%;
          display: flex;
          display: -webkit-flex;
          flex-flow: column nowrap;
          justify-content: flex-start;
          align-content: space-between;
          align-items: flex-start;
          background-color: white;
          .item{
            position: relative;
            width: 100%;
            display: inline-flex;
            display: -webkit-inline-flex;
            flex-flow: row nowrap;
            justify-content: space-around;
            background-color: white;
            height: 100rpx;
            line-height: 100rpx;
            font-size: 30rpx;
            margin: 1% 0;
            .btn{
                position: absolute;
                bottom: 25%;
                right: 2%;
                button{
                  float: left;
                  font-size: 20rpx;
                  color: $buttonColor;
                  font-weight: bold;
                  background-color: $buttonBackgroundColor;
                }
                .addSubcart{
                  width: 50rpx;
                  height: 50rpx;
                  border-radius: 50%;
                  -webkit-border-radius: 50%;
                  line-height: 50rpx;
                  padding: 0;
                  margin: 0 auto;
                  text-align: center;
                }
                .subCart{
                  background-color: whitesmoke;
                }
                .cartNum{
                  font-size: 30rpx;
                  background: transparent;
                }
                .sku{
                  width: 130rpx;
                }
              }
          }
        }
      }
      
    }
  }
  .sku-modal {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba($color: #000000, $alpha: 0.3);
    z-index: 996;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    .modal-c {
      display: flex;
      flex-direction: column;
      background-color: white;
      width: 90%;
      margin-right: 40rpx;
      margin-left: 40rpx;
      border-radius: 10rpx;
      .header {
        display: flex;
        flex-direction: column;
        .title {
          font-size: 32rpx;
          color: $textDarkGray-color;
          align-self: center;
          margin-top: 20rpx;
        }
        .attrs {
          display: flex;
          flex-direction: column;
          margin: 0 20rpx;
          margin-top: 20rpx;
          .name {
            font-size: 28rpx;
            color: $textBlack-color;
          }
          .sku {
            display: flex;
            flex-direction: row;
            width: 100%;
            flex-wrap: wrap;
            margin-bottom: 20rpx;
            .item {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 140rpx;
              height: 50rpx;
              border: 2rpx solid $spLine-color;
              border-radius: 4rpx;
              margin-top: 20rpx;
              margin-right: 20rpx;
              span {
                font-size: 24rpx;
                color: $textBlack-color
              }
            }
            .selected {
              background-color: #FFF9F4;
              border: 2rpx solid $theme-color;
              span {
                color: $theme-color;
              }
            }
          }
        }
      }
      .footer {
        display: flex;
        align-items: center;
        background-color: $page-bgcolor;
        height: 100rpx;
        border-bottom-right-radius: 10rpx;
        border-bottom-left-radius: 10rpx;
        padding: 0 20rpx;
        .f-l {
          display: flex;
          align-items: center;
          flex: 1;
          .price {
            font-size: 36rpx;
            color: $mtRed-color;
            font-weight: bold;
          }
          .sku {
            font-size: 20rpx;
            color:  $textBlack-color;
            margin-left: 20rpx;
          }
        }
        .f-r {
          display: flex;
          align-items: center;
          .shopping-c {
            display: flex;
            align-items: center;
            height: 60rpx;
            border-radius: 30rpx;
            padding: 0 20rpx;
            background-color: $theme-color;
            i {
              font-size: 28rpx;
              color:  $textBlack-color;
            }
            span {
              font-size: 24rpx;
              color:  $textBlack-color;
              margin-left: 10rpx;
            }
          }
          .add {
            display: flex;
            flex-direction: row;
            align-items: center;
            .btn{
                button{
                  float: left;
                  font-size: 20rpx;
                  color: $buttonColor;
                  font-weight: bold;
                  background-color: $buttonBackgroundColor;
                }
                .addSubcart{
                  width: 50rpx;
                  height: 50rpx;
                  border-radius: 50%;
                  -webkit-border-radius: 50%;
                  line-height: 50rpx;
                  padding: 0;
                  margin: 0 auto;
                  text-align: center;
                }
                .subCart{
                  background-color: whitesmoke;
                }
                .cartNum{
                  font-size: 30rpx;
                  background: transparent;
                }
                .sku{
                  width: 130rpx;
                }
              }
          }
        }
      }
    }
    .cancle {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 40rpx;
      width: 70rpx;
      height: 70rpx;
      border-radius: 35rpx;
      background: rgba($color: #000000, $alpha: 0.5);
      border: 2rpx solid $textGray-color;
      i {
        font-size: 32rpx;
        color: white;
      }
    }
  }
  .previewModal {
    @extend .sku-modal;
    .modal-c {
      .header-p {
        display: flex;
        flex-direction: column;
        .item-img {
          width: 100%;
          height: 400rpx;
          background-color: #E7AC40;
          border-top-left-radius: 10rpx;
          border-top-right-radius: 10rpx;
        }
        .title {
          font-size: 28rpx;
          color: $textBlack-color;
          font-weight: bold;
          margin-left: 16rpx;
          margin-top: 16rpx;
        }
        .saled {
          display: flex;
          align-items: center;
          flex-direction: row;
          margin: 0 16rpx;
          margin-top: 10rpx;
          .l {
            font-size: 20rpx;
            color: $textDarkGray-color;
          }
          .r {
            @extend .l;
            margin-left: 30rpx;
          }
        }
        .tags-c {
          display: flex;
          align-items: center;
          margin: 0 16rpx;
          margin-top: 10rpx;
          flex-wrap: wrap;
          img {
            width: 60rpx;
            height: 30rpx;
            background-size: cover;
          }
        }
        .desc {
          font-size: 20rpx;
          color: $textDarkGray-color;
          margin-left: 16rpx;
          margin-top: 30rpx;
          margin-bottom: 20rpx;
        }
      }
      .footer-p {
        display: flex;
        align-items: center;
        height: 80rpx;
        background-color: $page-bgcolor;
        padding: 0 20rpx;
        border-bottom-left-radius: 10rpx;
        border-bottom-right-radius: 10rpx;
        .l {
          font-size: 36rpx;
          color: $mtRed-color;
          flex: 1;
          font-weight: bold;
        }
        .r {
          display: flex;
          align-items: center;
          .add-c {
            .btn{
                button{
                  float: left;
                  font-size: 20rpx;
                  color: $buttonColor;
                  font-weight: bold;
                  background-color: $buttonBackgroundColor;
                }
                .addSubcart{
                  width: 50rpx;
                  height: 50rpx;
                  border-radius: 50%;
                  -webkit-border-radius: 50%;
                  line-height: 50rpx;
                  padding: 0;
                  margin: 0 auto;
                  text-align: center;
                }
                .subCart{
                  background-color: whitesmoke;
                }
                .cartNum{
                  font-size: 30rpx;
                  background: transparent;
                }
                .sku{
                  width: 130rpx;
                }
              }
          }
          .attr {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: $theme-color;
            padding: 8rpx 12rpx;
            border-radius: 25rpx;
            position: relative;
            span {
              font-size: 20rpx;
              color: $textBlack-color
            }
            .count {
              width: 30rpx;
              height: 30rpx;
              background-color: $mtRed-color;
              display: flex;
              align-items: center;
              justify-content: center;
              position: absolute;
              color: white;
              font-size: 20rpx;
              right: 0;
              top: -14rpx;
              border-radius: 15rpx;
            }
          }
        }
      }
    }
  }
}
</style>