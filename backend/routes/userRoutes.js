const express = require('express');
const { registerUser, authUser, allUsers } = require('../controllers/userController');
const {protect} = require('../middlewares/authMiddleware');


const router = express.Router();

router.route('/api/user').post(registerUser).get(protect,allUsers);

router.post('/api/user/login',authUser)

module.exports= router