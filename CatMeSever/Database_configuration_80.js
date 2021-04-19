var express = require('express');
var qs = require("querystring");
var mysql = require('mysql');
var app = express();
var bodyParser  = require("body-parser");



const request = require('request');
const querystring = require('querystring');



app.use(bodyParser.json({limit: '1mb'}));  //body-parser 解析json格式数据
app.use(bodyParser.urlencoded({            //此项必须在 bodyParser.json 下面,为参数编码                                                                                                                                                    参数编码
    extended: true
}));



var pool = mysql.createPool({
    host     : 'localhost',
    port     : 3306,
    database : 'test0410',
    user     : 'test0410',
    password : 'soleda21.'
});

app.listen(80);

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.get('/', function(req, res){
    res.send('Hello,myServer');
});

app.get('/test', function(req, res){
    pool.getConnection(function(err, connection){
        connection.query("select * from test",function(err, rows){
            if(err) {
                throw err;
            }else{
                let result = {
                    "status": "200",
                    "success": true,
                }
                result.data=rows;
                console.log( rows );
                res.json(result);
            }
        });
        connection.release();
    });
});




//获取openid
app.post('/getopenid', function (req, res) {
    console.log(req.body) //查看请求的body里面的内容
    var data = {
        'appid': 'wx610399aa4ee6c316',
        'secret': 'bdcbd7b19a1a8bfd2c81cc022858aade',
        'js_code': req.body.code,
        'grant_type': 'authorization_code'
    };
    console.log(data);
    // querystring的stringify用于拼接查询
    var content = querystring.stringify(data);
    // 根据微信开发者文档给的API
    var url = 'https://api.weixin.qq.com/sns/jscode2session?' + content;
    // 对url发出一个get请求
    request.get({
        'url': url
    }, (error, response, body) => {
        // 将body的内容解析出来
        let result = JSON.parse(body);
        result.code = req.body.code;
//ffff

        let sql = `select * from user where openid='${result.openid}'`;
        console.log(sql)
        pool.getConnection(function(err, connection){
            connection.query(sql,function(err, rows){
                if(err) {
                    console.log('err:', err.message);
                }else{
                    if(rows.length ==0){
                        let sql = `insert into user(openid,status) values('${result.openid}','0')\`;                                                                                                                                       ult.openid}','0')`;
                        console.log(sql)
                        connection.query(sql, function (err, rows) {
                            if (err) {
                                console.log('err:', err.message);
                            }else{
                                console.log(rows);
                                result.id=rows.insertId
                                result.status =0
                                result.userid =null
                                console.log(result);
                                res.json(result)
                            }
                        });
                    }else{
                        console.log(rows);
                        result.id=rows[0].id
                        result.status=rows[0].status
                        result.userid=rows[0].userid
                        console.log(result);
                        res.json(result)
                    }
                }
            });
            connection.release();
        });
//ffff

        //console.log(result)
        // 返回JSON格式数据
        //res.json(result)
    })
})






//插入pic_visit
app.post('/addvisit', function (req, res) {
    console.log(req.body) //查看请求的body里面的内容
    var picvisit =  req.query.picvisitnum;

    console.log(picvisit);
    // querystring的stringify用于拼接查询
    //var content = querystring.stringify(data);
    // 根据微信开发者文档给的API
    //var url = 'https://api.weixin.qq.com/sns/jscode2session?' + content;
    // 对url发出一个get请求
    //request.get({
    //  'url': url
    //}, (error, response, body) => {
    //   // 将body的内容解析出来
    //    let result = JSON.parse(body);
    //    result.code = req.body.code;
//ffff

    let sql = `select * from pic where pic_id='2'`;
    console.log(sql)
    pool.getConnection(function(err, connection){
        connection.query(sql,function(err, rows){
            if(err) {
                console.log('err:', err.message);
            }else{
                if(rows.length ==0){
                    let sql = `insert into pic(pic_id,pic_visit) values('2','alb                                                                                                                                                    um_1')`;
                    console.log(sql)
                    connection.query(sql, function (err, rows) {
                        if (err) {
                            console.log('err:', err.message);
                        }else{
                            console.log(rows);


                        }
                    });
                }else{
                    console.log(rows);


                }
            }
        });
        connection.release();
    });


})
