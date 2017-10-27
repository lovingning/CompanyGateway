//file:test.js
var sqlite3 = require('sqlite3');
var debug = require('debug');
var globalConfig=require('../config');

//新建并创建表
var db;

//操纵实例
var singleInstance = {};

singleInstance.pageConfig = {
  company: '圣明科技',
  about: '关于',
  services: '服务',
  products: '产品',
  joinUs: '人才招聘',
  blog: '博客',
  contact: '联系我们',
  page: '界面元素',
  regulations: '制度',
  motto: '想法与实现之间,尚有很大的差距',
  mottoAuthor: 'Mark Simmons,Nett Media',
  introduce: '这是我们',
  introduceTitle: '激情,昂扬,拼搏,进取',
  introduceContent: '这是一个集体,这是我的家,这里有技术大牛,有商务精英,有销售专家,更有尊敬的领导...',
  productsBelief: '我们是一个信誉良好的网络公司',
  moreBlog: '查看更多博客',
  address: '**街道,**区<br>郑州,河南',
  email: '***@***.com',
  phone: '180 **** ****',
  getContact: '如果对本公司有****,......,请与我们取得联系',
  submitUrl: '/postSubject'
};


singleInstance.getDB = function () {
  if (db) return db; else throw "数据库未创建,请先调用 initDB 方法";
};

/**
 * 验证用户账户
 *
 * @param account 帐号
 * @param password 密码
 * @param callback 回调函数,包含两个参数:err,data,若成功则err为null,若查询不到数据,则data为undefined,否则data为有效数据
 */
singleInstance.checkRootAccount = function (account, password, callback) {
  db.get("select * from " + TABLE_MEMBER + " where account=$account and password=$password", account, password, callback)
};

/**
 * 查询首页信息
 *
 * @param limit 限制获取多少条数据,小于0表示不处理
 * @param orderBy 以哪个字段排序
 * @param orderType 排序方式,默认>0为升序,<0为降序,0表示不处理
 * @param callback 回调,err,rows[多个数据为数组形式]
 */
singleInstance.queryTableInfo = function (limit, orderBy, orderType, callback) {
  var order = '';
  if (orderType) {
    order = " order by " + orderBy + " " + (orderType > 0 ? "ASC" : "DESC") + " ";
  }

  limit = limit < 0 ? "" : " limit " + limit + " ";
  var sql="select * from " + TABLE_INFO + order + limit;
  db.all(sql, callback);
};

/**
 * 查询用户信息
 *
 * @param limit 限制获取多少条数据,小于0表示不处理
 * @param orderBy 以哪个字段排序
 * @param orderType 排序方式,默认>0为升序,<0为降序,0表示不处理
 * @param callback 回调,err,rows[多个数据为数组形式]
 */
singleInstance.queryTableStaff = function (limit, orderBy, orderType, callback) {
  var order = '';
  if (orderType) {
    order = " order by " + orderBy + " " + (orderType > 0 ? "ASC" : "DESC") + " ";
  }

  limit = limit < 0 ? "" : " limit " + limit + " ";
  db.all("select * from " + TABLE_STAFF + order + limit, callback);
};

/**
 * 查询提供服务的信息
 *
 * @param limit 限制获取多少条数据,小于0表示不处理
 * @param orderBy 以哪个字段排序
 * @param orderType 排序方式,默认>0为升序,<0为降序,0表示不处理
 * @param callback 回调,err,rows[多个数据为数组形式]
 */
singleInstance.queryTableService = function (limit, orderBy, orderType, callback) {
  var order = '';
  if (orderType) {
    order = " order by " + orderBy + " " + (orderType > 0 ? "ASC" : "DESC") + " ";
  }

  limit = limit < 0 ? "" : " limit " + limit + " ";
  db.all("select * from " + TABLE_SERVICE + order + limit, callback);
};

/**
 * 查询生产的产品信息
 *
 * @param limit 限制获取多少条数据,小于0表示不处理
 * @param orderBy 以哪个字段排序
 * @param orderType 排序方式,默认>0为升序,<0为降序,0表示不处理
 * @param callback 回调,err,rows[多个数据为数组形式]
 */
