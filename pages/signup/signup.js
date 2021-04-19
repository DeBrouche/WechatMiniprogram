// pages/signup/signup.js
const app = getApp();
Page({

  /**
   * Page initial data
   */
  data: {
    
  },
  formSubmit: function(e) {
    console.log("button pressed___________________________");
    console.log(app.globalData.user_openid);
    console.log('注册的表格form发生了submit事件，携带数据为：', e.detail);
   
    let signupinfo = {
      nickname : e.detail.value.nickname,
      password : e.detail.value.password,
      phone : e.detail.value.phone,
      mail : e.detail.value.mail,
      openid:app.globalData.user_openid,
      id:Date.parse(new Date())
    };
    console.log(signupinfo);
    
    wx.request({
      url: 'https://catme.ren/app/sign_up', 
      method:'POST',
      data: {
        'nickname': signupinfo.nickname,
        'mail':signupinfo.mail,
        'phone':signupinfo.phone,
        'password':  signupinfo.password,
        'openid':signupinfo.openid,
        'id':signupinfo.id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        
        if(res.data.status == 1){ //注册成功，返回到信息
          console.log('注册成功'+res.data)
          
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