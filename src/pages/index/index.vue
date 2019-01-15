<template>
  <div class="container">
    <div class="address"><i-cell  title="广东轻工职业技术学院" is-link url="/pages/index/address/main" link-type="navigateTo" only-tap-footer><i-icon slot="icon" type="coordinates" size="22" color="#80848f"/></i-cell></div>
    <div class="select" v-bind:style="searchStyle">
      <div class="searchPanel"><span class="searchIcon"><i-icon type="search" size="18" color="#808080"/></span><input class="searchInput" type="text" placeholder="请输入商家或商品名称"/></div>
    </div>
    <div class="tableList">
      <i-row id="topMenu">
        <i-col span="6" ><div class="menuItem"><i-avatar size="large" shape="circle" src="https://i.loli.net/2017/08/21/599a521472424.jpg"></i-avatar><span class="menuName">美食</span></div></i-col>
        <i-col span="6" ><div class="menuItem"><i-avatar size="large" shape="circle" src="https://i.loli.net/2017/08/21/599a521472424.jpg"></i-avatar><span class="menuName">美食</span></div></i-col>
        <i-col span="6" ><div class="menuItem"><i-avatar size="large" shape="circle" src="https://i.loli.net/2017/08/21/599a521472424.jpg"></i-avatar><span class="menuName">美食</span></div></i-col>
        <i-col span="6" ><div class="menuItem"><i-avatar size="large" shape="circle" src="https://i.loli.net/2017/08/21/599a521472424.jpg"></i-avatar><span class="menuName">美食</span></div></i-col>
        <i-col span="6" ><div class="menuItem"><i-avatar size="large" shape="circle" src="https://i.loli.net/2017/08/21/599a521472424.jpg"></i-avatar><span class="menuName">美食</span></div></i-col>
        <i-col span="6" ><div class="menuItem"><i-avatar size="large" shape="circle" src="https://i.loli.net/2017/08/21/599a521472424.jpg"></i-avatar><span class="menuName">美食</span></div></i-col>
        <i-col span="6" ><div class="menuItem"><i-avatar size="large" shape="circle" src="https://i.loli.net/2017/08/21/599a521472424.jpg"></i-avatar><span class="menuName">美食</span></div></i-col>
        <i-col span="6" ><div class="menuItem"><i-avatar size="large" shape="circle" src="https://i.loli.net/2017/08/21/599a521472424.jpg"></i-avatar><span class="menuName">美食</span></div></i-col>
      </i-row>
    </div>

    <div id="recommendation">
      <div class="slogan">
        <div>热卖推荐</div>
        <div><i-cell is-link url="/pages/index/address/main" link-type="navigateTo"></i-cell></div>
      </div>

      <div class="recommendedPics">
        <swiper class="swiper" indicator-dots="true" autoplay="true" interval="5000" duration="1000" circular="true">
            <block v-for="(item, index) in recommendPic" :index="index" :key="index">
                <swiper-item >
                    <image :src="item.url" class="recommendedPoster" mode="scaleToFill"/>
                </swiper-item>
            </block>
        </swiper>
      </div>
    </div>

    <div id="shop">
      <div class="neighborhood"><p>附近商家</p></div>
      <div class="assortment">
        <i-tabs i-class="" :current="currentAssort" color="#FFD26B" @change="assortChange" >
          <i-tab key="comprehensive" title="综合排序" ></i-tab><i-icon class="assortIcon" slot="icon" type="unfold" size="10" color="#80848f"/>
          <i-tab key="tab2" title="销量高"></i-tab>
          <i-tab key="tab3" title="速度快"></i-tab>
          <i-tab key="tab4" title="减免配送费"></i-tab>
          <i-tab key="tab5" title="筛选" ></i-tab><i-icon class="assortIcon" slot="icon" type="label_fill" size="12" color="#80848f"/>
        </i-tabs>
      </div>
      <div class="shopList">
        <block v-for="(item, index) in shopItems" :index="index" :key="index">
          <div class="shopItem" @click="navShopDetail(item)">
            <div class="shopPoster"><img :src="item.seller_logo" mode="aspectFit"><i-badge v-if="shopCart[item.id]" :count="shopCart[item.id].totalMount"></i-badge></div>
            <div class="shopDescribe">
              <div class="shopName">{{item.seller_name}}</div>
              <div class="shopSecondRow">
                <div class="shopSecondRowLeft">
                  <span class="shopStars"><i-rate size="12" disabled :value="item.seller_grade">{{item.seller_grade}}<span class="saleAmounts">月售{{item.seller_month_sales}}</span></i-rate></span>
                </div>
                <div class="shopSecondRowRight">
                  <span class="shopRange">××km</span>|<span class="arriveTime">{{item.deliver_time}}</span>
                </div>
              </div>
              <div class="shopThirdRow"><span>起送{{item.seller_lowest_price}}</span>|<span >{{item.seller_freight === "0" ? '免配送费' : '配送'+item.seller_freight}}</span>|<span>人均{{item.seller_lowest_price}}</span></div>
              <div class="saleType"><i-icon type="shop_fill" size="24" color="#80848f" />{{item.seller_type}}</div>
              <div class="shopTag">
                <i-tag 
                    v-for="(tag, tagIndex) in PseudoShopTag" 
                    :key="tagIndex" 
                    checkable="false" 
                    :name="tag.name" 
                    :color="tag.color" 
                    :checked="tag.checked" 
                    type="border">
                    {{tag.name}}
                </i-tag>
              </div>
            </div>
          </div>
        </block>
      </div>
      <span class="shopLoading"><i-load-more :tip="loadUI ? '加载中':'暂无数据' " :loading="loadUI" /></span>
    </div>
  </div>
