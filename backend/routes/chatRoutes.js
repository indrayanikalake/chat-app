const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const{ accessChat, fetchGroup, createGroupChat, renameGroup, addToGroup, removeFromGroup, getAllUsers, deleteUser} = require("../controllers/chatControllers");

const router = express.Router();

router.route('/').post(protect,accessChat);
router.route('/').get(protect,fetchGroup);
router.route('/group').post(protect,createGroupChat);
router.route('/rename').patch(protect,renameGroup);
router.route('/groupadd').post(protect,addToGroup);
router.route('/groupremove').put(protect,removeFromGroup);
router.route('/allUsers').get(getAllUsers);
router.route('/deleteUser/:groupId/:userId').delete(protect,deleteUser);

module.exports = router;