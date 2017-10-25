var express = require('express');
var router = express.Router();
var app=require('../app');
var dbOperate=require('../src/database').initDB();

/* GET users listing. */
router.all('/', function(req, res, next) {
    var account=req.header('account');
    var password=req.header('password');

    //验证用户名称密码
    dbOperate.checkRootAccount(account,password,function (err) {
        if(err)debug.log(err);
        app.locals=null;
        res.redirect('/views/index.ejs');
    });
});

module.exports = router;
