const express = require('express');
const router = express.Router();

//route: GET api/user
//description: test
//acces: public
router.get('/', (req, res) => res.send('User Route'));

module.exports = router;
