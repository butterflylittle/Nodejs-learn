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

// console.log('mime', mime);

// 创建服务器对象
const server = http.createServer((req, res) => {
  // 只要有请求，那么该函数就会被执行

  // 分析用户当前请求的资源（url）
  // 根据不同的url返回不同的内容

  // 如果用户访问 http://localhost:8081/
  console.log("路径", req.url);

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
      // console.log('ext', ext);
      let fileMime = mime[ext];
      // console.log('fileMime', fileMime);
      res.writeHead(200, {
        "Content-Type": fileMime,
      });
      // res.setHeader('a', 1);
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
      // let content = fs.readFileSync('./template/index.html');
      let tempTitle = "abc";
      // 我们怎么把上面data数据进行渲染
      // 如果渲染内容的时候有逻辑（if else ）怎么办？
      content = `
                <h1>${tempTitle}</h1>
                <ul>
                    ${data
                      .map((d) => {
                        return `<li>${d.title}</li>`;
                      })
                      .join("")}
                </ul>
            `;

      res.write(content);
      break;
    case "/xiaomimi":
      // 静态
      res.write("这是我的小秘密");
      break;
  }

  // res.write('Hello node!');
  res.end();
});

server.listen(8081);
