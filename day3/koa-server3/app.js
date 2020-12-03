const Koa = require("koa");
const KoaRouter = require("koa-router");
const KoaStaticCache = require("koa-static-cache");
const template = require("./middlewares/tpl");

const mysql = require("mysql2/promise");

// 在node中使用require加载一个json文件数据的话，node会自动转成对象
// const datas = require("./data/data.json");
const userdatas = require("./data/userdata.json");
// 类似下面一行代码
// let content = JSON.parse(fs.readFileSync('./data/data.json'));

//自执行函数
let connection;
~(async function () {
  // console.log('123')
  // 链接数据库
  connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "wuhuisen*963.",
    database: "adduser",
  });

  // // 数据库查询
  const [rows, fields] = await connection.execute("SELECT * FROM `userdatas`");
  console.log("rows", rows[0]);

  // 插入数据

  for (let i = 0; i < userdatas.length; i++) {
    await connection.execute(
      "insert into `userdatas` (`username`, `age`) values (?, ?)",
      [userdatas[i].username, userdatas[i].age]
    );
  }
})();
// 创建 server 对象
const server = new Koa();

// 创建静态文件代理服务
server.use(
  KoaStaticCache("./public", {
    prefix: "/public",
    gzip: true,
    dynamic: true,
  })
);

// 创建一个router对象
const router = new KoaRouter();

// 注册我们自己写的一个基于nunjucks的一个模板引擎中间件
server.use(template("views"));

router.get("/addUser", async (ctx) => {
  let username = ctx.query.username || 1;
  let age = ctx.query.age || 1;
  console.log(ctx.querystring);
  let data = ctx.querystring;
  let result = data.spilt("&");
  result.forEach((item) => {
    console.log(res[0], res[1]);
    let res = item.split("=");
    if (res[0] == "usename") {
      username = res[1];
    }
    if ((res[0] = "age")) {
      age = Number(res[1]);
    }
  });

  await connection.execute(
    "insert into `userdatas` (`username`, `age`) values (?, ?)",
    [username, age]
  );

  showDatas = showDatas.map((d) => ({
    id: d.id,
    username: d.username,
    age: d.age,
  }));
  console.log(showDatas);

  ctx.render("index.html", {
    userdatas: showDatas,
  });
});

// 详情页
// 我们可以通过许多种方式在请求的时候携带数据
// 请求头，url(路径上，queryString)，请求正文，
router.get("/detail/:id(\\d+)", (ctx) => {
  //   //
  //   // console.log(ctx.params);
  let id = Number(ctx.params.id);

  //   // 根据id去获取数据
  let data = userdatas.find((d) => d.id == id);

  if (!userdatas) {
    return ctx.render("404");
  }

  // console.log("data", data);

  ctx.render("addUser", {
    userdatas: showDatas,
  });
});

// // 把router对象的routes中间件注册到Koa中
server.use(router.routes());

// 启动服务，并监听指定的端口
server.listen(8081, () => {
  console.log("服务启动成功，http://localhost:8081");
});