singleInstance.queryTableProduct = function (limit, orderBy, orderType, callback) {
  var order = '';
  if (orderType) {
    order = " order by " + orderBy + " " + (orderType > 0 ? "ASC" : "DESC") + " ";
  }

  limit = limit < 0 ? "" : " limit " + limit + " ";
  db.all("select * from " + TABLE_PRODUCT + order + limit, callback);
};

/**
 * 查询博客信息
 *
 * @param limit 限制获取多少条数据,小于0表示不处理
 * @param orderBy 以哪个字段排序
 * @param orderType 排序方式,默认>0为升序,<0为降序,0表示不处理
 * @param callback 回调,err,rows[多个数据为数组形式]
 */
singleInstance.queryTableBlog = function (limit, orderBy, orderType, callback) {
  var order = '';
  if (orderType) {
    order = " order by " + orderBy + " " + (orderType > 0 ? "ASC" : "DESC") + " ";
  }

  limit = limit < 0 ? "" : " limit " + limit + " ";
  db.all("select * from " + TABLE_BLOG + order + limit, callback);
};

/**
 * 查询用户账户
 *
 * @param limit 限制获取多少条数据,小于0表示不处理
 * @param orderBy 以哪个字段排序
 * @param orderType 排序方式,默认>0为升序,<0为降序,0表示不处理
 * @param callback 回调,err,rows[多个数据为数组形式]
 */
singleInstance.queryTableMember = function (limit, orderBy, orderType, callback) {
  var order = '';
  if (orderType) {
    order = " order by " + orderBy + " " + (orderType > 0 ? "ASC" : "DESC") + " ";
  }

  limit = limit < 0 ? "" : " limit " + limit + " ";
  db.all("select * from " + TABLE_MEMBER + order + limit, callback);
};

/**
 * 查询招聘信息
 *
 * @param callback 回调,err,rows[多个数据为数组形式]
 */
singleInstance.queryTableJoin = function (callback) {
  db.all("select * from " + TABLE_JOIN , callback);
};

/**
 * 查询公司制度
 *
 * @param callback 回调,err,rows[多个数据为数组形式]
 */
singleInstance.queryTableRegulations = function (callback) {
  db.all("select * from " + TABLE_REGULATIONS, callback);
};

/**
 * 查询公司制度
 *
 * @param callback 回调,err,rows[多个数据为数组形式]
 */
singleInstance.queryTableRegulations = function (callback) {
  db.all("select * from " + TABLE_REGULATIONS , callback);
};

/**
 * 向数据库中写入建议信息
 *
 * @param callback 回调,err,rows[多个数据为数组形式]
 * @param obj js对象,键和值对应数据库中字段
 */
singleInstance.insertTableSuggestions = function (obj, callback) {
  var keys = '';
  var values = '';
  for (var key in obj) {
    keys += "," + key;
    values += ",'" + obj[key] + "'";
  }
  if (Object.keys(obj)) {
    keys = keys.substring(1);
    values = values.substring(1);
  }
  var sql = "insert into " + TABLE_SUGGESTIONS + "(" + keys + ") values(" + values + ");";
  db.run(sql, callback);
};

/**
 * 获取职位对应的字符串形式
 */
singleInstance.getJOINType = function (id) {
  switch (id) {
    case 0:
      return '总经理';
    case 1:
      return '软件开发人员';
    case 2:
      return '硬件开发';
    case 3:
      return '前端开发';
    case 4:
      return '安卓开发';
  }
  return '普工';
};

/**
 * 获取职工类型
 */
singleInstance.getStaffDuty = function (duty) {
  switch (duty) {
    case 0:
      return '职员';
    case 100:
      return '项目组长';
    case 200:
      return '总监';
    case 300:
      return '经理';
    case 400:
      return '总经理';
    case 500:
      return '董事长';
  }
  return '临时工';
};


//数据库表
var TABLE_INFO = 'table_info';
var TABLE_STAFF = 'table_staff';
var TABLE_SERVICE = 'table_service';
var TABLE_PRODUCT = 'table_product';
var TABLE_BLOG = 'table_blog';
var TABLE_MEMBER = 'table_member';
var TABLE_JOIN = 'table_join';
var TABLE_REGULATIONS = 'table_regulations';
var TABLE_SUGGESTIONS = 'table_suggestions';

