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
    console.log('catme.ren    sent back___________________________________________________________________')
})

app.get('/:url', (req, res) => {
    let url =req.params.url;
    console.log('get请求url：'+ url);
    //console.log(url.url);
    //res.send(url);
    res.sendFile(__dirname + '/web/' + req.params.url )
    console.log('catme.ren/:url       sent back___________________________________________________________________')
})

app.get('/user_icon/:iconname', (req, res) => {
    let iconname =req.params.iconname;
    console.log('get请求图片：'+iconname);
    //console.log(url.url);
    //res.send(url);
    res.sendFile(__dirname + '/web/uploaded_images/icons/' + iconname )
    console.log('catme.ren/user_icon/:iconname      sent back___________________________________________________________________')
})
app.get('/posts_pic/:iconname', (req, res) => {
    let iconname =req.params.iconname;
    console.log('get请求图片：'+iconname);
    //console.log(url.url);
    //res.send(url);
    res.sendFile(__dirname + '/web/uploaded_images/posts/' + iconname )
    console.log('catme.ren/posts_pic/:iconname      sent back___________________________________________________________________')
})
//catme.ren/fufu




//小程序端请求------------------------------------- -------------

//小程序启动时 验证openid 获取信息  小程序启动  用户验证 身份验证
app.post('/app/getopenid', (req, res) => {
    console.log('get opendi starting____________________________________________________________________________________')
    console.log('post获取openid：'+req.body) //查看请求的body里面的内容
    console.log('post获取openid request body：'+req.body) //查看请求的body里面的内容
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
    console.log('get opendi finishing____________________________________________________________________________________')
})


//app 登录账号，将openid写入账号 并返回全局数据 用户登录
app.post('/app/login', (req, res) => {
    console.log('login starting___________________________________________________________________________________________')
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
                                console.log('写入之后的rows_______');
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
    console.log('login finishing___________________________________________________________________________________________')
})
//小程序注册 用户注册
app.post('/app/sign_up', (req, res) => {
    console.log('sign_up starting________________________________________________________________________________________________')
    console.log(req.body) //查看请求的body里面的内容
    let nickname = req.body.nickname;
    let password = req.body.password;
    let openid = req.body.openid;
    let mail = req.body.mail;
    let phone = req.body.phone;
    let id =req.body.id;
    console.log('above is the register infomation__');
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
                    console.log('this is row___' + rows);

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
    console.log('sign_up finishing_______________________________________________________________________________________________')
})

//获取用户相册信息 获取用户相册数组
app.post('/app/get_albums', (req, res) => {
    console.log('getting album for user starting__________________________________________________________________：') //查看请求的body里面的内容
    console.log(req.body)
    let user_id = req.body.user_id;
    let sql = `select * from user_album where owner_id='${user_id}'`;
    console.log(sql)
    let result = {};
    pool.getConnection(function(err, connection){
        connection.query(sql,function(err, rows){
                if(err) {
                    console.log('sql connection err:', err.message);
                    res.json(err.message);
                }else{
                    if(rows.length ==0){
                        console.log(user_id +' user has bo album')
                        result.status=0;
                        res.json(result);

                    }else{
                        console.log(rows);
                        result.status = 1;
                        result.albums = [];
                        let album_number = rows.length;

                        for (let i = 0;i < album_number;i++){
                            result.albums[i]=rows[i];
                            result.albums[i].thumnail_1 = "https://www.catme.ren/posts_pic/" + rows[i].thumnail_1;
                            result.albums[i].thumnail_2 = "https://www.catme.ren/posts_pic/" + rows[i].thumnail_2;
                            result.albums[i].thumnail_3 = "https://www.catme.ren/posts_pic/" + rows[i].thumnail_3;
                        }



                        console.log('sending back result' + result)
                        res.json(result);
                    }
                }
        })
        connection.release();
    })
    console.log('get albums info finishing_____________________________________________________________________________：')
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

//文件上传 更改用户头像 上传头像 上传用户头像
app.post('/app/upload_posts', multipartMiddleware, function(req, resp) {
    console.log('new icon starting_______________________________________________________________________________________');
    console.log('this is req.body:__',req.body,);
    console.log('this is req.files__' ,req.files);
    console.log('req.body req.files__ended__' );

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
    console.log('icon uploaded__');
    // don't forget to delete all req.files when done
    console.log('starting Database update__');
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

                resp.send(sendback.iconname);
                console.log("sendbaci: " + sendback)
                console.log("new icon name sent back__")
            }
        });
        connection.release();
    });
    console.log("new icon finishing____________________________________________________________________________________________")
})


