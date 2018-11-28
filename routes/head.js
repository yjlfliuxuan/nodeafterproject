var express = require('express');
var async = require("async");
var qs=require("querystring");
var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
var url = "mongodb://127.0.0.1:27017";
var router = express.Router();
router.post("/login", function (req, res) {
    var uname = req.body.username;
    var pwd = req.body.password;
    if (!uname) {
      res.render("error", {
        message: "用户名不能为空",
        error: new Error("用户名不能为空")
      })
      return;
    }
    if (!pwd) {
      res.render("error", {
        message: "密码不能为空",
        error: new Error("密码不能为空")
      })
      return;
    }
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
        db.collection("user").find({//通过用户输入的用户名和密码在数据库中查找信息
          username: uname,
          password: pwd
        }).toArray(function (err, data) {//data是一个数组
          if (err) {
            console.log("查询失败", err);
            res.render("error", {
              message: "查询失败",
              error: err
            })
          } else if (data.length <= 0) {
            res.render("error", {
              message: "登录失败",
              error: new Error("登录失败")
            })
          } else {
           res.render("head",{
               listarr:data
           })        
          }
          client.close();
        })
      }
    })
  })

module.exports = router;