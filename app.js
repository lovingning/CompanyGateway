var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dbInstance=require('./src/database').initDB();
var debug=require('debug');
var pageConfig=require('./src/database').page_config;
var dbOperate=require('./src/database').initDB();

var index = require('./routes/index');
var users = require('./routes/users');
var reboot = require('./routes/reboot');

var app = express();

var log=debug.log;
debug.log=function (msg) {
  log("=======\n"+msg+"\n===========\n");
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//设定界面元素显示信息
app.locals.pageConfig=pageConfig;

///////////////////////////////////////////////////// 从数据库中获取最新记录
/**
 * 设定最新消息信息
 */
dbOperate.queryTableInfo(5,'time',-1,function (err, data) {
    app.locals.tableInfo=data;
    debug.log(data);
});

/**
 * 获取最新的user信息,根据公司职位级别来显示部分内容
 */
dbOperate.queryTableUser(5,'duty',-1,function (err, data) {
    app.locals.userInfo=data;
    debug.log(data);
});

/**
 * 获取最新的服务消息
 */
dbOperate.queryTableService(4,'weight',-1,function (err, data) {
    app.locals.serviceInfo=data;
    debug.log(data);
});

/**
 * 获取最新产品信息
 */
dbOperate.queryTableProduct(5,'weight',-1,function (err, data) {
    app.locals.productInfo=data;
    debug.log(data);
});

/**
 * 博客消息
 */
dbOperate.queryTableBlog(5,'weight',-1,function (err, data) {
    app.locals.blogInfo=data;
    debug.log(data);
});
/////////////////////////////////////////////////////

//拦截器,再次拦截
app.use('/users', users);

//重新从数据库中加载数据
app.use('/reboot',reboot);

//加载首页信息
app.use('/*',index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
