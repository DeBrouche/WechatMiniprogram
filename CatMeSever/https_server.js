const express = require('express')
const bodyParser = require("body-parser");
const app = express()

const querystring = require('querystring');
const request = require('request');

var mysql = require('mysql');
var pool = mysql.createPool({
    host     : 'localhost',
    port     : 3306,
    database : 'test0410',
    user     : 'test0410',
    password : 'soleda21.'
});

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var fs = require('fs');




//const port = 3000
//


app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({ extended: true }));

// 配置 https
let https = require("https");
const httpsOption = {
    key : fs.readFileSync("./https/catme.ren.key"),
    cert: fs.readFileSync("./https/catme.ren.pem")
};

//解决跨域问题sds content-type是json是app的设置

app.all('/app/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
//web端get   contnet type 返回html页面
app.all('/', function(req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    //res.header("Content-Type", "application/json;charset=utf-8");
    res.header("Content-Type", "text/html;charset=utf-8");
    next();
});

app.all('/app/uploadicon', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});





app.use(bodyParser.urlencoded({ extended: true }));




//业务后端------------------------------------------------------------------------------------------------------




//web端url请求---------------------          -------------------------
app.get('/', (req, res) => {
    res.sendFile(
    __dirname + '/web/index.html')
})

app.get('/:url', (req, res) => {
    let url =req.params.url;
    console.log('get请求url：'+ url);
    //console.log(url.url);
    //res.send(url);
    res.sendFile(__dirname + '/web/' + req.params.url )
})

app.get('/user_icon/:iconname', (req, res) => {
    let iconname =req.params.iconname;
    console.log('get请求图片：'+iconname);
    //console.log(url.url);
    //res.send(url);
    res.sendFile(__dirname + '/web/uploaded_images/icons/' + iconname )
})
//catme.ren/fufu




//小程序端请求------------------------------------- -------------

