// pages/album_detail/album_detail.js
const app =getApp();
function load_album_posts(album_id,minepage){
  wx.request({
    url: 'https://catme.ren/app/load_album_posts', 
    method:'POST',
    data: {
      'album_id': album_id,
      
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success (res) {
      
      if(res.data.status == 1){
        console.log('setting scrolls')

        minepage.setData({
          scroll_even:res.data.posts_even,
          scroll_odd:res.data.posts_odd,
        });
        console.log('setting scrolls over, new data:|||')
        console.log(minepage.data)
        console.log('load_album_posts request over__________________________________________________')
      }
     
    }
  })  ;
  
};
Page({

  /**
   * Page initial data
   */
  data: {
    album_id:'',
    album_name:'',
    album_description:'',
    album_owner_id:'',
    
    scroll_even:[],
    scroll_odd:[],
  },

  /**
   * Lifecycle function--Called when page load
   */
  new_post: function(){
    let albumid = this.data.album_id;

    console.log(this.data.album_id+ 'uploading   album id___________________________________________'+ albumid)
    wx.chooseImage({
      count: 10,
      //type: 'image',
      success (res) {
        const tempFilePaths = res.tempFilePaths;
        let image_amount = tempFilePaths.length;
        let timestamp = Date.parse(new Date());
        let userid = app.globalData.user_id;
        let album_id = albumid;
        console.log(image_amount + ' image chosen');
        console.log('The timestamp is :' + timestamp);
        for (let i = 0; i < image_amount; i++){
          
          console.log(app.globalData.user_icon+'-----current icon');
          console.log(app.globalData.user_id+'current id');
          wx.uploadFile({
            url: 'https://catme.ren/app/uploadposts',  //仅为示例，非真实的接口地址 
            
            filePath: tempFilePaths[i],
            
            name: 'file',
            formData: {
              'album_id':album_id,
              'user': 'test',
              'newname': timestamp+'_ordinal_' + i,
              'user_id':userid
              
            },
            success (res){
              //console.log(tempFilePaths[i]);
              const data = res.data;
              console.log('below is post name________________________________________');
              console.log(data);
              console.log('above is res________________________________________');

              
              
              //do something
            }
          })
        }
        
      }
    })
  },
  onLoad: function (options) {
     console.log("album_idid: "+options.albumid);
     console.log("album_name: "+options.albumname);
     console.log("des: "+options.albumdes);
     console.log("owner_id: "+options.albumowner);
    this.setData({
      album_id:options.albumid,
      album_name:options.albumname,
      album_description:options.albumdes,
      album_owner_id:options.albumowner,
      
    });
    console.log('chuancanshugei if' + options.albumid )
    load_album_posts(options.albumid,this);
    
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