//文件上传 上传照片 上传posts
app.post('/app/uploadposts', multipartMiddleware, function(req, resp) {
    console.log('posts upload starting_______________________________________________________________________________________');
    console.log('this is req.body: ',req.body,);
    console.log('this is req.files ' ,req.files);
    console.log('req.body req.files ended ____' );

    let Filename_Extension = req.files.file.type.substring(6);
    let newfilename = req.body.newname +'.' + Filename_Extension;
    let userid = req.body.user_id;
    let album_id = req.body.album_id;
    let sendback = {};
    sendback.postname =newfilename;
    let indexx = newfilename.substring(22,23)

    //resp.send(newfilename + " (size:"+req.files.file.size+") "+" had been uploaded  successfully!");


    console.log('new image uploaded');
    console.log('path: ');
    console.log('/opt/CatMe/web/uploaded_images/posts/'+newfilename);
    console.log('size: ');
    console.log(req.files.file.size);
    console.log('type: ');
    console.log(req.files.file.type);

    //console.log(req.files.file.path)
    //移动临时文件
    var source = fs.createReadStream(req.files.file.path);
    var dest = fs.createWriteStream('/opt/CatMe/web/uploaded_images/posts/'+newfilename);

    source.pipe(dest);
    source.on('end', function() { fs.unlinkSync(req.files.file.path);});   //delete
    source.on('error', function(err) {  });
    console.log('post_pic uploaded ___');
    // don't forget to delete all req.files when done
    console.log('starting Database update ___');
    //修改头像值 相应id
    //let sql2 =`UPDATE user SET openid  = '${openid}' WHERE user.id = '${id}'`;
    //UPDATE `user` SET `user_icon` = '${password}' WHERE `user`.`id` = '1';
    //let sql =`update user set user_icon = '${newfilename}' where user.id = '${userid}'`;
    //`insert into user_album (id, name, description, owner_id) VALUES ('${id}', '${name}', '${description}', '${user_id}')`;

    //根据相片排序 设置缩略图
    console.log("picture "+newfilename+" is deciding whether to set thumnail for album: "+ album_id)

    console.log("||||||||||||||||||||||||||||||")
    console.log("||||||||||||||||||||||||||||||")
    console.log("pic number: "+ indexx)
    console.log("||||||||||||||||||||||||||||||")
    console.log("||||||||||||||||||||||||||||||")
    let sql1 =``;
    if (indexx =='0' || indexx =='1'|| indexx =='2'){

        if(indexx =='0'){
            console.log("||||||||||||||||||||||||||||||--indexx==0")
            sql1 = `UPDATE user_album SET thumnail_1 = '${newfilename}', posts_amount = posts_amount + 1 WHERE user_album.id = '${album_id}'`;
        }else if (indexx =='1'){
            console.log("||||||||||||||||||||||||||||||--indexx==1")
            sql1 = `UPDATE user_album SET thumnail_2 = '${newfilename}', posts_amount = posts_amount + 1 WHERE user_album.id = '${album_id}'`;
        }else if (indexx =='2'){
            console.log("||||||||||||||||||||||||||||||--indexx==2")
            sql1 = `UPDATE user_album SET thumnail_3 = '${newfilename}', posts_amount = posts_amount + 1 WHERE user_album.id = '${album_id}'`;
        }

    }else{
        sql1 = `UPDATE user_album SET posts_amount = posts_amount + 1 WHERE user_album.id = '${album_id}'`;
    }
    pool.getConnection(function(err, connection){
        connection.query(sql1,function(err, rows){
            if(err) {
                console.log('sql connection err:', err.message);
                resp.send(err.message);
            }else{
                console.log("album "+ album_id+" thumnai_"+indexx+" set___ ")
            }
        });
        connection.release();
    });









    /*
    //确定相册有几张相片 设置相册封面图(根据相册照片数 设置相册封面)
    let sql0 = `select * from album_posts where album_id='${album_id}'`;
    console.log(sql0);
    pool.getConnection(function(err, connection){
        connection.query(sql0,function(err, rows){
            console.log("picture "+newfilename+" is quering the posts number for album: "+ album_id)

            console.log("||||||||||||||||||||||||||||||")
            console.log("||||||||||||||||||||||||||||||")
            console.log("rows length: "+rows.length)
            console.log("||||||||||||||||||||||||||||||")
            console.log("||||||||||||||||||||||||||||||")

            if(err) {
                console.log('uploading posts sql2 connection err:', err.message);
                resp.send(err.message);
            }else{
                console.log("uploading posts sql2 connection succeeded ___")
                //相册有0张照片,则设置封面缩略图1
                if(rows.length == 0){
                    let sql1 = `UPDATE user_album SET thumnail_1 = '${newfilename}' WHERE user_album.id = '${album_id}'`;
                    pool.getConnection(function(err, connection){
                        connection.query(sql1,function(err, rows){
                            if(err) {
                                console.log('sql connection err:', err.message);
                                resp.send(err.message);
                            }else{
                                console.log("album "+ album_id+" thumnai_1 set___ ")
                            }
                        });
                        connection.release();
                    });
                }else if(rows.length == 1){
                    let sql2 = `UPDATE user_album SET thumnail_2 = '${newfilename}' WHERE user_album.id = '${album_id}'`;
                    pool.getConnection(function(err, connection){
                        connection.query(sql2,function(err, rows){
                            if(err) {
                                console.log('sql connection err:', err.message);
                                resp.send(err.message);
                            }else{
                                console.log("album "+ album_id+" thumnai_2 set___ ")


                            }
                        });
                        connection.release();
                    });
                }else if(rows.length == 2){
                    let sql3 = `UPDATE user_album SET thumnail_3 = '${newfilename}' WHERE user_album.id = '${album_id}'`;
                    pool.getConnection(function(err, connection){
                        connection.query(sql3,function(err, rows){
                            if(err) {
                                console.log('sql connection err:', err.message);
                                resp.send(err.message);
                            }else{
                                console.log("album "+ album_id+" thumnai_3 set__ ")


                            }
                        });
                        connection.release();
                    });
                }else {

                }
                console.log("album "+ album_id+" thumnais check finished____ ")
            }
        });
        connection.release();
    });
    */



    //图片写入 相册图片表
    let sql5 = `insert into album_posts(id,album_id,user_id) VALUES('${newfilename}','${album_id}','${userid}')`;

    console.log(sql5);
    pool.getConnection(function(err, connection){
        connection.query(sql5,function(err, rows){
            if(err) {
                console.log('sql connection err:', err.message);
                resp.send(err.message);
            }else{

                console.log("new post name sent back__")
                resp.send(sendback.postname);


            }
        });
        connection.release();
    });
    console.log("nuploading post finishing_____________________________________________________________________________")
})





