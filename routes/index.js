const router = require('koa-router')()
const passport = require('koa-passport')
const producer = require('../src/producer')
const puppeteer = require('../src/puppeteer')
const uuidv4 = require('uuid/v4')
const redis = require('redis')
const {promisify} = require('util')
const {fetchJob} = require('../src/dao')

let client = redis.createClient('redis://:No5CJ34Ai6vHpdNo5AKaDQmauVVyWNpTXMKQGStxuJi06vKwMQvug8Dms6jbXg9y@ogzpohhyopmn.redis.sae.sina.com.cn:10271', {no_ready_check: true, prefix: 'q-screenshot-result'})
const getAsync = promisify(client.get).bind(client)

router.get('/login', async ctx => {
  if (ctx.isAuthenticated()) {
    ctx.redirect('/app');
  } else {
    await ctx.render('login')
  }
})

router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login'
  }), res => {
    res.redirect('/app')
  }
)

router.get('/logout', async (ctx) => {
  if (ctx.isAuthenticated()) {
    ctx.logout();
    ctx.redirect('/login');
  } else {
    // ctx.body = { success: false };
    // ctx.throw(401);
    await ctx.render('error', {message: '未登录', error: {}})
  }
})

router.get('/screenshot', async (ctx, next) => {
  if (ctx.isAuthenticated()) {
    let job_id = uuidv4()
    producer(ctx, job_id)
    // let buffer = await puppeteer(ctx)
    // process.send({cmd: "screenshot", data: ctx.query})
    // return puppeteer(ctx)
    ctx.body = {
      status: 200,
      data: {job_id},
      message: '请根据job_id进行结果查询~'
    }
    // console.log(process.pid)
    // ctx.type = 'image/png'
    // ctx.body = buffer
  } else {
    // ctx.body = { success: false };
    // ctx.throw(401);
    await ctx.render('error', {message: '未登录', error: {}})
  }
})

router.get('/job', async (ctx, next) => {
  if (ctx.isAuthenticated()) {
    // let res = await getAsync(ctx.query.id)
    let data = await fetchJob(ctx.query.id)
    // console.log(new Buffer(res))
    ctx.type = 'image/png'
    // ctx.body = new Buffer(res)
    ctx.body = data.file
  } else {
    // ctx.body = { success: false };
    // ctx.throw(401);
    await ctx.render('error', {message: '未登录', error: {}})
  }
})

module.exports = router
