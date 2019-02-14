const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const User = require('../../models/user');

var router = express.Router();
const jwtKey = process.env.JWT_KEY || 'secret';


/**
 * Register new user
 */
router.post('/register', function (req, res, next) {
    if (req.body.username === undefined || req.body.password === undefined) {
        return res.json({
            success: false,
            msg: 'Username or password not found'
        })
    } else {
        User.find({
            username: req.body.username
        }, (error, result) => {
            if (error) return res.json({
                success: false,
                msg: 'Error during database access'
            })

            if (result.length !== 0) return res.json({
                success: false,
                msg: 'Username already exist'
            })

            user = new User({
                username: req.body.username,
                password: req.body.password,
                admin: false
            })

            user.save((error) => {
                if (error) return res.json({
                    success: false,
                    msg: 'Error during database save'
                })

                return res.json({
                    success: true,
                    msg: 'User successfully created'
                })
            })
        })
    }
});

/**
 * Login user
 */
router.post('/login', (req, res, next) => {
    if (req.body.username === undefined || req.body.password === undefined) {
        return res.json({
            success: false,
            msg: 'Username or password not found'
        })
    } else {
        try {
            User.find({
                username: req.body.username
            }, (err, results) => {
                if (err) return res.json({
                    success: false,
                    msg: 'Error during database access'
                })
                if (results.length === 0) return res.json({
                    success: false,
                    msg: 'User not found'
                })

                bcrypt.compare(req.body.password, results[0].password, (err, isMatch) => {
                    if (!isMatch || err) {
                        return res.json({
                            success: false,
                            msg: 'User not found'
                        })
                    } else {
                        user_payload = {
                            username: req.body.username,
                            admin: results[0].admin
                        }
                        return res.json({
                            success: true,
                            token: {
                                encoded: jwt.sign(user_payload, jwtKey, 
                                    {
                                        expiresIn: '1h'
                                    }),
                                unencoded: user_payload
                            }
                        })
                    }

                })
            })
        } catch (err) {
            return res.json({
                success: false,
                msg: err
            })
        }

    }
})

module.exports = router;