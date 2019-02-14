const express = require('express');
const checkAuth = require('../../utils/auth_api')
const checkAdmin = require('../../utils/admin_api')
const Conference = require('../../models/conference');

var router = express.Router();

/**
 * Get conferences
 */
router.get('/', checkAuth, (req, res, next) => {
    Conference.find((err, results) => {
        if (err) return res.json({success: false, msg: err})
        else return res.json({success: true, conferences: results})
    })
})

/**
 * Add new conference
 */
router.post('/', checkAuth, checkAdmin, (req, res, next) => {
    if (req.body.name === undefined || req.body.description === undefined) {
        res.json({
            success: false,
            msg: 'name or description not found'
        })
    }
    else {
        try {
            Conference.find({name: req.body.name}, (error, results) => {
                if (error) return res.json({
                    success: false,
                    msg: 'Error during database access'
                })
    
                if (results.length !== 0) return res.json({
                    success: false,
                    msg: 'Conference already exist'
                })
    
                conference = new Conference({
                    name: req.body.name,
                    description: req.body.description,
                    topic: req.body.name.replace(' ', ''),
                    status: req.body.status || false,
                    users: []
                })
    
                conference.save((error) => {
                    if (error) return res.json({
                        success: false,
                        msg: 'Error during database save'
                    })
                    else {
                        return res.json({
                            success: true,
                            conference: conference
                        })
                    }
                })
            })
        } catch (err) {
            return res.json({success: false, msg: err})
        }
        
    }
})

/**
 * Get conference
 */
router.get('/:id', checkAuth, (req, res, next) => {
    try {
        Conference.findOne({_id: req.params.id}, (error, result) => {
            if (error) return res.send(404)

            if (!result) return res.send(404)

            return res.json({success: true, conference: result})
        })
    } catch (err) {
        return res.json({success: false, msg: err})
    }
})

/**
 * Edit conference
 */
router.put('/:id', (req, res, next) => {
    try {
        Conference.findOne({_id: req.params.id}, (error, result) => {
            if (error) return res.send(404)
            if (!result) return res.send(404)

            result.name = req.body.name
            result.description = req.body.description
            result.status = req.body.status

            result.save((error) => {
                if (error) {
                    console.log(error)
                    return res.json({
                        success: false,
                        msg: 'Error during database save'
                    })
                }
                else {
                    return res.json({
                        success: true,
                        conference: result
                    })
                }
            })
        })
    } catch (err) {
        return res.json({success: false, msg: err})
    }
})

/**
 * Delete conference
 */
router.delete('/:id', checkAuth, checkAdmin, (req, res, next) => {
    try {
        Conference.findOne({_id: req.params.id}, (error, result) => {
            if (error) return res.send(404)

            if (!result) return res.send(404)

            result.delete(error => {
                if (error) return res.json({success: false, msg: 'Error during deleting'})
                else return res.json({success: true})
            })
        })
    } catch (err) {
        return res.json({success: false, msg: err})
    }
})

/**
 * Register to conference
 */
router.get('/:id/register', checkAuth, (req, res, next) => {
    try {
        Conference.findOne({_id: req.params.id}, (error, result) => {
            if (error) return res.send(404)
            if (!result) return res.send(404)

            if (result.users.includes(req.userData.username)) return res.json({success: false, msg: 'Already regitered'})
            console.log(req.userData)
            result.users.push(req.userData.username)

            result.save((error) => {
                if (error) return res.json({
                    success: false,
                    msg: 'Error during database save'
                })
                else {
                    return res.json({
                        success: true,
                        conference: result
                    })
                }
            })
        })
    } catch (err) {
        return res.json({success: false, msg: err})
    }
})

router.post('/:id/message', checkAuth, (req, res, next) => {
    try {
        Conference.findOne({_id: req.params.id}, (error, result) => {
            if (error) return res.send(404)
            if (!result) return res.send(404)

            result.messages.push({
                user: req.userData.username,
                message: req.body.message
            })

            result.save((error) => {
                if (error) {
                    console.log(error)
                    return res.json({
                        success: false,
                        msg: 'Error during database save'
                    })
                }
                else {
                    return res.json({
                        success: true,
                        conference: result
                    })
                }
            })
        })
    } catch (err) {
        return res.json({success: false, msg: err})
    }
})

module.exports = router;