const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { sendMsg } = require('../controllers/messageControlloer');

const router = express.Router();

router.route('/').post(protect,sendMsg);


module.exports = router;