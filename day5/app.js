const Koa = require("koa");
const KoaStaticCache = require("koa-static-cache");
const KoaRouter = require("koa-router");
const upload = require("./middlewares/upload");
const mysql = require("mysql2/promise");
const app = new Koa();

//自执行函数
let connection;
~(async function () {
  // 链接数据库
  connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "getphotos",
  });
})();

app.use(
  KoaStaticCache("./static", {
    prefix: "/static",
    gzip: true,
    dynamic: true,
  })
);

const router = new KoaRouter();

router.get("/getPhotos", async (ctx) => {
  //从数据库取数据
  let [rows, fields] = await connection.execute(
    "SELECT * FROM `photodatas`",
    []
  );
  rows = rows.map((r) => ({
    ...r,
    url: "/static/upload/" + r.photoname,
  }));
  ctx.body = rows;
});

router.get("/", async (ctx) => {
  ctx.body = "相册空间";
});

router.post("/upload", upload(), async (ctx) => {
  // console.log(ctx.request.files);
  let dot = ctx.request.files.file.path.lastIndexOf("\\");
  let filename = ctx.request.files.file.path.substring(dot + 1);

  // 插入数据发送到数据库
  await connection.execute(
    "insert into `photodatas` (`photoname`) values (?)",
    [filename]
  );
  ctx.body = {
    url: "/static/upload/" + filename,
  };
});

app.use(router.routes());

app.listen(8081);
