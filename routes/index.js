var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'To-do list API' });
});

router.get('/health', function(req, res, next) {
  res.status(200).json({ status: 'ok' });
});

module.exports = router;
