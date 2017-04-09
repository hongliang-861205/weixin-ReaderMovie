var utils = require("../../utils/utils.js");
var app = getApp();

Page({
  data: {
    in_theater: {},
    coming_soon: {},
    top250: {},
    searchbar_value: "",
    totalCount: 0,
    containerShow: true,
    searchPanelShow: false,
    isEmpty: true,
    movies: {}
  },

  onMoreTap: function(event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: '/pages/movies/more-movies/more-movies?category=' + category
    });
  },

  onLoad: function () {
    var movie_host = app.globalData.g_moviehost;
    var in_theaters_url = movie_host + "/v2/movie/in_theaters?start=0&count=3";
    var coming_soon_url = movie_host + "/v2/movie/coming_soon?start=0&count=3";
    var top250_url = movie_host + "/v2/movie/top250?start=0&count=3";

    this.getMovieListData(in_theaters_url, "in_theater", "正在热映");
    this.getMovieListData(coming_soon_url, "coming_soon", "即将上映");
    this.getMovieListData(top250_url, "top250", "豆瓣Top250");
    
    wx.showNavigationBarLoading();
  },

  onBindFocus: function(event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    });
  },

  onImageTap: function(event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      movies: {},
      isEmpty: true
    });
  },

  onBindConfirm: function(event) {
    var value = event.detail.value;
    this.setData({
      searchbar_value: value,
      movies: {},
      isEmpty: true
    });
    var search_url =  app.globalData.g_moviehost + "/v2/movie/search?q=" + value;
    utils.http(search_url,this.processSearchMovies);
    wx.showNavigationBarLoading();
  },

  onScrollToLower: function(event) {
    var searchValue = this.data.searchbar_value;
    var nexturl = app.globalData.g_moviehost + "/v2/movie/search?q=" + searchValue + "&start=" + this.data.totalCount + "&count=20";
    utils.http(nexturl, this.processSearchMovies);
    wx.showNavigationBarLoading();
  },

  onMovieTap: function(event) {
    var movieId = event.currentTarget.dataset.movieId;
    wx.navigateTo({
      url: '/pages/movies/movie-detail/movie-detail?id=' + movieId,
    });
  },

  getMovieListData: function(url, settedKey, categoryTitle) {
    var that = this;
    wx.request({
      url: url,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { "content-type": "json" }, // 设置请求的 header
      success: function (res) {
        // success
        console.log(res.data);
        that.processDoubanMovies(res.data, settedKey, categoryTitle);
        
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    });
  },

  processSearchMovies: function(doubanMovie) {
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
        stars: utils.convertStarsToArray(subject.rating.stars)
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

  processDoubanMovies: function(doubanMovie, settedKey, categoryTitle) {
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
        stars: utils.convertStarsToArray(subject.rating.stars)
      };

      movies.push(temp);
    }

    var readyData = {};
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    };
    
    this.setData(readyData);
    wx.hideNavigationBarLoading();
  }
})