'strict mode';
var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Symbol = require('../models/Symbol');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Chart the Stock market'});
});





module.exports = router;

