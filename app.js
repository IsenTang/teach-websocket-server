const Koa = require('koa')
const http = require('http')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()

const views = require('koa-views')
const co = require('co')
const convert = require('koa-convert')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const debug = require('debug')('koa2:server')
const path = require('path')
const cors = require('koa-cors');
const socket = require('socket.io');

const config = require('./config')
const routes = require('./routes')
const socketService = require('./services/socket');


const port = process.env.PORT || config.port

// error handler
onerror(app)

// middlewares
app.use(bodyparser())
  .use(json())
  .use(logger())
  .use(require('koa-static')(__dirname + '/public'))
  .use(views(path.join(__dirname, '/views'), {
    options: {settings: {views: path.join(__dirname, 'views')}},
    map: {'njk': 'nunjucks'},
    extension: 'njk'
  }))
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods())

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - $ms`)
})

router.get('/', async (ctx, next) => {
  // ctx.body = 'Hello World'
  ctx.state = {
    title: 'Koa2'
  }
  await ctx.render('index', ctx.state)
})

routes(router)
app.on('error', function(err, ctx) {
  console.log(err)
  logger.error('server error', err, ctx)
})

const server = http.createServer(app.callback());
const io = socket(server,{
  // ? 允许跨域
  cors : {
    origin : '*'
  }
});

io.on('connection', client => {
  console.log('client: ', client.id);
  socketService(client);
})

io.on("disconnect", (socket) => {
  console.log('disconnect ==>',socket.id); 
});

module.exports = server.listen(config.port, () => {
  console.log(`Listening on http://localhost:${config.port}`)
})
