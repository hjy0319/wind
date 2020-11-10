var wxCharts = require('../../utils/wxcharts.js');
var app = getApp();
var lineChart = null;
var columnChart = null;
var pieChart = null;
Page({
    data: {
        needReload: true,
        lineIcon: 'homeGL.png',
        columnIcon: 'mine.png',
        pieIcon: 'task.png',
        showLineFlag: true,
        showColumnFlag: false,
        showPieFlag: false
    },
    touchHandler: function (e) {
        lineChart.showToolTip(e, {
            // background: '#7cb5ec',
            format: function (item, category) {
                return item.name.substring(0, 1) + category + ': ' + item.data + ' kg'
            }
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (app.checkLogin(app.globalData.userInfo)) {
            this.init('');
            this.setData({
                needReload: false
            });
        } else {
            this.setData({
                needReload: true
            });
        }
    },

    onShow: function (e) {
        if (app.checkLogin(app.globalData.userInfo) && this.data.needReload) {
            this.init('');
            this.setData({
                needReload: false
            });
        }
    },
    init: function (date) {
        var that = this;
        app.wxRequest('GET', '/task/statistics?userCode=' + app.globalData.userCode + '&taskDate=' + date, null, (res) => {
            if (res.status == 'success') {
                if (res.data != null) {

                    that.initLines(
                        that.getWeekWeights(res.data.currentWeekTask),
                        that.getWeekWeights(res.data.lastWeekTask),
                        res.data.currentWeekDateRange,
                        res.data.lastWeekDateRange);

                    that.initColumns(
                        that.getWeekIncome(res.data.currentWeekTask),
                        that.getWeekFine(res.data.currentWeekTask),
                        res.data.categories);

                    that.initPie(res.data.weekIncome.weekIncome,
                        res.data.weekIncome.persevereReward,
                        res.data.weekIncome.progressReward,
                        res.data.weekIncome.weekFine);

                }
            }
        }, (err) => {
            app.wxShowToast('服务器已关闭', 'none', 2000);
        });
    },
    initLines: function (currentWeekWeight, lastWeekWeight, currentWeekDateRange, lastWeekDateRange) {
        var windowWidth = 320;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }
        lineChart = new wxCharts({
            canvasId: 'lineCanvas',
            type: 'line',
            // categories: ['一(5&28)', '二(6&29)', '三(7&30)', '四(8&1)', '五(9&2)', '六(10&3)', '日(11&4)'],
            categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            animation: true,
            // background: '#f5f5f5',
            series: [{
                name: '本周(' + currentWeekDateRange + ')' ,
                data: currentWeekWeight,

            }, {
                name: '上周(' + lastWeekDateRange + ')',
                data: lastWeekWeight,

            }],
            xAxis: {
                disableGrid: true
            },
            yAxis: {

                disabled: false,
                min: 55
            },
            width: windowWidth,
            height: 200,
            dataLabel: false,
            dataPointShape: true,
            extra: {
                lineStyle: 'curve'
            }
        });
    },

    initColumns: function (currentWeekIncome, currentWeekFine, categories) {
        console.log(categories);
        if (categories == undefined) {
            categories = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        }
        var windowWidth = 320;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }

        columnChart = new wxCharts({
            canvasId: 'columnCanvas',
            type: 'column',
            animation: true,
            categories: categories,
            series: [{
                    name: '收入',
                    data: currentWeekIncome
                },
                {
                    name: '罚款',
                    data: currentWeekFine
                }
            ],
            yAxis: {
                format: function (val) {
                    return val;
                },
                min: 0
            },
            xAxis: {
                disableGrid: false,
                type: 'calibration'
            },
            extra: {
                column: {
                    width: 20
                }
            },
            width: windowWidth,
            height: 200,
        });
    },
    initPie: function (weekIncome, persevereReward, progressReward, weekFine) {
        var windowWidth = 320;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }

        pieChart = new wxCharts({
            animation: true,
            canvasId: 'pieCanvas',
            type: 'pie',
            series: [{
                name: '基本收入 ' + weekIncome,
                data: weekIncome,
                color: '#BA55D3'
            }, {
                name: '全勤奖 ' + persevereReward,
                data: persevereReward,
                color: 'gold'
            }, {
                name: '进步奖 ' + progressReward,
                data: progressReward,
                color: '#FFA500'
            }, {
                name: '罚款 ' + weekFine,
                data: weekFine,
                color: '#DC143C'
            }],
            width: windowWidth,
            height: 255,
            dataLabel: true,
        });
    },
    getWeekWeights: function (a) {
        if (a == null || a == 'undefined' || a.length == 0) {
            return ['', null, null, null, null, null, null];
        }
        var w = [];
        for (var i = 0; i < 7; i++) {
            if (a.length <= i) {
                w[i] = null;
            } else {
                w[i] = a[i].weight;
            }
        }
        return w;
    },

    getWeekIncome: function (a) {

        var w = [0];
        for (var i = 0; i < 7; i++) {
            if (a == null || a.length <= i) {
                return w;
            } else {
                w[i] = a[i].income;
            }
        }
        return w;
    },
    getWeekFine: function (a) {

        var w = [0];
        for (var i = 0; i < 7; i++) {
            if (a == null || a.length <= i) {
                return w;
            } else {
                w[i] = a[i].fine;
            }
        }
        return w;
    },
    finishLineData: function (a) {
        if (a == null) {
            return a;
        }
        var s = a.length;
        var r = 7 - a.length;
        for (var i = 0; i < r; i++) {
            a[s + i] = null;
        }
        return a;
    },
    bindDateChange: function (e) {
        this.setData({
            date: e.detail.value
        });
        this.init(e.detail.value);
    },
    showLine: function () {
        this.setData({
            showLineFlag: true,
            showColumnFlag: false,
            showPieFlag: false
        });
    },
    showColumn: function () {
        this.setData({
            showLineFlag: false,
            showColumnFlag: true,
            showPieFlag: false
        });
    },
    showPie: function () {
        this.setData({
            showLineFlag: false,
            showColumnFlag: false,
            showPieFlag: true
        });
    }

});