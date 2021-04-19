// pages/login/login.js
const app = getApp();
Page({

  /**
   * Page initial data
   */
  data: {
    
  },
  //表单提交
  formSubmit: function(e) {
    console.log("button pressed___________________________");
    console.log(this.data);
    console.log('form发生了submit事件，携带数据为：', e.detail);
    
    let logininfo = {
      account:e.detail.value.account,
      password:e.detail.value.password
    }
    wx.request({
      url: 'https://catme.ren/app/login', 
      method:'POST',
      data: {
        'account': logininfo.account,
        'password':logininfo.password,
        'openid':  app.globalData.user_openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        
        if(res.data.status == 1){ //account已注册，查找到信息
          console.log(res.data)
          
          app.globalData.user_status = 1;
          
          app.globalData.user_id = res.data.id;
          app.globalData.user_nickname = res.data.nickname;
          app.globalData.user_mail = res.data.mail;
          app.globalData.user_post = res.data.user_post;
          app.globalData.user_fav = res.data.user_fav;
          app.globalData.user_collect = res.data.user_collect;
          app.globalData.user_followed = res.data.user_followed;
          app.globalData.user_icon = res.data.user_icon;
          console.log('global data written!!____________________-')
          console.log(app.globalData)
          wx.switchTab({url:'../mine/mine'})//返回个人页面
          //wx.navigateTo({
          //  url: '../mine/mine'　　// 页面 A
          //})
        }else{  //该账号未注册
          wx.navigateTo({ //转到注册页面 
            url: '../signup/signup'　　// 页面 A
          })
        }
        
                   
                    

                   
      }
    })
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

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