//小程序启动时 验证openid 获取信息
app.post('/app/getopenid', (req, res) => {
    console.log('post获取openid：'+req.body) //查看请求的body里面的内容
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
        let openidresult = JSON.parse(body);
        console.log('the wx openid request sendback:')
        //console.log(openidresult);
        openidresult.code = req.body.code;
        console.log(openidresult);
//ffff

        let sql = `select * from user where openid='${openidresult.openid}'`;
        console.log(sql)
        pool.getConnection(function(err, connection){
            connection.query(sql,function(err, rows){
                if(err) {
                    console.log('sql connection err:', err.message);
                    res.json(err.message);
                }else{
                    if(rows.length ==0){
                        console.log(openidresult.openid +' this openid is not written')
                        openidresult.status=0;
                        res.json(openidresult);
/*                        let sql = `insert into user(openid,status) values('${openidresult.openid}','0')`;
                        connection.query(sql, function (err, rows) {
                            if (err) {
                                console.log('err:', err.message);
                            }else{
                                console.log(rows);
                                result.id=rows.insertId
                                result.status =0
                                result.userid =null
                                result.jieguo ='written'
                                console.log(result);
                                res.json(result)
                                //res.send('written')
                            }
                        });*/
                    }else{
                        console.log(rows);
                        openidresult.status=1

                        openidresult.id=rows[0].id;
                        openidresult.nickname=rows[0].nickname;
                        openidresult.mail=rows[0].mail;

                        openidresult.user_post=rows[0].user_post;
                        openidresult.user_fav=rows[0].user_fav;
                        openidresult.user_collect=rows[0].user_collect;
                        openidresult.user_followed=rows[0].user_followed;

                        openidresult.user_icon=rows[0].user_icon;
                        console.log('the sql openid request sendback:')
                        console.log(openidresult);
                        res.json(openidresult);
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
//app 登录账号，将openid写入账号 并返回全局数据
app.post('/app/login', (req, res) => {
    console.log('login已经开始____________________________')
    console.log(req.body) //查看请求的body里面的内容
    let account = req.body.account;
    let password = req.body.password;
    let openid = req.body.openid;
    console.log('valid openid is:'+ openid);
/*    var data = {
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
        let openidresult = JSON.parse(body);
        console.log('the wx openid request sendback:')
        //console.log(openidresult);
        openidresult.code = req.body.code;
        console.log(openidresult);
//ffff
*/
    //    let sql = `select * from user where openid='${openidresult.openid}'`;

        let sql =`SELECT * FROM user WHERE (nickname = '${account}' OR phone = '${account}' OR mail = '${account}') AND password ='${password}'`;
        console.log(sql)
        pool.getConnection(function(err, connection){
            connection.query(sql,function(err, rows){
                if(err) {
                    console.log('sql connection err:', err.message);
                    res.json(err.message);
                }else{
                    if(rows.length ==0){//该账号没有注册 返回响应信息
                        let result = {};
                        result.status=0;
                        console.log(req.body.account +' this account is not regisered')

                        res.json(result);
                        /*                        let sql = `insert into user(openid,status) values('${openidresult.openid}','0')`;
                                                connection.query(sql, function (err, rows) {
                                                    if (err) {
                                                        console.log('err:', err.message);
                                                    }else{
                                                        console.log(rows);
                                                        result.id=rows.insertId
                                                        result.status =0
                                                        result.userid =null
                                                        result.jieguo ='written'
                                                        console.log(result);
                                                        res.json(result)
                                                        //res.send('written')
                                                    }
                                                });*/
                    }else{ //账号查找到，将openid更新至账号中，返回账号信息
                        let result = {};
                        console.log(rows);
                        let id =rows[0].id
                        result.status=1

                        result.id=rows[0].id;
                        result.nickname=rows[0].nickname;
                        result.mail=rows[0].mail;

                        result.user_post=rows[0].user_post;
                        result.user_fav=rows[0].user_fav;
                        result.user_collect=rows[0].user_collect;
                        result.user_followed=rows[0].user_followed;

                        result.user_icon=rows[0].user_icon;
                        console.log('the sql openid request sendback:')
                        console.log(result);
                        console.log('valid openid is:'+ openid);
                        let sql2 =`UPDATE user SET openid  = '${openid}' WHERE user.id = '${id}'`;
                        console.log('sql2 is: '+ sql2);
                        connection.query(sql2, function (err, rows) {
                            if (err) {
                                console.log('err:', err.message);
                                res.json(err.message);
                            }else{
                                console.log(rows);
                                console.log('写入之后的rows__________________________________');
                                console.log('id:'+id+'has been written a new openid '+openid);
                                result.witten='yes';
                                res.json(result);
                                //res.send('written')
                            }
                        });
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
//小程序注册
app.post('/app/sign_up', (req, res) => {
    console.log('sign_up 已经开始____________________________')
    console.log(req.body) //查看请求的body里面的内容
    let nickname = req.body.nickname;
    let password = req.body.password;
    let openid = req.body.openid;
    let mail = req.body.mail;
    let phone = req.body.phone;
    let id =req.body.id;
    console.log('above is the register infomation______________');
    /*    var data = {
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
            let openidresult = JSON.parse(body);
            console.log('the wx openid request sendback:')
            //console.log(openidresult);
            openidresult.code = req.body.code;
            console.log(openidresult);
    //ffff
    */
    //    let sql = `select * from user where openid='${openidresult.openid}'`;

    let sql =`insert into user (id, openid, nickname, mail, phone, password, status, user_post, user_fav, user_collect, user_followed, user_icon) VALUES ('${id}', '${openid}', '${nickname}', '${mail}', '${phone}', '${password}', '1', '0', '0', '0', '0', 'icon.jpeg')`;
    console.log(sql)
    pool.getConnection(function(err, connection){
        connection.query(sql,function(err, rows){
            if(err) {
                console.log('sql connection err:', err.message);
                res.json(err.message);
            }else{
                if(rows.length ==0){//该账号没有注册成功 返回响应信息
                    let result = {};
                    result.status=0;
                    console.log(req.body.nickname +' this account is not regisered')

                    res.json(result);
                    /*                        let sql = `insert into user(openid,status) values('${openidresult.openid}','0')`;
                                            connection.query(sql, function (err, rows) {
                                                if (err) {
                                                    console.log('err:', err.message);
                                                }else{
                                                    console.log(rows);
                                                    result.id=rows.insertId
                                                    result.status =0
                                                    result.userid =null
                                                    result.jieguo ='written'
                                                    console.log(result);
                                                    res.json(result)
                                                    //res.send('written')
                                                }
                                            });*/
                }else{ //账号查找到，将openid更新至账号中，返回账号信息
                    let result = {};
                    console.log('this is row_______________________________________________________________________________________' + rows);

                    result.status=1

                    result.id=id;
                    result.nickname=nickname;
                    result.mail=mail;

                    result.user_post=0;
                    result.user_fav=0;
                    result.user_collect=0;
                    result.user_followed=0;

                    result.user_icon='icon.jpeg';
                    res.json(result);
                    console.log('the sql register request sendback:')
                    console.log(result);
                    console.log('valid openid is:'+ openid);
                    /*let sql2 =`UPDATE user SET openid  = '${openid}' WHERE user.id = '${id}'`;
                    console.log('sql2 is: '+ sql2);
                    connection.query(sql2, function (err, rows) {
                        if (err) {
                            console.log('err:', err.message);
                        }else{
                            console.log(rows);
                            console.log('写入之后的rows__________________________________');
                            console.log('id:'+id+'has been written a new openid '+openid);
                            result.witten='yes';
                            res.json(result);
                            //res.send('written')
                        }
                    });*/
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






app.post('/app/appget', function (req, res) {
    var user_name=req.body.username;
    console.log(user_name);
    console.log('Got a POST request');
    res.send('Got a POST request: username='+user_name)
})

//app.listen(port, () => {
 //   console.log(`Example app listening at http://152.136.130.51/:${port}`)
//})

//文件上传 头像
app.post('/app/uploadicon', multipartMiddleware, function(req, resp) {
    console.log('formata post request has bugunss_ receiving icon_______________________________________________________________________________________');
    console.log('this is req.body:____________________',req.body,);
    console.log('this is req.files____________________' ,req.files);
    console.log('req.body req.files___________ended_____________________________________________' );

    let Filename_Extension = req.files.file.type.substring(6);
    let newfilename = req.body.newname +'.' + Filename_Extension;
    let userid = req.body.user_id;
    let sendback = {};
    sendback.iconname =newfilename;

    //resp.send(newfilename + " (size:"+req.files.file.size+") "+" had been uploaded  successfully!");


    console.log('new image uploaded');
    console.log('path: ');
    console.log('/opt/CatMe/web/uploaded_images/icons/'+newfilename);
    console.log('size: ');
    console.log(req.files.file.size);
    console.log('type: ');
    console.log(req.files.file.type);

    //console.log(req.files.file.path)
    //移动临时文件
    var source = fs.createReadStream(req.files.file.path);
    var dest = fs.createWriteStream('/opt/CatMe/web/uploaded_images/icons/'+newfilename);

    source.pipe(dest);
    source.on('end', function() { fs.unlinkSync(req.files.file.path);});   //delete
    source.on('error', function(err) {  });
    console.log('icon uploaded________________________________________________________________________________________');
    // don't forget to delete all req.files when done
    console.log('starting Database update________________________________________________________________________________________');
    //修改头像值 相应id
    //let sql2 =`UPDATE user SET openid  = '${openid}' WHERE user.id = '${id}'`;
    //UPDATE `user` SET `user_icon` = '${password}' WHERE `user`.`id` = '1';
    let sql =`update user set user_icon = '${newfilename}' where user.id = '${userid}'`;
    console.log(sql);
    pool.getConnection(function(err, connection){
        connection.query(sql,function(err, rows){
            if(err) {
                console.log('sql connection err:', err.message);
                resp.send(err.message);
            }else{
                console.log("new icon name sent back__________________________________________________")
                resp.send(sendback.iconname);
                console.log("sendbaci: " + sendback)
                console.log("new icon name sent back__________________________________________________")
            }
        });
        connection.release();
    });
})


//文件上传
app.post('/app/uploadmedia', multipartMiddleware, function(req, resp) {
    console.log('formata post request has bugunss________________________________________________________________________________________');
    console.log('this is req.body:',req.body,'this is req.files' ,req.files);
    let Filename_Extension = req.files.file.type.substring(6);
    let newfilename = req.body.newname +'.' + Filename_Extension;
    resp.send(newfilename + " (size:"+req.files.file.size+") "+" had been uploaded  successfully!");
    console.log('new image uploaded');
    console.log('path: ');
    console.log('/opt/uploaded_images/posts/'+newfilename);
    console.log('size: ');
    console.log(req.files.file.size);
    console.log('type: ');
    console.log(req.files.file.type);

    //console.log(req.files.file.path)
    //移动临时文件
    var source = fs.createReadStream(req.files.file.path);
    var dest = fs.createWriteStream('/opt/uploaded_images/posts/'+newfilename);

    source.pipe(dest);
    source.on('end', function() { fs.unlinkSync(req.files.file.path);});   //delete
    source.on('error', function(err) {  });
    console.log('formata post request has finished________________________________________________________________________________________');
    // don't forget to delete all req.files when done
})

//2021

//配置服务端口80 443

//var server = app.listen(80, function () {
//    var port = server.address().port;
//    console.log('App listening at %s', port);
//})

https.createServer(httpsOption, app).listen(443);
console.log('https server is now operating......');