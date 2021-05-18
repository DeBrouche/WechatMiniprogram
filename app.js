// app.js

App({
  globalData: {
    
                                    
  },
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    // 登录
    
    wx.login({
      success: res => {
       
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res.code)
       
        wx.request({
          url: 'https://catme.ren/app/getopenid', 
          method:'POST',
          data: {
            'code': res.code,
            
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success (res) {
            let app = getApp();
            if(res.data.status == 1){//查找到openid相应账号
              console.log(res.data)
              
              app.globalData.user_status = 1;
              app.globalData.user_openid = res.data.openid;
              app.globalData.user_id = res.data.id;
              app.globalData.user_nickname = res.data.nickname;
              app.globalData.user_mail = res.data.mail;
              app.globalData.user_post = res.data.user_post;
              app.globalData.user_fav = res.data.user_fav;
              app.globalData.user_collect = res.data.user_collect;
              app.globalData.user_followed = res.data.user_followed;
              app.globalData.user_icon = res.data.user_icon;
              console.log('global data written!!on wx_login app_launch____________________-')
              console.log(app.globalData)
            }else{ //该openid无账号关联
              console.log(getApp().globalData);
              app.globalData.user_openid = res.data.openid;
              app.globalData.user_status=0;
              console.log("openid "+  app.globalData.user_openid +" not written")

            }
            
                       
                        

                       
          }
        })
      }
    })

    
  }
  
})

