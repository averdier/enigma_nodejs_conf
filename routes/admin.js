var express = require('express');
var router = express.Router();

router.get('/conferences', (req, res, next) => {
    res.render('admin/conferences', {
        title: 'Conferences'
    })
})

router.get('/conferences/:id', (req, res, next) => {

    res.render('admin/conference', {
        title: 'Conference details',
        id: req.params.id
    })
})

module.exports = router;
