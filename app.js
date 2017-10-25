var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug');
var singleInstance = require('./src/database').initDB();
var ejs = require('ejs');

var welcome = require('./routes/welcome');
var users = require('./routes/users');
var reboot = require('./routes/reboot');

var app = express();

//定义log
var log = debug.log;
debug.log = function (msg) {
    log("=====BEGIN");
    log(msg);
    log('=====END\n');
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

///////////////////////////////////////////////////// 从数据库中获取最新记录
/**
 * 设定界面元素显示信息
 */
app.locals.pageConfig = singleInstance.pageConfig;

/**
 * 设定最新消息信息
 */
singleInstance.queryTableInfo(5, 'time', -1, function (err, data) {
    app.locals.tableInfo = data;
    debug.log(data);

    for(var item in data){
        debug.log("最新消息:"+data[item]);
    }
});

/**
 * 获取最新的user信息,根据公司职位级别来显示部分内容
 */
singleInstance.queryTableStaff(5, 'duty', -1, function (err, data) {
    app.locals.tableStaff = data;
    debug.log(data);
});

/**
 * 获取最新的服务消息
 */
singleInstance.queryTableService(4, 'weight', -1, function (err, data) {
    app.locals.tableService = data;
    debug.log(data);
});

/**
 * 获取最新产品信息
 */
singleInstance.queryTableProduct(5, 'weight', -1, function (err, data) {
    app.locals.tableProduct = data;
    debug.log(data);
});

/**
 * 博客消息
 */
singleInstance.queryTableBlog(5, 'weight', -1, function (err, data) {
    app.locals.tableBlog = data;
    debug.log(data);
});

/**
 * 招聘消息
 */
singleInstance.queryTableJoin(function (err, data) {
  app.locals.tableJoin = data;
  debug.log(data);
});

/**
 * 招聘消息
 */
singleInstance.queryTableRegulations(function (err, data) {
  app.locals.tableRegulations = data;
  debug.log(data);
});

/**
 * 内部方法,提供数据格式转换
 */
app.locals.getStaffDuty=singleInstance.getStaffDuty;
app.locals.getJOINType=singleInstance.getJOINType;
/////////////////////////////////////////////////////

//拦截器,再次拦截
app.use('/users', users);

//重新从数据库中加载数据
app.use('/reboot', reboot);

//提出建议内容
app.use(singleInstance.pageConfig.submitUrl,function (req,res,next) {
  var name=req.header('name');
  var email=req.header('email');
  var subject=req.header('subject');
  var content=req.header('content');
  var time=new Date().getTime();

});

//加载首页信息
app.use('/*', welcome);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
