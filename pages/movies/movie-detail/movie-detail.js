// pages/movies/movie-detail/movie-detail.js
var app = getApp();
var util = require('../../../utils/utils.js');

Page({
  data: {
    movie: {}
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var movieId = options.id;
    var movieUrl = app.globalData.g_moviehost + "/v2/movie/subject/" + movieId;
    util.http(movieUrl, this.processMovieData);
  },

  processMovieData: function (data) {
    if(!data) {
      return;
    }
    var director = {
      avatar: "",
      name: "",
      id: ""
    };
    if (data.directors[0] != null) {
      if (data.directors[0].avatars != null) {
        director.avatar = data.directors[0].avatars.large
      }
      director.name = data.directors[0].name;
      director.id = data.directors[0].id;
    }
    var movie = {
      movieImg: data.images ? data.images.large : "",
      country: data.countries[0],
      title: data.title,
      originalTitle: data.original_title,
      wishCount: data.wish_count,
      commentCount: data.comments_count,
      year: data.year,
      generes: data.genres.join("、"),
      stars: util.convertStarsToArray(data.rating.stars),
      score: data.rating.average,
      director: director,
      casts: util.convertToCastString(data.casts),
      castsInfo: util.convertToCastInfos(data.casts),
      summary: data.summary
    }
    this.setData({
      movie: movie
    })
  },

  viewMoviePostImg: function(event) {
    var postSrc = event.currentTarget.dataset.src;
    wx.previewImage({
       current: postSrc, // 当前显示图片的链接，不填则默认为 urls 的第一张
      urls: [postSrc]
    });
  },

  onReady: function () {
    // 页面渲染完成
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