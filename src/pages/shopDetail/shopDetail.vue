<template>
  <div class="container">
    <shop-page v-if='shopId != null' :shop-id='shopId' @idStatus="handleStatus"></shop-page>
  </div>
</template>
<script>
import globalStore from "../../stores/globalStore"
import shopPage from "@/components/shopPageComp"
  export default {
    components: { shopPage },
    data () {
      return {
        shopId:null
      }
    },
    methods:{
      handleStatus(e){
        if(e.Status){
          
        }
      }
    },
    mounted(){ //mounted每次都会触发
      wx.setNavigationBarTitle({
        title: globalStore.state.sessionShopInfo[this.$root.$mp.query.shopId].seller_name
      })
      if(globalStore.state.sessionShopInfo[this.$root.$mp.query.shopId]['cuisine'] == undefined){
        this.$http.get("/sellers/"+this.$root.$mp.query.shopId).then((res)=>{
        //获取并且缓存数据
        globalStore.state.sessionShopInfo[this.$root.$mp.query.shopId]['cuisine'] = res.data.cuisine
        globalStore.state.sessionShopInfo[this.$root.$mp.query.shopId]['type'] = res.data.type
        //等待数据缓存完成再唤醒子组件
        this.shopId = this.$root.$mp.query.shopId
        }).catch(err=>{
          console.log(err)
        })
      }else{
        //已有缓存可以唤醒直接子组件
        this.shopId = this.$root.$mp.query.shopId
      }
    }
  }
</script>
<style scoped>
  
</style>