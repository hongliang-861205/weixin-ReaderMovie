// pages/movies/more-movies/more-movies.js
var app = getApp();
var util = require('../../../utils/utils.js');

Page({
  data: {
    movies: {},
    navgetorTitle: "",
    requestUrl: "",
    totalCount: 0,
    isEmpty: true
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var category = options.category;
    var movie_host = app.globalData.g_moviehost;
    var dataUrl = "";
    this.setData({
      "navgetorTitle": category
    })
    switch (category) {
      case "正在热映":
        dataUrl = movie_host + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = movie_host + "/v2/movie/coming_soon";
        break;
      case "豆瓣Top250":
        dataUrl = movie_host + "/v2/movie/top250";
        break;
    }
    this.data.requestUrl = dataUrl;
    util.http(dataUrl, this.processDoubanMovies);
    wx.showNavigationBarLoading();
  },

  onMovieTap: function(event) {
    var movieId = event.currentTarget.dataset.movieId;
    wx.navigateTo({
      url: '/pages/movies/movie-detail/movie-detail?id=' + movieId,
    });
  },

  processDoubanMovies: function(doubanMovie) {
    var movies = [];

    for(var indx in doubanMovie.subjects) {
      var subject = doubanMovie.subjects[indx];
      var title = subject.title;
      if(title.length > 6) {
        title = title.substring(0,6) + "...";
      }

      var temp = {
        title: title,
        coverageUrl: subject.images.large,
        average: subject.rating.average,
        movieId: subject.id,
        stars: util.convertStarsToArray(subject.rating.stars)
      };

      movies.push(temp);
    }

    var totalMovies = {};
    if(!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    } else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }

    this.setData({
      movies: totalMovies,
    })
    this.data.totalCount += 20;
    
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  onScrollToLower: function(event) {
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanMovies);
    wx.showNavigationBarLoading();
  },

  onPullDownRefresh: function(event) {
    var refreshUrl = this.data.requestUrl + "?start=0&count=20";
    this.data.movies = {};
    this.data.isEmpty = true;
    this.data.totalCount = 0;
    util.http(refreshUrl, this.processDoubanMovies);
    wx.showNavigationBarLoading();
  },

  onReady: function () {
    // 页面渲染完成
    wx.setNavigationBarTitle({
      title: this.data.navgetorTitle,
      success: function (res) {
        // success
      }
    })
  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})