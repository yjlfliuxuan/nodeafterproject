var express = require('express');
var async = require("async");
var qs=require("querystring");
var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
var url = "mongodb://127.0.0.1:27017";
var router = express.Router();

/* GET users listing.  localhost:3000/users */
router.get('/', function (req, res, next) {
  var page = Number(req.query.page) || 1; //页码
  var pageSize = Number(req.query.pageSize) || 5; //每页显示条数
  var totalSize = 0; //总的条数
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
          db.collection("user").find().count(function (err, num) {
            if (err) {
              cb(err);
            } else {
              totalSize=num;
              cb(null);
            }
          })
        },
        function (cb) {
          db.collection("user").find().limit(pageSize).skip(page * pageSize - pageSize).toArray(
            function(err,data){
              if(err){
                cb(err);
              }else{
                cb(null,data);
              }
            }
          )
        }
      ], function (err, result) {
            if(err){
              res.render("error",{
                message:"错误",
                error:err
              })
            }else{
              var totalPage = Math.ceil(totalSize / pageSize); // 总页数
              res.render("users",{ //result:  [undefined,data]
                list:result[1],
                totalPage: totalPage,
                pageSize: pageSize,
                currentPage: page
              })
            } 
            client.close();  
      }) 
    }
  })
  // MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
  //   if (err) {
  //     console.log("链接数据库失败", err);
  //     res.render("error", {
  //       message: "链接数据库失败",
  //       error: err
  //     })
  //     return;
  //   } else {
  //     var db = client.db("nodeafterproject");
  //     db.collection("user").find().toArray(function (err, data) {
  //       if (err) {
  //         console.log("查询用户数据失败", err);
  //         res.render("error", {
  //           message: "查询用户数据失败",
  //           error: err
  //         })
  //       } else {
  //         console.log(data);
  //         res.render("users", {
  //           list: data
  //         });
  //       }
  //       client.close();
  //     });
  //   }
  // })
});
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
      //     db.collection("user").find({
      //       username:uname,
      //       password:pwd
      //     }).count(function(err,num){
      //       if(err){
      //         console.log("查询失败",err);
      //         res.render("error",{
      //           message:"查询失败",
      //           error:err
      //         })
      //       }else if(num>0){
      //           res.redirect("/");
      //       }else{
      //         res.render("error",{
      //           message:"登录失败",
      //           error:new Error("登录失败")
      //         })
      //       }
      //       client.close();
      //     })
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
          //登录成功将信息存入cookie
          var obj={
            nickname:data[0].nickname,
            username:data[0].username
          }
          var newobj=qs.stringify(obj);
          res.cookie("nickname", newobj, {
            //过期时间
            maxAge: 20 * 60 * 1000
          })
          res.redirect("/");         
        }
        client.close();
      })
    }
  })
})
router.post("/register", function (req, res) {
  var uname = req.body.username;
  var nickname = req.body.nickname;
  var pwd = req.body.password;
  var age = Number(req.body.age);
  var sex = req.body.sex;
  var isAdmin = req.body.isAdmin;
  var phone = req.body.phone;
  // console.log(uname,nickname,pwd,age,sex,isAdmin,phone);
  // res.send("");
  // MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
  //   if (err) {
  //     console.log("链接数据库失败", err);
  //     res.render("error", {
  //       message: "链接数据库失败",
  //       error: err
  //     })
  //     return;
  //   } else {
  //     var db = client.db("nodeafterproject");
  //     db.collection("user").insertOne({
  //       username:uname,
  //       nickname:nickname,
  //       password:pwd,
  //       age:age,
  //       sex:sex,
  //       isAdmin:isAdmin,
  //       phone:phone
  //     },function(err){
  //       if(err){
  //         console.log("注册失败");
  //         res.render("error",{
  //           message:"注册失败",
  //           error:err
  //         })
  //       }else{
  //         res.redirect("/login.html");
  //       }
  //       client.close();
  //     })
  //   }
  // })
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
          db.collection("user").find({ username: uname }).count(function (err, num) {
            if (err) {
              cb(err);
            } else if (num > 0) {
              cb(new Error("已经注册"))
            } else {
              cb(null);
            }
          })
        },
        function (cb) {
          db.collection("user").insertOne({
            username: uname,
            nickname: nickname,
            password: pwd,
            age: age,
            sex: sex,
            isAdmin: isAdmin,
            phone: phone
          }, function (err) {
            if (err) {
              cb(err)
            } else {
              cb(null)
            }
          })
        }
      ], function (err, result) {
        if (err) {
          res.render("error", {
            message: "错误",
            error: err
          })
        } else {
          res.redirect("/login.html");
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
      db.collection("user").deleteOne({
        _id: ObjectId(id)
      }, function (err) {
        if (err) {
          res.render("error", {
            message: "删除失败",
            error: err
          })
        } else {
          res.redirect("/users");
        }
        client.close();
      })
    }
  })
})
router.get("/search",function(req,res){
  var str=req.query.search;
  console.log(str);
  var search=new RegExp(str);
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
      db.collection("user").find({
         nickname:search
      }).toArray(function(err,data){
        if(err){
          res.render("error",{
            message:"查询失败",
            error:err
          })
        }else{
          res.render("search",{
            list:data
          })
        }
        client.close();
      })
    }
  })
})
module.exports = router;
