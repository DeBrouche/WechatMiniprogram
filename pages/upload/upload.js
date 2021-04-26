// pages/upload/upload.js
const app = getApp();
Page({
   
  /**
   * Page initial data
   */
  data: {
    
  },
  upload_image: function() {  //输出结果是：onclick1
     wx.chooseImage({
      count: 1,
      //type: 'image',
      success (res) {
        const tempFilePaths = res.tempFilePaths;
        let image_amount = tempFilePaths.length;
        let timestamp = Date.parse(new Date());
        let userid = app.globalData.user_id;
        console.log(image_amount + ' image chosen');
        console.log('The timestamp is :' + timestamp);
        for (let i = 0; i < image_amount; i++){
          
          console.log(app.globalData.user_icon+'-----current icon');
          console.log(app.globalData.user_id+'current id');
          wx.uploadFile({
            url: 'https://catme.ren/app/uploadicon',  //仅为示例，非真实的接口地址 
            
            filePath: tempFilePaths[i],
            
            name: 'file',
            formData: {
              'user': 'test',
              'newname': timestamp+'_ordinal_' + i,
              'user_id':userid
              
            },
            success (res){
              //console.log(tempFilePaths[i]);
              const data = res.data;
              console.log('below is res________________________________________');
              console.log(res);
              console.log('above is res________________________________________');

              app.globalData.user_icon = data
              console.log(app.globalData.user_icon+'current icon');
              //do something
            }
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