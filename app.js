var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug');
var dbInstance = require('./src/database').initDB();
var ejs = require('ejs');
var fs=require('fs');

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

/**
 * 更新app.locals数据
 */
function initAppLocals() {
  ///////////////////////////////////////////////////// 从数据库中获取最新记录
  /**
   * 设定界面元素显示信息
   */
  app.locals.pageConfig = dbInstance.pageConfig;

  /**
   * 设定最新消息信息
   */
  dbInstance.queryTableInfo(5, 'time', -1, function (err, data) {
    app.locals.tableInfo = data;
    debug.log(data);

    for(var item in data){
      debug.log("最新消息:"+data[item]);
    }
  });

  /**
   * 获取最新的user信息,根据公司职位级别来显示部分内容
   */
  dbInstance.queryTableStaff(5, 'duty', -1, function (err, data) {
    app.locals.tableStaff = data;
    debug.log(data);
  });

  /**
   * 获取最新的服务消息
   */
  dbInstance.queryTableService(4, 'weight', -1, function (err, data) {
    app.locals.tableService = data;
    debug.log(data);
  });

  /**
   * 获取最新产品信息
   */
  dbInstance.queryTableProduct(5, 'weight', -1, function (err, data) {
    app.locals.tableProduct = data;
    debug.log(data);
  });

  /**
   * 博客消息
   */
  dbInstance.queryTableBlog(5, 'weight', -1, function (err, data) {
    app.locals.tableBlog = data;
    debug.log(data);
  });

  /**
   * 招聘消息
   */
  dbInstance.queryTableJoin(function (err, data) {
    app.locals.tableJoin = data;
    debug.log(data);
  });

  /**
   * 制度消息
   */
  dbInstance.queryTableRegulations(function (err, data) {
    app.locals.tableRegulations = data;
    debug.log(data);
  });

  /**
   * 内部方法,提供数据格式转换
   */
  app.locals.getStaffDuty=dbInstance.getStaffDuty;
  app.locals.getJOINType=dbInstance.getJOINType;
/////////////////////////////////////////////////////
}
initAppLocals();
exports.initAppLocals=initAppLocals;

//拦截器,再次拦截
app.use('/users', users);

//重新从数据库中加载数据
app.use('/reboot', reboot);

//提出建议内容
app.use(dbInstance.pageConfig.submitUrl,function (req,res,next) {
  var name=req.body['name'];
  var email=req.body['email'];
  var subject=req.body['subject'];
  var content=req.body['content'];
  var time=new Date().getTime();
  dbInstance.insertTableSuggestions({
    name:name,
    email:email,
    subject:subject,
    content:content,
    time:time
  },function (err) {
    if(!err){
      res.end('success');
    }else{
    res.end('error');
    }
  });
});

//如果是html中访问css,js等文件,则修改路径的规则
app.use('/public',function (req, res, next) {
  console.log(req.url);
  fs.readFile(path.join(__dirname,req.baseUrl,req.url), function (err, data) {
    if (err) {
      res.end();
    }
    res.end(data);
  });
});

//加载首页信息
app.use('/index',welcome);
app.use('/*', function (req, res, next) {
  res.redirect('/index');
});

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
