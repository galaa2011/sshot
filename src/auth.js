const passport = require('koa-passport')
const {
  fetchUser
} = require('./dao')
// const fetchUser = (() => {
//   const user = {
//     id: 1,
//     username: 'admin',
//     password: 'sinachina'
//   }
//   return async function () {
//     return user
//   }
// })()

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(async function (user, done) {
  try {
    user = await fetchUser(user.name, user.password)
    done(null, user)
  } catch (err) {
    done(err)
  }
})

const LocalStrategy = require('passport-local').Strategy
passport.use(new LocalStrategy(function (username, password, done) {
  fetchUser(username, password)
    .then(user => {
      if (user && (username === user.name && password === user.password)) {
        done(null, user)
      } else {
        done(null, false)
      }
    })
    .catch(err => done(err))
}))

// const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
// passport.use('weibo', new OAuth2Strategy({
//     authorizationURL: 'https://api.weibo.com/oauth2/authorize?client_id=1089074294&response_type=code&redirect_uri=http://z.sina.com.cn:3001/custom',
//     tokenURL: 'https://api.weibo.com/oauth2/access_token',
//     clientID: '1089074294',
//     clientSecret: 'c1c9a2a348a6f742359ec9f1466299d0',
//     callbackURL: 'http://z.sina.com.cn:3001/custom'
//   },
//   function (accessToken, refreshToken, profile, done) {
//     fetchUser()
//       .then(user => {
//         if (true) {
//           done(null, user)
//         } else {
//           done(null, false)
//         }
//       })
//       .catch(err => done(err))
//   }
// ));
