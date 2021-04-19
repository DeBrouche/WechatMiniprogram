// pages/home/home.js
Page({

  /**
   * Page initial data
   */
  data: {
    tiles:[]
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

    this.setData(
      {
        tiles:[{cat_name:"Baba",location:"Yantai",age:"A month",pic:"/images/over-a-month.jpg"},{cat_name:"Fufu",location:"Jinan",age:"Three months",pic:"/images/three-months.jpg"},{cat_name:"Fufu",location:"Linyi",age:"Nine months",pic:"/images/nine-months.jpg"},{cat_name:"Baba",location:"Yantai",age:"A month",pic:"/images/over-a-month.jpg"},{cat_name:"Fufu",location:"Jinan",age:"Three months",pic:"/images/three-months.jpg"},{cat_name:"Fufu",location:"Linyi",age:"Nine months",pic:"/images/nine-months.jpg"},{cat_name:"Baba",location:"Yantai",age:"A month",pic:"/images/over-a-month.jpg"},{cat_name:"Fufu",location:"Jinan",age:"Three months",pic:"/images/three-months.jpg"},{cat_name:"Fufu",location:"Linyi",age:"Nine months",pic:"/images/nine-months.jpg"}]
      }
    )
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