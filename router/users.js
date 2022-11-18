/**
 *  users表的路由文件
 */
const express = require("express");

const router = express.Router();
const users_handler = require("./router_handler/users");

router.post("/user", users_handler.offLine);

module.exports = router;
 