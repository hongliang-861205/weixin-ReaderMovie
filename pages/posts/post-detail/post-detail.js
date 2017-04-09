var postsData = require("../../../data/posts-data.js");
var app = getApp();

Page({
  data: {

  },

  onCollectedTap: function (event) {
    var postsCollected = wx.getStorageSync('collected_post');
    var postCollected = postsCollected[this.data.currentPostId];
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    this.showToast(postsCollected, postCollected);
  },

  showModal: function (postsCollected, postCollected) {
    var that = this;
    wx.showModal({
      title: "收藏",
      content: postCollected ? "收藏该文章？" : "取消收藏该文章？",
      showCancel: true,
      cancelText: "取消",
      confirmText: "确认",
      success: function (res) {
        if (res.confirm) {
          wx.setStorageSync('collected_post', postsCollected);
          that.setData({
            collected: postCollected
          });
        }
      }
    })
  },

  showToast: function (postsCollected, postCollected) {
    wx.setStorageSync('collected_post', postsCollected);
    this.setData({
      collected: postCollected
    });
    wx.showToast({
      title: postCollected ? "收藏成功" : "取消成功"
    });
  },

  onMusicTap: function (event) {
    var isPlayingMusic = this.data.isPlayingMusic;
    var postData = postsData.postlist[this.data.currentPostId];
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      });
    } else {
      wx.playBackgroundAudio({
        dataUrl: postData.music.url,
        title: postData.music.title,
        coverImgUrl: postData.music.coverImg
      });
      this.setData({
        isPlayingMusic: true
      });
    }
  },

  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    var postId = options.id;
    this.setData({ currentPostId: postId });
    var postData = postsData.postlist[postId];
    this.setData({ postData: postData });

    var postsCollected = wx.getStorageSync('collected_post');
    if (postsCollected) {
      var postCollected = postsCollected[postId];
      this.setData({
        collected: postCollected
      });
    } else {
      var postsCollected = {};
      this.setData({
        collected: false
      });
      wx.setStorageSync('collected_post', postsCollected);
    }

    if(app.globalData.g_isPlayingMusic && app.globalData.g_currentPostId === postId){
      this.setData({
        isPlayingMusic:true
      })
    }

    this.onMusicMonitor();
  },

  onMusicMonitor: function () {
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      // callback
      that.setData({
        isPlayingMusic: true
      });
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currentPostId = this.data.currentPostId;
    });

    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false
      });
      app.globalData.g_isPlayingMusic = false;
    });

    wx.onBackgroundAudioStop(function() {
      that.setData({
        isPlayingMusic: false
      });
      app.globalData.g_isPlayingMusic = false;
    })
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    // 生命周期函数--监听页面显示

  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  }
})