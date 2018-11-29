var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var nickname=req.cookies.nickname;
  var obj={
    nickname:nickname
  }
  if(nickname!="管理员"){
    res.render('indexnoadmin', obj);
  }else{
    res.render('index', obj);
  }
});
router.get('/exit', function(req, res, next) {
  res.cookie("nickname", "", {
    //过期时间
    maxAge: 0
  })
   res.redirect("/");
});
// router.get("/users.html",function(req,res){
//   res.render("users");
// })
// router.get("/brand.html",function(req,res){
//   res.render("brand");
// })
// router.get("/phone.html",function(req,res){
//   res.render("phone");
// })
router.get("/login.html",function(req,res){
  res.render("login");
})
router.get("/register.html",function(req,res){
  res.render("register");
})
module.exports = router;
