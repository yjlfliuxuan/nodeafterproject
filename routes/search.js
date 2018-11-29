var express = require('express');
var router = express.Router();
router.get('/exit', function(req, res, next) {
  res.cookie("nickname", "", {
    //过期时间
    maxAge: 0
  })
   res.redirect("/");
});
module.exports = router;
