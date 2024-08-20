const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { 
    username: req.session.username,
    loggedIn: !!req.session.userId // Convert to boolean
  });
});

module.exports = router;