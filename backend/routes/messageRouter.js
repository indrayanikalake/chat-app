const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { sendMsg, receiveMsg } = require('../controllers/messageControlloer');

const router = express.Router();

router.route('/sendMessage').post(protect,sendMsg);
router.route('/receivemsg').get(protect,receiveMsg)


module.exports = router;