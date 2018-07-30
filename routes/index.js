const router = require('koa-router')()
const passport = require('koa-passport')
const kue = require('kue')
const puppeteer = require('../src/puppeteer')

router.get('/login', async ctx => {
  await ctx.render('login')
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
    ctx.redirect('/');
  } else {
    ctx.body = { success: false };
    ctx.throw(401);
  }
})

const queue = kue.createQueue({
  redis: {
    port: 10271,
    host: 'ogzpohhyopmn.redis.sae.sina.com.cn',
    auth: 'No5CJ34Ai6vHpdNo5AKaDQmauVVyWNpTXMKQGStxuJi06vKwMQvug8Dms6jbXg9y',
    // db: 3, // if provided select a non-default redis db
    options: {
      // see https://github.com/mranney/node_redis#rediscreateclient
    }
  }
})
queue.process('screenshot', async (job, done) => {
  console.log(job.data)
  let buffer = await puppeteer(job.data.query)
  process.send({cmd: "screenshot", data: buffer})
  done()
})

router.get('/screenshot', async (ctx, next) => {
  if (ctx.isAuthenticated()) {
    queue.create('screenshot', {query: ctx.query}).save()
    // let buffer = await puppeteer(ctx)
    // process.send({cmd: "screenshot", data: ctx.query})
    // return puppeteer(ctx)
    ctx.body = process.pid
    // console.log(process.pid)
    // ctx.type = 'image/png'
    // ctx.body = buffer
  } else {
    ctx.body = { success: false };
    ctx.throw(401);
  }
})

module.exports = router
