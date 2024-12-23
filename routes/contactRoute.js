const express = require("express");
const contactcontroller = require("../api/contact");
const router = express.Router();


router.post("/contact", contactcontroller.handleRequest);  


module.exports = router