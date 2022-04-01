var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', author: 'Author Gallo Gutiérrez Christofer', babel: 'Babel is running' });
});

/* First Exercise */
router.get('/FE', function (req, res, next) {
  res.send('👋 Welcome to fullstack web course./nThis is the first exercise');
});

/* Second Exercise */
router.get('/SE', function (req, res, next) {
  res.status(200).json({ message: 'This is the second exercise' });
});

module.exports = router;
