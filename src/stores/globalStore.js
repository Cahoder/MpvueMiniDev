import Vue from 'vue'
import Vuex from 'vuex'
// import {fly} from "../main"
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    //数据仓库
    sessionKey:null,
    access_token:null,
    addressInfo:[],//用户地址信息
    sessionShopInfo:{},   //缓存用户点击过的商店的基础信息
    previewInfo:{}, //缓存商品详情
    shopCart:{}, //缓存用户个人购物车信息
    haveNewOrderStatus: false, //判断是否有新的订单
    settlementInfo:[], //当前订单的列表详情
    orderDetailInfo:null //当前点击的订单详情
  },
  mutations: {
    //只能同步
    //获取头部的sessionkey
    sessionKeyBind: (state,payload) => {
      state.sessionKey = payload.sessionKey
      state.access_token = payload.access_token
    },
    //创建数据结构
    shopCartConstruct:(state,data)=>{
      // console.log(state.sessionShopInfo[data.shopId])
      if(state.shopCart[data.shopId] === undefined){
        let obj = {
          shopName:data.shopName,
          shopAddress:data.shopAddress,
          deliverFee:data.deliverFee,
          shopLogo:data.shopLogo,
          lowestTotalPrice:data.lowestPrice,
          shopId:data.shopId,
          cartGoods:[],
          cusineType:{},
          totalMount:0,
          totalPrice:0,
          seller_status:data.seller_status
        }
        state.shopCart[data.shopId] = obj
        return true
      }else{
        return true
      }
    },
    //准备好结算订单信息
    waitForSettle:(state,data)=>{
      state.settlementInfo = data
    }
  },
  actions:{
    //允许异步function
    //对购物车进行操作
    async subAddShopCar ({ state, dispatch }, products) {
      if(state.shopCart[products.shopId].seller_status != '1'){//检测商家是否开门
        wx.showToast({
          title: '店铺休息中!',
          icon: 'none',
          duration: 1500
        })
        return
      }
      if(products.goods!=null && products.goods.cuisine_state != '1'){ //检测商品是否销售中
        wx.showToast({
          title: '该商品已下架',
          icon: 'none',
          duration: 1500
        })
        return
      }
      if(products.goods!=null&&products.goods.nowSelected != undefined){products.handle = 'suk'+products.handle}
      await dispatch('computedPrice' , products).then(() => {
        return
      })
    },
    //进行运算
    computedPrice ({state}, data) {
      let shopCart = state.shopCart[data.shopId]
      switch (data.handle){
        case 'DoNot':
        //啥也不做
        break;
        case 'add':
          if(shopCart.cartGoods.length == 0){
            // console.log('这家店的这个购物车为空直接加入了');
            shopCart.cartGoods.push(data.goods)  //直接加入
            shopCart.cartGoods[0].mounts = 1 //这件商品购买数量加1
            shopCart.totalPrice = data.goods.cuisine_price //总价累加
            shopCart.totalMount++ //在这件商店购买总数++
            Vue.set(shopCart.cusineType, data.goods.type_id, 1) //记录所属菜单类型 一定要用vue.set 方法添加新属性
            // console.log(state.shopCart)
            // console.log(data);
            return
          }else if(shopCart.cartGoods.length >0){
            // console.log('这家店的购物车不为空');
            //查看购物车内
            let resIndex  = null
              for (let index = 0; index < shopCart.cartGoods.length; index++) {
                const element = shopCart.cartGoods[index]
                if(data.goods.id === element.id){
                  resIndex = index
                  break;
                }
              }
              //判断之前是否添加过该商品进入购物车
              if(resIndex != null){
                // console.log('这家店的有买过这个')
                shopCart.cartGoods[resIndex].mounts++
                shopCart.totalMount++
                shopCart.cusineType[data.goods.type_id] ++
                shopCart.totalPrice += data.goods.cuisine_price
                return
              }else{
                // console.log('这家店的没买过这个')
                let nowLength = shopCart.cartGoods.push(data.goods)  //直接加入
                shopCart.cartGoods[nowLength -1].mounts = 1 //这件商品购买数量加1
                shopCart.totalPrice += data.goods.cuisine_price //总价累加
                shopCart.totalMount++ //在这间商店购买总数++
                shopCart.cusineType[data.goods.type_id] ? shopCart.cusineType[data.goods.type_id]++ : Vue.set(shopCart.cusineType, data.goods.type_id, 1) ////记录所属菜单类型 一定要用vue.set 方法添加新属性
                return
              }
          }
        break;
        case 'sub':
          if(shopCart.cartGoods.length >0){
            let resIndex  = null
              for (let index = 0; index < shopCart.cartGoods.length; index++) {
                const element = shopCart.cartGoods[index]
                if(data.goods.id === element.id){
                  resIndex = index
                  break;
                }
              }
              if(resIndex != null){
                shopCart.cartGoods[resIndex].mounts--
                if(shopCart.cartGoods[resIndex].mounts ==0){
                  shopCart.cartGoods.splice(resIndex,1)
                }
                shopCart.totalMount--
                shopCart.cusineType[data.goods.type_id]--
                shopCart.totalPrice -= data.goods.cuisine_price
                return
              }
            }
        break;
        case 'clearShopCart':
          shopCart.cartGoods = []
          shopCart.totalMount = 0
          for (var index in shopCart.cusineType){
            shopCart.cusineType[index] = 0
          }
          shopCart.totalPrice = 0
        break;
        case 'sukadd':
          if(data.goods.nowSelected != undefined){
            if(shopCart.cartGoods.length == 0 ){
              // console.log('这家店的这个购物车为空直接加入了')
              let obj = JSON.parse(JSON.stringify(data.goods))  //暴力转成字符串再转回来使得这个对象失去了所有关联性
              shopCart.cartGoods.push(obj)  //直接加入
              shopCart.cartGoods[0].mounts = 1 //这件商品购买数量加1
              shopCart.totalPrice = data.goods.all_scale[data.goods.nowSelected].sku_price*1 //总价累加
              shopCart.totalMount++ //在这件商店购买总数++
              Vue.set(shopCart.cusineType, data.goods.type_id, 1) //记录所属菜单类型 一定要用vue.set 方法添加新属性
              return
            }else if(shopCart.cartGoods.length >0){
              // console.log('这家店的购物车不为空');
              //查看购物车内
              let resIndex  = null
                for (let index = 0; index < shopCart.cartGoods.length; index++) {
                  const element = shopCart.cartGoods[index]
                  if(data.goods.nowSelected === element.nowSelected){
                    resIndex = index
                    break;
                  }
                }
                //判断之前是否添加过该商品进入购物车
                if(resIndex != null){
                  // console.log('这家店的有买过这个规格')
                  shopCart.cartGoods[resIndex].mounts++
                  shopCart.totalMount++
                  shopCart.cusineType[data.goods.type_id]++
                  shopCart.totalPrice += shopCart.cartGoods[resIndex].all_scale[shopCart.cartGoods[resIndex].nowSelected].sku_price*1
                  return
                }else{
                  // console.log('这家店的没买过这个规格')
                  let obj = JSON.parse(JSON.stringify(data.goods))  //使得这个对象失去了关联性
                  let nowLength = shopCart.cartGoods.push(obj)  //直接加入
                  shopCart.cartGoods[nowLength -1].mounts = 1 //这件商品购买数量加1
                  shopCart.cartGoods[nowLength -1].nowSelected = data.goods.nowSelected
                  shopCart.totalPrice += data.goods.all_scale[data.goods.nowSelected].sku_price*1 //总价累加
                  shopCart.totalMount++ //在这间商店购买总数++
                  shopCart.cusineType[data.goods.type_id] ? shopCart.cusineType[data.goods.type_id]++ : Vue.set(shopCart.cusineType, data.goods.type_id, 1) ////记录所属菜单类型 一定要用vue.set 方法添加新属性
                  return
              }
            }
          }
        break;
        case 'suksub':
        if(data.goods.nowSelected != undefined){
          if(shopCart.cartGoods.length >0){
            let resIndex  = null
              for (let index = 0; index < shopCart.cartGoods.length; index++) {
                const element = shopCart.cartGoods[index]
                if(data.goods.nowSelected === element.nowSelected){
                  resIndex = index
                  break;
                }
              }
              if(resIndex != null){
                shopCart.cartGoods[resIndex].mounts--
                if(shopCart.cartGoods[resIndex].mounts ==0){
                  shopCart.cartGoods.splice(resIndex,1)
                }
                shopCart.totalMount--
                shopCart.cusineType[data.goods.type_id]--
                shopCart.totalPrice -= data.goods.all_scale[data.goods.nowSelected].sku_price*1
                return
              }
          }
        }
        break;
      }
    },
    //清洗当前商店的订单
    async settleing({state,commit},shopId){
      let cleanComplete = []
      let goodsOrder = state.shopCart[shopId].cartGoods
      for (var {id:goods_id,mounts:good_num, cuisine_name, nowSelected, has_sku, cuisine_pic, cuisine_price, all_scale} of goodsOrder) {
        let obj ={
          cuisine_pic,goods_id,good_num,
          goods_price:has_sku==1?(all_scale[nowSelected].sku_price)*1 : cuisine_price*1,
          goods_all_price : has_sku==1?(all_scale[nowSelected].sku_price)*1*good_num : cuisine_price*1*good_num,
          goods_sku : has_sku==1?all_scale[nowSelected].sku_name:cuisine_name,
          zp_integral : has_sku==1?(all_scale[nowSelected].sku_price)*1*good_num : cuisine_price*1*good_num
        }
        cleanComplete.push(obj)
      }
      commit('waitForSettle',cleanComplete)
      // console.log(cleanComplete)
    }
  }
})