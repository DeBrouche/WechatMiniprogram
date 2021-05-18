// pages/home/home.js
function load_home(minepage){
  wx.request({
    url: 'https://catme.ren/app/load_home', 
    method:'POST',
    data: {
      'home_id': 'what_home',
      
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
    tiles:[],
    scroll_even:[],
    scroll_odd:[],
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    load_home(this);
    /*
    this.setData(
      {
        tiles:[{cat_name:"Baba",location:"Yantai",age:"A month",pic:"/images/over-a-month.jpg"},{cat_name:"Fufu",location:"Jinan",age:"Three months",pic:"/images/three-months.jpg"},{cat_name:"Fufu",location:"Linyi",age:"Nine months",pic:"/images/nine-months.jpg"},{cat_name:"Baba",location:"Yantai",age:"A month",pic:"/images/over-a-month.jpg"},{cat_name:"Fufu",location:"Jinan",age:"Three months",pic:"/images/three-months.jpg"},{cat_name:"Fufu",location:"Linyi",age:"Nine months",pic:"/images/nine-months.jpg"},{cat_name:"Baba",location:"Yantai",age:"A month",pic:"/images/over-a-month.jpg"},{cat_name:"Fufu",location:"Jinan",age:"Three months",pic:"/images/three-months.jpg"},{cat_name:"Fufu",location:"Linyi",age:"Nine months",pic:"/images/nine-months.jpg"}]
      }
    )*/




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