const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const dbContacts = require('./db/contacts')
const app = express()
const {renderError} = require('./server/utils')
const routes = require('./server/routes');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

app.use((request, response, next) => {
  response.locals.query = ''
  next()
})

app.use(session({
  key: 'user_sid',
  secret: 'woofmeow',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000
  }
}))

app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie('user_sid')
  }
  next()
}))

app.route('/login')
  .get(sessionChecker, (req, res) => {
    res.render('login')
  })

app.get('/', sessionChecker, (req, res) => {
  res.redirect('/login')
})

app.route('/login')
  .get(sessionChecker, (req, res) => {
    res.render('login')
  })
  .post((req, res) => {
    const { username, password } = req.body

    User.find(username).then(function(user) {
      if(!user) {
        res.redirect('/login')
      } else {
        User.isValidPassword(user, password)
          .then(isValid => {
            res.redirect('/login')
          } else {
            req.session.user = user
            res.redirect('/dashboard')
          }
        })
      }
    }).catch(error => {
      console.error(error)
    })
  })

  app.route('/signup')
    .get((req, res) => {
      res.render('signup')
    })
    .post((req, res) => {
      const { username, password } = req.body
      User.create(username, password)
      res.send('created the user')
    })

var sessionChecker = (req, res, next) => {
  if (!(req.session.user && req.cookies.user_sid)) {
    res.redirect('/login')
  } else {
    next()
  }
}

app.use(sessionChecker)

app.use('/', routes)

app.get('/dashboard', (req, res) => {
  res.send('this is the dashboard')
})

app.get('/logout', (req, res) => {

})

app.use((request, response) => {
  response.render('not_found')
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
