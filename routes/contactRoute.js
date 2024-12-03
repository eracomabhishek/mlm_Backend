const express = require("express");
const ContactController = require("../api/contact");
const router = express.Router();


router.post("/contact", ContactController);


module.exports = router