const router = require('express').Router()

router.get('/', (req,res) =>{

    // TODO check if user is logged in
    res.render('home', {
        logged_in: false,
    });
})

module.exports = router;