var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // index simply serves the React site
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

module.exports = router;
