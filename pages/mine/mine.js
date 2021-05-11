// pages/mine/mine.js
const app = getApp();

function checkopenidstatus(minepage){
  
  if(app.globalData.user_status==0){
    //openid未绑定到账号 转至登录页面
    console.log("//openid未绑定到账号 转至登录页面")
   wx.navigateTo({
     url: '../login/login'　　// 页面 A
   })
  }else{
    console.log("加载用户数据————————————————————————————————————————————————————————————————————————————")
    
    minepage.setData(
     
     {
       user:{
         id:app.globalData.user_id,
         icon:"https://www.catme.ren/user_icon/"+app.globalData.user_icon,
         nickname:app.globalData.user_nickname ,
         mail:app.globalData.user_mail ,
         post:app.globalData.user_post,
         fav:app.globalData.user_fav,
         collect:app.globalData.user_collect,
         followed:app.globalData.user_followed}
       
     }
   )
   console.log(minepage.data.user);
  }
};
function load_albums(minepage){
  //请求相册数据
  let user_id = app.globalData.user_id;
    wx.request({
      url: 'https://catme.ren/app/get_albums', 
      method:'POST',
      data: {
        'user_id': user_id,
        
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log('res:____' + res.data.albums[0].id)
        let request_albums = []
        request_albums =  res.data.albums

        minepage.setData(
     
          {
            
            albums:request_albums
          }
        )
        let album_length = request_albums.length;
        for(let i=0; i< album_length;i++){
          console.log("the "+(i+1)+" th album name: "+ request_albums[i].name)
        }
      }
    })

};
Page({

  /**
   * Page initial data
   */
  data: {
      user:{icon:'https://www.catme.ren/user_icon/icon.jpeg',
      nickname:'unlogged',
      mail:'unlogged',
      post:'-1',
      fav:'-1',
      collect:'-1',
      followed:'-1'},
      albums:[]
  },
  logout: function(){
    app.globalData.user_status = 0;
    this.setData(
     
      {
        user:{
          id:0,
          icon:'https://www.catme.ren/user_icon/icon.jpeg',
          nickname:'unlogged',
          mail:'unlogged',
          post:'-1',
          fav:'-1',
          collect:'-1',
          followed:'-1'},
          albums:{}
      }
    )
  },
  login: function(){
    wx.navigateTo({
      url: '../login/login'　　// 页面 A
    })

  },
  changeicon:function() {  //输出结果是：onclick1
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
           url: 'https://catme.ren/app/upload_posts',  //仅为示例，非真实的接口地址 
           
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
    let minepage = this;
    checkopenidstatus(minepage);
    load_albums(minepage);
   
    
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
    let minepage = this;
    checkopenidstatus(minepage);
    load_albums(minepage)
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