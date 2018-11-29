var express = require('express');
var async = require("async");
var qs = require("querystring");
var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
var url = "mongodb://127.0.0.1:27017";
var router = express.Router();
/* GET users listing.  localhost:3000/brandnoadmin */
router.get('/', function (req, res, next) {
    var page = Number(req.query.page) || 1; //页码
    var pageSize = Number(req.query.pageSize) || 2; //每页显示条数
    var totalSize = 0; //总的条数
    var nickname = req.cookies.nickname;
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        if (err) {
            console.log("链接数据库失败", err);
            res.render("error", {
                message: "链接数据库失败",
                error: err
            })
            return;
        } else {
            var db = client.db("nodeafterproject");
            async.series([
                function (cb) {
                    db.collection("brand").find().count(function (err, num) {
                        if (err) {
                            cb(err);
                        } else {
                            totalSize = num;
                            cb(null);
                        }
                    })
                },
                function (cb) {
                    db.collection("brand").find().limit(pageSize).skip(page * pageSize - pageSize).toArray(
                        function (err, data) {
                            if (err) {
                                cb(err);
                            } else {
                                cb(null, data);
                            }
                        }
                    )
                }
            ], function (err, result) {
                if (err) {
                    res.render("error", {
                        message: "错误",
                        error: err
                    })
                } else {
                    var totalPage = Math.ceil(totalSize / pageSize); // 总页数
                    res.render("brandnoadmin", { //result:  [undefined,data]
                        list: result[1],
                        nickname:nickname,
                        totalPage: totalPage,
                        pageSize: pageSize,
                        currentPage: page
                    })
                }
                client.close();
            })
        }
    })
})
router.get("/delete", function (req, res) {
    var id = req.query.id;
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        if (err) {
            console.log("链接数据库失败", err);
            res.render("error", {
                message: "链接数据库失败",
                error: err
            })
            return;
        } else {
            var db = client.db("nodeafterproject");
            db.collection("brand").deleteOne({
                _id: ObjectId(id)
            }, function (err) {
                if (err) {
                    res.render("error", {
                        message: "删除失败",
                        error: err
                    })
                } else {
                    res.redirect("/brandnoadmin");
                }
                client.close();
            })
        }
    })
})
router.get('/exit', function(req, res, next) {
    res.cookie("nickname", "", {
      //过期时间
      maxAge: 0
    })
     res.redirect("/");
  });
module.exports = router;