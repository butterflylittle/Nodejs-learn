const koa = require("koa");
const fs = require("fs");
const mime = require("./mime.json");
const data = require("./data.json");
const nunjucks = require("nunjucks");
const KoaRouter = require("koa-router");
const KoaStaticCache = require("koa-static-cache");
const kkbStatic = require("./middlewares/kkbStatic.js");

// console.log('kkbStatic', kkbStatic);

// 根据不同的环境（node / Browser）
const tpl = new nunjucks.Environment(
  // 模板存放路径
  new nunjucks.FileSystemLoader("template")
);

const server = new koa();

server.use(
  KoaStaticCache("./static", {
    prefix: "/public",
    gzip: true,
    dynamic: true,
  })
);

// server.use( kkbStatic(__dirname + 'static') )

// 模板中间件处理
server.use((ctx, next) => {
  //  为 ctx 扩展一个 render，这个render去调用tpl渲染
  ctx.render = function (filename, data) {
    ctx.body = tpl.render(filename, data);
  };

  next();
});

const router = new KoaRouter();

// ctx 和 next 是 koa 内置封装好的对象和方法
/**
 * ctx = {
 *  request: Koa处理过后的
 *  response: Koa处理过后
 *  req: node 原来的
 *  res: node 原来
 * }
 */
// server.use( function(ctx, next) {
//     console.log('有人访问了');

//     next();
// } );

// server.use( function(ctx, next) {
//     console.log('123');

//     ctx.response.body = 'Hello';
// } );

// 使用 router 提供的 get，post，put……这些方法来注册url函数，等同于我们前面使用 switch 对 url 的判断
// 这个函数也会被作为中间件去执行
// 路由 把 一个 url 与 一个函数进行管理
router.get("/", (ctx) => {
  // ctx.body = 'Hello';
  ctx.render("index.html", {
    tempTitle: "abc",
    data,
  });
});
router.get("/register", (ctx) => {
  // ctx.body = tpl.render('register.html');
  ctx.render("register.html");
});
router.get("/login", (ctx) => {
  ctx.body = "登陆";
});
router.get("/getData", (ctx) => {
  ctx.body = { name: "koa" };
});

let routerMiddleware = router.routes();

// 只要有访问了，那么 routerMiddleware 就会执行，中间件就会分析 url ，把分析url与上面get等方法注册的时候填入url进行一个匹配，满足匹配要求的就执行对应注册函数
server.use(routerMiddleware);

server.listen(8080);
