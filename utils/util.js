// function formatTime(time) {
//   if (typeof time !== 'number' || time < 0) {
//     return time
//   }

//   var hour = parseInt(time / 3600)
//   time = time % 3600
//   var minute = parseInt(time / 60)
//   time = time % 60
//   // 这里秒钟也取整
//   var second = parseInt(time)

//   return ([hour, minute, second]).map(function (n) {
//     n = n.toString()
//     return n[1] ? n : '0' + n
//   }).join(':')
// }

// let API_HOST = "http://xxx.com/xxx";
// let DEBUG = false;
// var Mock = require("./mock.js");
// function ajax(data = '', fn, method = "get", header = {}) {
//     if (!DEBUG) {
//         wx.request({
//             url: API_HOST + data,
//             method: method ? method : 'get',
//             data: {},
//             header: header ? header : { "Content-Type": "application/json" },
//             success: function (res) {
//                 fn(res);
//             }
//         });
//     } else {
//         // 模拟数据
//         var res = Mock.mock({
//             // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
//             'list|1-10': [{
//                 // 属性 id 是一个自增数，起始值为 1，每次增 1
//                 'id|+1': 1
//             }]
//         })
//         // 输出结果
//         console.log(JSON.stringify(res, null, 4))
//         fn(res);

//     }
// }

// module.exports = {
//     ajax: ajax,
//     formatTime: formatTime
// }
const apiUrl = '';
function getStorage(key) {
    return new Promise(function (resolve, reject) {
        wx.getStorage({
            key: key,
            success: function (res) {
                resolve(res.data);
            },
            fail: function (res) {
                if (res.errMsg == 'getStorage:fail data not found') {
                    resolve(null);
                } else {
                    reject(res.errMsg);
                }
            },
        });
    })
};
function setStorage(key, value) {
    return new Promise(function (resolve, reject) {
        wx.setStorage({
            key: key,
            data: value,
            success: function (res) {
                // TODO: 不知道返回什么
                resolve(res.data);
            },
            fail: function (res) {
                reject(res.errMsg);
            },
        })
    })
};
function checkSession() {
    return new Promise(function (resolve, reject) {
        wx.checkSession({
            success: function () {
                resolve(true);
            },
            fail: function () {
                resolve(false);
            },
        });
    })
}
function login() {
    return new Promise(function (resolve, reject) {
        wx.login({
            success: function (res) {
                resolve(res);
            },
            fail: function (res) {
                reject(res.errMsg);
            },
        });
    })
}

function request() {
    return getStorage('cookie')
        // 请求数据
        .then(function (cookie) {
            return new Promise(function (resolve, reject) {
                // 请求api时带上cookie
                wx.request({
                    url: `${apiUrl}${url}`,
                    data: data,
                    method: method,
                    header: {
                        cookie: cookie, // 可能没有数据
                    },
                    success: function (res) {
                        console.log("success", method);
                        // 弹窗提示错误
                        if (res.data.status !== 0) {
                            wx.showToast({
                                title: res.data.message ? res.data.message : 'error',
                                duration: 2000,
                            });
                        } else {
                            resolve(res);
                        }
                    },
                    fail: function (res) {
                        console.log(res, '错误数据');
                        reject(res);
                    },
                });
            })
        })
        .then(function (res) {
            return setStorage('cookie', response.header['Set-Cookie'].split(';')[0])
                .then(function () {
                    return response;
                })
        })
        .catch(function (errMes) {
            wx.showToast({
                title: errMsg || 'error',
                duration: 2000,
            });

        })
};
function getData(url, data, method) {
    return request(url, data, method)
        .then(function (response) {
            return response.data;
        })
};
exports.request = request;
exports.getData = getData;
exports.apiUrl = apiUrl;
exports.checkSession = checkSession;
exports.login = login;
exports.getUserInfo = getUserInfo;