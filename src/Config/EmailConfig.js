require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.HOST_NODEMAIL,
  port: process.env.PORT_NODEMAIL,
  auth: {
    user: process.env.USER_NODEMAIL,
    pass: process.env.PASSWORD_NODEMAIL,
  },
});

module.exports = transporter;