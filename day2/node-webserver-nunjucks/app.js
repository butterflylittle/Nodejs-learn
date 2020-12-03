/**
 * app.js
 *  后端对服务器代码的入口文件
 *  我们会在该文件中监听网络（端口）
 *  当有客户端请求了，那么就返回对应的数据
 */

const http = require("http");
const fs = require("fs");
const mime = require("./mime.json");
const data = require("./data.json");
const nunjucks = require("nunjucks");

// console.log('mime', mime);

// 根据不同的环境（node / Browser）
const tpl = new nunjucks.Environment(
  // 模板存放路径
  new nunjucks.FileSystemLoader("template")
);

// var res = nunjucks.renderString('Hello {{ username }}', { username: 'James' });
// console.log('res', res);

// 创建服务器对象
const server = http.createServer((req, res) => {
  // 对静态的资源内容进行处理
  if (req.url.startsWith("/static")) {
    // 根据规则找到服务器中指定的文件
    let file = __dirname + req.url;
    // console.log(file);
    let content = "";
    try {
      content = fs.readFileSync(file);

      let lastIndexOf = file.lastIndexOf(".");
      let ext = file.substring(lastIndexOf);
      let fileMime = mime[ext];
      res.writeHead(200, {
        "Content-Type": fileMime,
      });
    } catch (e) {
      console.log(e);
      content = fs.readFileSync("./template/404.html");
      res.writeHead(404, {
        "Content-Type": "text/html;charset=utf-8",
      });
    }
    res.write(content);
    res.end();
    return;
  }

  switch (req.url) {
    case "/":
      res.writeHead(200, {
        "Content-Type": "text/html;charset=utf-8",
      });

      let tempTitle = "abc";

      // content = tpl.renderString(
      //     fs.writeFileSync('./template/index.html'),
      //     {
      //         tempTitle
      //     }
      // );
      content = tpl.render("index.html", {
        tempTitle,
        data,
      });

      res.write(content);
      break;
    case "/xiaomimi":
      // 静态
      res.write("这是我的小秘密");
      break;
  }

  // res.write('Hello kkb!');
  res.end();
});

server.listen(8081);