</template>

<script>
  import globalStore from "../../stores/globalStore"
  export default {
  created () {
    this.loadShop(this.nowPage)
  },
  data () {
    return {
      nowPage:1,
      maxPage:null,
      loadUI:false,
      currentAssort:'comprehensive',
      searchDivPosition:'none',
      shopItems:[],
      PseudoShopTag:[
        {
                name : '标签一',
                checked : false,
                color : 'default'
            },
            {
                name : '标签二',
                checked : false,
                color : 'red'
            },
            {
                name : '标签三',
                checked : true,
                color : 'blue'
            },
            {
                name : '标签4️',
                checked : true,
                color : 'green'
            }
      ],
      recommendPic:[
        {
          url:"https://i.loli.net/2017/08/21/599a521472424.jpg",
          name:"A图"
        },
        {
          url:"https://i.loli.net/2017/08/21/599a521472424.jpg",
          name:"B图"
        },
        {
          url:"https://i.loli.net/2017/08/21/599a521472424.jpg",
          name:"C图"
        }
      ],
      shopCart:globalStore.state.shopCart
    }
  },
  methods: {
    assortChange(e){
      this.currentAssort = e.mp.detail.key
    },
    loadShop(pageNum){
      this.loadUI = true
      this.$http.get("/sellers",{page:pageNum}).then((res)=>{
        this.maxPage = res.data.last_page
        this.shopItems = this.shopItems.concat(res.data.data)
        this.loadUI = false
      }).catch(err=>{
        console.log(err)
      })
    },
    navShopDetail(item){
      globalStore.state.sessionShopInfo[item.id] ? '' : globalStore.state.sessionShopInfo[item.id] = item
      wx.navigateTo({
        url: '../shopDetail/main?shopId='+item.id
      })
    }
  },
  computed: {
    searchStyle () {
      return 'position:'+ this.searchDivPosition + ';'
    }
  },
  onPageScroll(event){
    if(event.scrollTop>50){
      this.searchDivPosition = 'fixed';
    }else{
      this.searchDivPosition = 'none';
    }
  },
  onReachBottom(){
    this.nowPage ++;
    this.nowPage<=this.maxPage ? this.loadShop(this.nowPage) : '';
  }
}
</script>

