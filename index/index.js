// require('../step/step.js');
Page({
    data: {
         tabMes: ['付押金', '无押金', '天数榜'],
         tabIndex: 0,
    },
    tapName: function(event) {
        this.setData({
           tabIndex: event.currentTarget.dataset.alphaBeta
        })
    },
})