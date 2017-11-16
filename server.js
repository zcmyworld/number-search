let Koa = require('koa');
let app = new Koa();

// koa post 数据解析器
let bodyParser = require('koa-bodyparser');
app.use(bodyParser());

let router = require('koa-router')({});
let path = require('path');


let send = require('koa-send');


let render = require('koa-ejs');
render(app, {
  root: path.join(__dirname, 'views'),
  layout: false,
  viewExt: 'html'
})

router.get('/page/index', async function (ctx) {
  await ctx.render('index');
})

let redissearch = require('./redissearch');


router.get('/redis/search', async function (ctx) {
  let searchkey = ctx.query.searchkey;
  let start_time = new Date().getTime();
  let rs = await redissearch.search(searchkey);
  let end_time = new Date().getTime();
  console.log('use_time .. ' + (end_time - start_time));
  ctx.body = rs;
})

let mysqlsearch = require('./mysqlsearch');

router.get('/mysql/search', async function (ctx) {
  let searchkey = ctx.query.searchkey;
  let start_time = new Date().getTime();
  let rs = await mysqlsearch.search(searchkey);
  let end_time = new Date().getTime();
  console.log('use_time .. ' + (end_time - start_time));
  ctx.body = rs;
})

app
  .use(router.routes())
  .use(router.allowedMethods());

if (module.parent) {
  module.exports = app;
} else {
  app.listen(3003);
}