//创建相册
app.post('/app/new_album', (req, res) => {
    console.log('new_album creating starting ________________________________________________-__________________________')
    console.log(req.body) //查看请求的body里面的内容
    let name = req.body.name;
    let description = req.body.description;
    let user_id = req.body.user_id;
    let id =req.body.id;
    console.log('above is the new_album infomation__');


    let sql =`insert into user_album (id, name, description, owner_id) VALUES ('${id}', '${name}', '${description}', '${user_id}')`;
    console.log(sql)
    pool.getConnection(function(err, connection){
        connection.query(sql,function(err, rows){
            if(err) {
                console.log('sql connection err:', err.message);
                res.json(err.message);
            }else{
                if(rows.length ==0){//album没有存入数据库 返回响应信息
                    let result = {};
                    result.status=0;
                    console.log('creating album (' + name + ') failled')

                    res.json(result);

                }else{ //album信息写入成功，返回账号信息
                    let result = {};
                    console.log('this is row__' + rows);

                    result.status=1

                    res.json(result);
                    console.log('the sql album-creating request sendback:')
                    console.log(result);
                    console.log('album id:'+ id +  ", user_id: "+ user_id);

                }
            }
        });
        connection.release();
    });
//ffff

    //console.log(result)
    // 返回JSON格式数据
    //res.json(result)
    console.log('creating album finishing____________________________________________________')
})


//加载相册细节 加载相册照片

app.post('/app/load_album_posts', (req, res) => {
    console.log('load_album_posts starting ________________________________________________-__________________________')
    console.log(req.body) //查看请求的body里面的内容
    let albumid = req.body.album_id;

    console.log('above is the load_album_posts infomation__');


    let sql =`select * from album_posts where album_id = '${albumid}'`;
    console.log(sql)
    pool.getConnection(function(err, connection){
        connection.query(sql,function(err, rows){
            if(err) {
                console.log('sql connection err:', err.message);
                res.json(err.message);
            }else{
                if(rows.length ==0){//album没有存入数据库 返回响应信息
                    let result = {};
                    result.status=0;
                    console.log('album( ' + albumid + ') has no posts')

                    res.json(result);

                }else{ //album信息写入成功，返回账号信息
                    let result = {};
                    console.log('album( ' + albumid + ') ;s posts are as follows ' + rows);
                    result.status=1
                    result.posts_even = []
                    result.posts_odd = []


                    //分别为 单双栏的posts 数组赋值
                    let length = rows.length;
                    for(let i = 0; i < length ; i++){
                        let evenoddIndex = i / 2;

                        if(i%2 == 0){
                            result.posts_even[evenoddIndex] = "https://www.catme.ren/posts_pic/" + rows[i].id;
                        }else {
                            evenoddIndex -= 0.5
                            result.posts_odd[evenoddIndex] = "https://www.catme.ren/posts_pic/" + rows[i].id;
                        }
                    }
                    res.json(result);
                    console.log('the album posts request sendback:')
                    console.log(result);
                    console.log('album ((:'+ albumid +  ", posts request is handled ");

                }
            }
        });
        connection.release();
    });
    console.log('the album posts request finishing____________________________________________________')
})
//2021

//配置服务端口80 443

//var server = app.listen(80, function () {
//    var port = server.address().port;
//    console.log('App listening at %s', port);
//})

https.createServer(httpsOption, app).listen(443);
console.log('https server is now operating......');