var defaultConfig = {
  dbName: '../database/'+globalConfig.dbName,
  tables: [
    //首页信息滚动:编号,标题,内容
    {
      name: TABLE_INFO,
      columns: ['id', 'title', 'content', 'time'],
      types: ['integer', 'text(30)', 'text', 'integer']
    },

    //用户领导人员等:员工编号,姓名,头像路径,性别,工龄,电话,邮箱
    {
      name: TABLE_STAFF,
      columns: ['id', 'duty', 'name', 'icon', 'sex', 'workYears', 'phone', 'email'],
      types: ['integer primary key autoincrement', 'integer', 'text(10)', 'text', 'text', 'integer', 'text', 'text']
    },

    //公司可对外提供的服务
    {
      name: TABLE_SERVICE,
      columns: ['id', 'icon', 'name', 'introduce', 'weight'],
      types: ['integer primary key autoincrement', 'text', 'text', 'text', 'integer']
    },

    //公司生产的产品
    {
      name: TABLE_PRODUCT,
      columns: ['id', 'icon', 'name', 'introduce', 'weight'],
      types: ['integer primary key autoincrement', 'text', 'text', 'text', 'integer']
    },

    //公司内部人员博客:博客编号,图片,员工id,笔名,标题,简介,博客地址
    {
      name: TABLE_BLOG,
      columns: ['id', 'icon', 'staff_id', 'pen_name', 'title', 'brief', 'address', 'weight', 'time'],
      types: ['integer primary key autoincrement', 'text', 'integer', 'text', 'text', 'text', 'text', 'integer', 'integer, FOREIGN KEY (staff_id) REFERENCES '+TABLE_STAFF+'(id)']
    },

    //用户账户:编号,账户,密码,昵称,手机号,头像
    {
      name: TABLE_MEMBER,
      columns: ['id', 'account', 'password', 'nick', 'phone', 'icon'],
      types: ['integer primary key autoincrement', 'text', 'text', 'text', 'text', 'text']
    },

    //用户账户:职位,数量,要求条件,待遇(工资),福利(补助等),联系人,职责
    {
      name: TABLE_JOIN,
      columns: ['id', 'number', 'demand', 'treatment', 'welfare', 'contact', 'responsibility'],
      types: ['integer primary key autoincrement', 'integer', 'text', 'text', 'text', 'text', 'text']
    },

    //制度:制度编号,发布日期,状态标志(当前是否启用),终止日期,内容
    {
      name: TABLE_REGULATIONS,
      columns: ['id', 'publish_time', 'status', 'abandon_time', 'content'],
      types: ['integer primary key autoincrement', 'integer', 'integer', 'integer', 'text']
    },

    //建议记录:id,提出人姓名,邮箱,主题(标题),内容(建议内容),提出时间(毫秒级别),
    {
      name: TABLE_SUGGESTIONS,
      columns: ['id', 'name', 'email', 'subject', 'content', 'time'],
      types: ['integer primary key autoincrement', 'text', 'text', 'text', 'text', 'integer']
    }
  ]
};

exports.initDB = function (config) {
  if (!db) {
    if (!config) config = defaultConfig;
    db = new sqlite3.Database(config.dbName, function (err) {
      if (err) throw "数据库创建失败:\n" + err;

      //页面配置表
      var create_table = '';
      var item;
      for (var k = 0; k < config.tables.length; k++) {
        item = '(';
        for (var i = 0; i < config.tables[k].columns.length; i++) {
          item += config.tables[k].columns[i] + " " + config.tables[k].types[i];
          if (i == config.tables[k].columns.length - 1) {
            item += ')';
          } else {
            item += ','
          }
        }
        create_table += "create table if not exists " + config.tables[k].name + item + ";";
      }
      debug.log(create_table);
      db.exec(create_table, function (err) {
        if (err) throw "无法创建TABLE" + err;
      });
    });
  }
  return singleInstance;
};





