const fs = require('fs');
module.exports = function kkbStatic(dir) {
    return (ctx, next) => {
        // console.log(ctx.url);
        if (ctx.url.startsWith( dir )) {
            // 根据规则找到服务器中指定的文件
            let file = dir;
            console.log(file);
            let content = '';
            try {
                content = fs.readFileSync(file);
            } catch(e) {
                content = fs.readFileSync('./template/404.html');
            }
            ctx.body = content.toString();
        }
    }
}