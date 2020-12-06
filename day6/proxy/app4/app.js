const Koa = require("koa");
const KoaStaticCache = require("koa-static-cache");
const KoaRouter = require("koa-router");
const upload = require("./middlewares/upload");
const mysql = require("mysql2/promise");
const KoaBody = require("koa-body");
const koaJwt = require("koa-jwt");
const token = require("jsonwebtoken");

let db;

~(async function () {
  db = await mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "",
  });
})();

const app = new Koa();

let secret = "qianshu";

app.use(
  koaJwt({
    secret,
  }),
  unless({
    path: [/^\/public/, /^\/login/],
  })
);

app.use(
  KoaStaticCache("./public", {
    prefix: "/public",
    gzip: true,
    dynamic: true,
  })
);

const router = new KoaRouter();

router.get("/", async (ctx) => {
  ctx.body = "qianshu";
});

// app.use(function (ctx, next) {
//   return next().catch((err) => {
//     if (401 == err.status) {
//       ctx.status = 401;
//       ctx.body = {
//         code: 401,
//         msg: err.message,
//       };
//     } else {
//       throw err;
//     }
//   });
// });

router.post(
  "/login",
  KoaBody({
    multipart: true,
  }),
  async (ctx) => {
    // console.log('body', ctx.request.body);
    let { username, password } = ctx.request.body;

    if (!username || !password) {
      ctx.status = 400;
      return (ctx.body = {
        code: 1,
        message: "参数错误",
      });
    }

    let [[rs]] = await db.query("select * from `users` where `username`=?", [
      username,
    ]);

    if (!rs) {
      ctx.status = 404;
      return (ctx.body = {
        code: 2,
        message: "用户不存在",
      });
    }

    // console.log('rs', rs.password != password);
    if (rs.password != password) {
      ctx.status = 404;
      return (ctx.body = {
        code: 3,
        message: "密码错误",
      });
    }
    //token验证
    let token = jwt.sign(
      {
        id: rs.id,
        username: rs.username,
      },
      secret
    );
    // ctx.set(
    //   "Authorization",
    //   "Bearer" +
    //     jwt.sign(
    //       {
    //         id: rs.id,
    //         username: rs.username,
    //       },
    //       "qianshu",
    //       { expiresIn: "2h" }
    //     )
    // );
    // ctx.set("Authorization",'Bearer ' + token);
    ctx.set("Authorization", token);
    ctx.body = {
      id: rs.id,
      username: rs.username,
    };
  }
);

router.get("/getPhotos", async (ctx) => {
  let [rs] = await db.query("select * from `photodatas` where `user_id`=?", [
    // ctx._user.id,
    ctx.state.user.id,
  ]);

  rs = rs.map((r) => ({
    ...r,
    url: "/public/upload/" + r.photoname,
  }));

  ctx.body = rs;
});

// router.post("/upload", verify(), upload(), async (ctx) => {
router.post("/upload", upload(), async (ctx) => {
  // console.log(ctx._user);

  let dot = ctx.request.files.file.path.lastIndexOf("\\");
  let filename = ctx.request.files.file.path.substring(dot + 1);

  // console.log(filename);

  let rs = await db.query(
    "insert into `photodatas` (`photoname`, `user_id`) values (?, ?)",
    [filename, ctx.state.user.id]
  );
  // console.log(rs);

  ctx.body = {
    url: "/public/upload/" + filename,
  };
});

app.use(router.routes());

app.listen(8081);

// function verify() {
//   return async (ctx, next) => {
//     //
//     // console.log(ctx.request.header.authorization);
//     let authorization = ctx.request.header.authorization;

//     // console.log('authorization', typeof authorization);
//     if (authorization == "null") {
//       // console.log('123')
//       return (ctx.body = {
//         code: 1,
//         message: "你还没有登录",
//       });
//     } else {
//       let user = jwt.verify(authorization, "kaikeba");
//       // console.log(user);
//       if (!user) {
//         return (ctx.body = {
//           code: 1,
//           message: "你还没有登录",
//         });
//       }

//       ctx._user = user;
//     }

//     await next();
//   };
// }
