// 引入node内置的http模块，来进行http的服务器开发
const http = require('http');
// 引入node内置的fs模块，来完成对应文件系统（硬盘里面的文件）进行操作
const fs = require('fs');

// 创建一个http的服务器
const server = http.createServer( (request, response) => {
    // 回调函数，当有客户端请求发送，并被当前server监听到了， 则会执行该函数
    console.log('有人发送了一个请求过来');

    // 回调函数有两个参数
    // request: http.ClientRequest 类
        // request 类存储当前请求的客户端信息和方法
    // response: http.ServerResponse 类
        // response 类提供服务器响应相关的信息和方法

    // response.write('<h1>Hello KaiKeBa!</h1>');
    // response.end('over!');

    // 我们把html等各种资源（数据）存储到外部文件中，然后通过node去读取

    // fs.readFile('./template/1.html', function(err, content) {

    // });

    // 客户端访问的地址（url）与后端的文件不是一对一关系，它们只是一种虚拟映射关系，这个关系是我们后端程序根据实际情况去返回的
    // 判断当前请求的地址是什么？
    console.log('请求地址：', request.url);
    let url = request.url;
    let content = '';

    switch(url) {
        case '/':
            // 读取到的文件内容不一定是字符串的（比如图片，视频，音频）
            content = fs.readFileSync('./template/1.html');
            // console.log('读取到的内容：', content.toString());

            // 把读取的文件内容作为数据发送给客户端
            response.write(content);
            break;
        case '/css.css':
            content = fs.readFileSync('./static/css/css.css');
            response.write(content);
            break;
        case '/logo.png':
            content = fs.readFileSync('./static/images/logo.png');
            response.write(content);
            break;
    }

    

    response.end();
} );

// 在当前电脑上监听一个指定的端口（电话的分机号码）
server.listen(8081, () => {
    // 如果你们把代码运行起来了，你们的局域网ip不一定是这个地址，所以推荐你们用本机访问：http://localhost:8081
    console.log('服务器开启成功，您可以通过：http://localhost:8081')
});