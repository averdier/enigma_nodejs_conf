module.exports = (io) => {
  var express = require('express');

  const jwt = require('jsonwebtoken');
  const checkAuth = require('../utils/auth_site')
  const Conference = require('../models/conference')

  var router = express.Router();

  const checkToken = (token) => {
    try {
      const jwtKey = process.env.JWT_KEY || 'secret';
      const decoded = jwt.verify(token, jwtKey, null);

      return decoded
    } catch (error) {
      return false
    }
  }

  router.get('/', function (req, res, next) {
    res.render('index', {
      title: 'Express'
    });
  });

  router.get('/register', (req, res, next) => {
    res.render('public/register', {
      title: 'Register'
    })
  })

  router.get('/login', (req, res, next) => {
    res.render('public/login', {
      title: 'Login'
    })
  })

  router.get('/conferences', (req, res, next) => {
    res.render('public/conferences', {
      title: 'Conferences'
    })
  })

  router.get('/conferences/:id', (req, res, next) => {

    Conference.findOne({
      _id: req.params.id
    }, (err, result) => {
      if (!err && result && result.status) {
        io.once('connection', (socket) => {

          let decoded = checkToken(socket.handshake.query.token)
          if (decoded) {
            console.log('authorized user')

            if (result.users.includes(decoded.username)) {
              console.log('user in conference')

              socket.join(result.topic)
              socket.on('/chat', function (msg) {
                io.to(result.topic).emit('/chat', msg);
              });
            } else {
              console.log('user not in conference')
              socket.disconnect()
            }

          } else {
            console.log('unauthorized client')
            socket.disconnect()
          }

        })
      }
    })

    res.render('public/conference', {
      title: 'Conference details',
      id: req.params.id
    })
  })

  router.get('/logout', (req, res, next) => {
    res.render('logout', {
      title: 'Logout'
    })
  })

  return router
};
