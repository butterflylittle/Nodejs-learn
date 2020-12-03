// 引入node内置的http模块，来进行http的服务器开发
const http = require('http');
// 引入node内置的fs模块，来完成对应文件系统（硬盘里面的文件）进行操作
const fs = require('fs');

let money = 3;

// 创建一个http的服务器
const server = http.createServer( (request, response) => {
    
    // 如果url与资源都映射，我们通过代码一个个的去写，是基本不可能的，所以，我们就定义一个url的规则，满足这个规则的url，我们就去执行的目录中匹配
    // 规则自己定，比如 /kkb 开头的url，我们都去 static 目录中进行查找

    // console.log('请求地址：', request.url);
    let url = request.url;
    let content = '';

    // /kkb/images/logo.png

    if ( url.startsWith('/kkb') ) {
        // __dirname : node 中的内置变量，返回当前文件的绝对路径
        url = url.replace(/^\/kkb/g, '/static');
        // console.log('static', __dirname + url);
        
        content = fs.readFileSync( __dirname + url );
        response.write(content);
    } else {
        
        // 每次交换的数据（请求、响应），我们称为：报文
        // 每一个报文数据包含：行、头、正文
        // ['行', '头', '正文']
        // response.setHeader('Content-Type', 'text/html;charset=utf-8');

        response.setHeader('Content-Type', 'text/html;charset=utf-8');
        if (money > 0) {
            // response.setHeader('Content-Type', 'application/zip');

            

            money--;

            response.write(`
                <h2>我的小秘密</h2>
                <strong>你还有：${money}</strong>
            `);

            
        } else {
            response.write('<h1>请充值！！！</h1>');
        }
        
    }

    response.end();
} );

// 在当前电脑上监听一个指定的端口（电话的分机号码）
server.listen(8081, () => {
    // 如果你们把代码运行起来了，你们的局域网ip不一定是这个地址，所以推荐你们用本机访问：http://localhost:8081
    console.log('服务器开启成功，您可以通过：http://localhost:8081')
});