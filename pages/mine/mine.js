// pages/mine/mine.js
const app = getApp();
Page({

  /**
   * Page initial data
   */
  data: {
      user:{},
      albums:{}
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
   if(app.globalData.user_status==0){
     //openid未绑定到账号 转至登录页面
    wx.navigateTo({
      url: '../login/login'　　// 页面 A
    })
   }else{
     console.log("加载用户数据————————————————————————————————————————————————————————————————————————————")
    this.setData(
      
      {
        user:{
          id:app.globalData.user_id,
          icon:"https://www.catme.ren/user_icon/"+app.globalData.user_icon,
          nickname:app.globalData.user_nickname ,
          mail:app.globalData.user_mail ,
          post:app.globalData.user_post,
          fav:app.globalData.user_fav,
          collect:app.globalData.user_collect,
          followed:app.globalData.user_followed},
        albums:[{},{},{},{},{},{},{},{},{}]
      }
    )
    console.log(this.data.user);
   }
    
    //console.log(this);
    
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    if(app.globalData.user_status==0){
      //openid未绑定到账号 转至登录页面
     wx.navigateTo({
       url: '../login/login'　　// 页面 A
     })
    }else{
      console.log("加载用户数据————————————————————————————————————————————————————————————————————————————")
     this.setData(
       
       {
         user:{
           id:app.globalData.user_id,
           icon:"https://www.catme.ren/user_icon/"+app.globalData.user_icon,
           nickname:app.globalData.user_nickname ,
           mail:app.globalData.user_mail ,
           post:app.globalData.user_post,
           fav:app.globalData.user_fav,
           collect:app.globalData.user_collect,
           followed:app.globalData.user_followed},
         albums:[{},{},{},{},{},{},{},{},{}]
       }
     )
     console.log(this.data.user);
    }
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})