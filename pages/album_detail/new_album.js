// pages/album_detail/new_album.js
const app = getApp();
Page({

  /**
   * Page initial data
   */
  data: {

  },
   //表单提交
   formSubmit: function(e) {
    console.log("fom submit button pressed___________________________");
    console.log(this.data);
    console.log('form发生了submit事件，携带数据为：', e.detail);
    let timestamp = Date.parse(new Date())/1000;
    let user_id = app.globalData.user_id;
    let album_info = {
      album_name:e.detail.value.album_name,
      album_description:e.detail.value.album_description,
      album_id: timestamp,
      user_id: user_id
    }
    wx.request({
      //url: 'https://catme.ren/app/login', 
      url:'https://catme.ren/app/new_album', 
      method:'POST',
      data: {
        'id':album_info.album_id,
        'name': album_info.album_name,
        'description':album_info.album_description,
        'user_id':  album_info.user_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        
        if(res.data.status == 1){ //创建成功
          console.log("album_created:_____________________________________________________")
          console.log(res.data)

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