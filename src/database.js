//file:test.js
var sqlite3 = require('sqlite3');
var debug = require('debug');

//新建并创建表
var db;

//操纵实例
var singleInstance = {};

exports.page_config = {
    company: '圣明科技',
    about: '关于',
    services: '服务',
    products: '产品',
    blog: '博客',
    contact: '联系我们',
    motto: '想法与实现之间,尚有很大的差距',
    mottoAuthor: 'Mark Simmons,Nett Media',
    introduce: '这是我们',
    introduceTitle: '激情,昂扬,拼搏,进取',
    introduceContent: '这是一个集体,这是我的家,这里有技术大牛,有商务精英,有销售专家,更有尊敬的领导...',
    productsBelief: '我们是一个信誉良好、信誉良好、信誉良好的网络公司',
    moreBlog: '查看更多博客',
    address: '**街道,**区,郑州,河南',
    email: '***@***.com',
    phone: '180 **** ****',
    getContact: '如果对本公司有****,......,请与我们取得联系'
};

//数据库表
var TABLE_INFO = 'table_info';
var TABLE_USER = 'table_user';
var TABLE_SERVICE = 'table_service';
var TABLE_PRODUCT = 'table_product';
var TABLE_BLOG = 'table_blog';

var defaultConfig = {
    dbName: './database/company.db',
    tables: [
        //首页信息滚动:编号,标题,内容
        {
            name: TABLE_INFO,
            columns: ['id', 'title', 'content','time'],
            types: ['integer', 'text(30)', 'text','integer']
        },

        //用户领导人员等:员工编号,姓名,头像路径,性别,工龄,电话,邮箱
        {
            name: TABLE_USER,
            columns: ['id', 'duty', 'name', 'icon', 'sex', 'workYears', 'phone', 'email'],
            types: ['integer', 'integer', 'text(10)', 'text', 'text', 'integer', 'text', 'text']
        },

        //公司可对外提供的服务
        {
            name: TABLE_SERVICE,
            columns: ['id', 'icon', 'name', 'introduce','weight'],
            types: ['integer', 'text', 'text', 'text','integer']
        },

        //公司生产的产品
        {
            name: TABLE_PRODUCT,
            columns: ['id', 'icon', 'name', 'introduce','weight'],
            types: ['integer', 'text', 'text', 'text','integer']
        },

        //公司内部人员博客:博客编号,图片,作者名,标题,简介,博客地址
        {
            name: TABLE_BLOG,
            columns: ['id', 'icon', 'name', 'title', 'brief', 'address','weight'],
            types: ['integer', 'text', 'text', 'text', 'text', 'text','integer']
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
    db.get("select * from " + TABLE_USER + " where account=$account and password=$password", account, password, callback)
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
        order = " order by " + orderBy + " {" + (orderType > 0 ? "ASC" : "DESC") + "} ";
    }

    limit = limit < 0 ? "" : " limit " + limit + " ";
    db.all("select * from " + TABLE_INFO + order + limit, callback);
};

/**
 * 查询用户信息
 *
 * @param limit 限制获取多少条数据,小于0表示不处理
 * @param orderBy 以哪个字段排序
 * @param orderType 排序方式,默认>0为升序,<0为降序,0表示不处理
 * @param callback 回调,err,rows[多个数据为数组形式]
 */
singleInstance.queryTableUser = function (limit, orderBy, orderType, callback) {
    var order = '';
    if (orderType) {
        order = " order by " + orderBy + " {" + (orderType > 0 ? "ASC" : "DESC") + "} ";
    }

    limit = limit < 0 ? "" : " limit " + limit + " ";
    db.all("select * from " + TABLE_USER + order + limit, callback);
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
        order = " order by " + orderBy + " {" + (orderType > 0 ? "ASC" : "DESC") + "} ";
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
        order = " order by " + orderBy + " {" + (orderType > 0 ? "ASC" : "DESC") + "} ";
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
        order = " order by " + orderBy + " {" + (orderType > 0 ? "ASC" : "DESC") + "} ";
    }

    limit = limit < 0 ? "" : " limit " + limit + " ";
    db.all("select * from " + TABLE_BLOG + order + limit, callback);
};






