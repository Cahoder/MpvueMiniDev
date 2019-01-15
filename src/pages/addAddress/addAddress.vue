<template>
  <div class="container">
    <div class="name">
      <span>联系人：</span>
      <input v-model.lazy="userName" placeholder="请填写收货人的姓名" placeholder-style="font-size: 24rpx" auto-focus/>
      <i-switch :value="defaultAddress"  @change="addressDefault">
        <view slot="open">默认</view>
        <view slot="close"></view>
      </i-switch>
    </div>
    <div class="sex">
      <span>性别：</span>
      <radio-group class="radio-group" @change="sexChange">
        <label class="radio" v-for="(item,index) in sexRadio" :key="index">
          <radio :value="item.value"/>{{item.name}}
        </label>
      </radio-group>
    </div>
    <div class="phone">
      <span>手机号：</span>
      <input type="number" placeholder="请填写11位手机号码" maxlength="11" v-model.lazy="phone"/>
    </div>
    <div class="address">
      <span class="l">收货地区：</span>
      <div class="m">
        <span @click="showPicker">{{school[regionDefault].label}}</span>
        <mpvue-picker ref="mpvuePicker" mode="selector" :pickerValueArray="school" :pickerValueDefault='regionDefault' @onConfirm="regionConfirm"></mpvue-picker>
      </div>
    </div>
    <div class="house-num">
      <span>详细地址：</span>
      <input placeholder="例：16号楼5楼301室" placeholder-style="font-size: 24rpx" v-model.lazy="detailAddress"/>
    </div>
    <div class="submit">
      <span><i-button @click="saveAddress" type="primary" long="true">保存地址</i-button></span>
    </div>
  </div>
</template>

<script>
import {checkPhone} from '../../utils/index';
import mpvuePicker from 'mpvue-picker';
import globalStore from "../../stores/globalStore";
export default {
  components: {
    mpvuePicker
  },
  data(){
    return{
      defaultAddress : false,
      userName:'',
      sex:'',
      phone:'',
      regionDefault: 0,
      detailAddress:'',
      sexRadio:[
        {name: '男生', value: '0'},
        {name: '女生', value: '1'}
      ],
      school: [
        {
          label: '广东轻工职业技术学院',
          value: 1
        },
        {
          label: '广东东软学院',
          value: 2
        },
        {
          label: '华南师范大学',
          value: 3
        }
      ]
    }
  },
  methods: {
    showWorng:function(){
      wx.showToast({
        title: '输入信息有误',
        icon: 'none',
        duration: 1000
      })
    },
    sexChange:function(e){this.sex = e.mp.detail.value},
    showPicker() {this.$refs.mpvuePicker.show()},
    regionConfirm(e){this.regionDefault = e.index},
    addressDefault(e){this.defaultAddress = e.mp.detail.value},
    saveAddress(){
      //保存地址
      if(checkPhone(this.phone)!=true ||this.userName=='' || this.sex == '' || this.detailAddress==''){
        this.showWorng()
        return
      }else{
        let obj ={
          phone:this.phone,
          name:this.userName,
          address:this.school[this.regionDefault].label,
          address_dec:this.detailAddress,
          address_flag:this.defaultAddress ? 1 : 0
        }
        this.$http.post("/users/addresses/add",obj).then((res)=>{
          if(res.status == 200){
            this.$http.post("/users/addresses").then((InfoRes)=>{
              globalStore.state.addressInfo = [...InfoRes.data]
              wx.showToast({
                title: '添加地址成功',
                icon: 'success',
                duration: 1500 ,
                mask:true,
                success:()=>{
                  wx.navigateBack({
                    delta: 1
                  })
                }
              })
            })
          }
        }).catch(err=>{
          console.log(err)
        })
        return
      }
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
  div{
    font-size: 25rpx;
    width: 100%;
  }
  .name {
    display: flex;
    align-items: center;
    margin-left: 30rpx;
    padding-right: 30rpx;
    height: 88rpx;
    border-bottom: 2rpx solid $spLine-color;
    span {
      font-size: 28rpx;
      color: $textBlack-color;
      width: 160rpx;
    }
    input {
      flex: 1;
    }
  }
  .sex {
    display: flex;
    align-items: center;
    margin-left: 30rpx;
    padding-right: 30rpx;
    height: 88rpx;
    border-bottom: 2rpx solid $spLine-color;
    span {
      font-size: 28rpx;
      color: $textBlack-color;
      width: 160rpx;
    }
  }
  .phone {
    display: flex;
    align-items: center;
    margin-left: 30rpx;
    padding-right: 30rpx;
    height: 100rpx;
    border-bottom: 2rpx solid $spLine-color;
    span {
      font-size: 28rpx;
      color: $textBlack-color;
      width: 160rpx;
    }
    input {
      flex: 1;
    }
  }
  .address {
    display: flex;
    align-items: center;
    margin-left: 30rpx;
    padding-right: 30rpx;
    height: 88rpx;
    border-bottom: 2rpx solid $spLine-color;
    .l {
      font-size: 28rpx;
      color: $textBlack-color;
      width: 160rpx;
    }
    .m {
      display: flex;
      flex: 1;
      i {
        font-size: 38rpx;
        color: $textGray-color;
      }
      span {
        font-size: 24rpx;
        color: $textDarkGray-color;
        margin-left: 10rpx;
        margin-top: 10rpx;
      }
    }
    .r {
      i {
        font-size: 28rpx;
        color: $textGray-color;
      }
    }
  }
  .house-num {
    display: flex;
    align-items: center;
    margin-left: 30rpx;
    padding-right: 30rpx;
    height: 88rpx;
    border-bottom: 2rpx solid $spLine-color;
    span {
      font-size: 28rpx;
      color: $textBlack-color;
      width: 160rpx;
    }
    input {
      flex: 1;
    }
  }
  .submit {
    width: 100%;
    margin: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 76rpx;
    border-radius: 8rpx;
    span {
      font-size: 28rpx;
      width: 50%;
      color: $textBlack-color;
    }
  }
}
</style>