<style scoped>
  .select{
    display: -webkit-flex; /* Safari */
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items:center;
    width: 100%;
    z-index: 9999;
  }
  .searchPanel{
    border-radius:20px;
    background-color: #eff3f6;
    height: 50rpx;
    width: 96%;
  }
  .searchIcon{
    float: left;
    margin: 0% 2%;
  }
  .searchInput{
    font-size: 28rpx;
  }
  .tableList{
    margin-top: 3.5%;
    padding: 2%;
    width: 100%;
    /* border: 1px solid blue; */
    display: -webkit-flex; /* Safari */
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items:center;
    height: auto;
  }
  #topMenu{
    /* border: 1px solid red; */
    height: auto;
    width: 100%;
    text-align: center;
  }
  #topMenu .menuItem{
    display: inline-flex;
    flex-flow: column nowrap;
    justify-content:center;
    justify-items: center;
    align-content: center;
    align-items: center; 
    /* border: 1px solid gray; */
    margin: 5% 0%;
  }
  #topMenu .menuItem .menuName{
    text-align: center;
    font-size: 25rpx;
    margin-top: 0.5%;
    color: rgb(48, 48, 49);
  }
  #recommendation{
    margin-top: 2%;
    padding: 2%;
    width: 100%;
    /* border: 1px solid blue; */
    display: -webkit-flex; /* Safari */
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    /* height: 250rpx; */
  }
  #recommendation .slogan{
    width: 100%;
    height: 20%;
    /* border: 1px solid rgb(221, 28, 21); */
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: '黑体', 'New Century Schoolbook',Georgia, 'New York', serif;
    font-weight:normal;
    color: slategray;
  }
  #recommendation .recommendedPics{
    width: 100%;
    height: auto;
  }
  #recommendation .recommendedPics .swiper{
    width: 100%;
    height: 235rpx;
  }
  #recommendation .recommendedPics .swiper .recommendedPoster{
    width: 100%;
    height: 100%;
  }
  #shop{
    display: -webkit-flex; /* Safari */
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-content:center;
    width: 100%;
    height: auto;
    margin-top: 2.5%;
  }
  #shop .neighborhood{
    width: 96%;
  }
  #shop .neighborhood p{
    font-family: Arial, Helvetica, sans-serif;
    font-weight:600;
    font-size: 46rpx;
    color: #1c2438;
  }
  #shop .assortment{
    width: 100%;
  }
  #shop .assortIcon{
    position: relative;
    left: -2%;
  }
  #shop .shopList{
    width: 96%;
    display: -webkit-flex;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    margin-top: 1%;
  }
  #shop .shopItem{
    margin-bottom: 3.5%;
    width: 100%;
    height: auto;
    /* border: 1px solid greenyellow; */
    display: -webkit-flex;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
  }
  #shop .shopItem > div{
    display: inline-block;
  }
  #shop .shopItem .shopPoster{
    width: 25%;
    height: 65%;
  }
  #shop .shopItem .shopPoster img{
    width: 100%;
    height: 100%;
  }
  #shop .shopItem .shopDescribe{
    width: 100%;
    height: 100%;
    margin-left: 2%;
    display: -webkit-flex;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items:flex-start;
    font-family: '黑体','Courier New', Courier, monospace;
    font-size:23rpx;
    color: #8b8b8b;
  }
  #shop .shopItem .shopDescribe .shopName{
    font-size: 200%;
    font-weight: bolder;
    color: #495060;
  }
  #shop .shopItem .shopDescribe .shopSecondRow{
    display: -webkit-flex;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: baseline;
    width: 100%;
  }
  #shop .shopItem .shopDescribe .shopSecondRow .shopSecondRowLeft{
    display: inline-block;
    width: 70%;
  }
  #shop .shopItem .shopDescribe .shopSecondRow .shopSecondRowLeft .saleAmounts{
    margin-left: 20rpx;
  }
  #shop .shopItem .shopDescribe .shopSecondRow .shopSecondRowRight{
    display: inline-block;
  }
  #shop .shopItem .shopDescribe .shopTag{
    width: 100%;
  }
  #shop .shopLoading{
    width: 100%;
  }
</style>