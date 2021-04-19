// pages/upload/upload.js
Page({
   
  /**
   * Page initial data
   */
  data: {
    
  },
  onclick_upload: function() {  //输出结果是：onclick1
  
      
      
    wx.chooseImage({
     // count: 100,
      success (res) {
        const tempFilePaths = res.tempFilePaths;
        let image_amount = tempFilePaths.length;
        let timestamp = Date.parse(new Date());
        console.log(image_amount + ' image chosen');
        console.log('The timestamp is :' + timestamp);
        for (let i = 0; i < image_amount; i++){
          wx.uploadFile({
            url: 'https://catme.ren/app/formdata',  //仅为示例，非真实的接口地址 
            filePath: tempFilePaths[i],
            
            name: 'file',
            formData: {
              'user': 'test',
              'newname': timestamp+'_ordinal_' + i,
              
            },
            success (res){
              //console.log(tempFilePaths[i]);
              const data = res.data;
              console.log(data);
              console.log('this is the '+ (i+1) +'th pic ');
  
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