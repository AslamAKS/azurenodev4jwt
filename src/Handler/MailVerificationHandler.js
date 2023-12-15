const transporter  = require("../Config/EmailConfig");
const config = require("../Config/DBConfig")
const Database = require("../Util/DBUtil");
const database = new Database(config);
const otpGenerator = require("otp-generator");
require("dotenv").config();

module.exports.sendVerificationMail = async (Email) => {
  let OTP_CONFIG = {
    upperCaseAlphabets: false,
    specialChars: false,
  }
  const OTP = otpGenerator.generate(process.env.OTP_LENGTH, OTP_CONFIG);
  await database.updateOTP({OTP,Email})
  let mailOptions = {
    from: process.env.FROM_MAIL_NODEMAIL,
    to: Email,
    subject: "MoM - Verify Your Account",
    text: `This Is Your Code to verify MoM Account ${OTP}`,
  };

  let verificationMail = transporter.sendMail(mailOptions);
  if(verificationMail.accepted){
    return 'Email Sent Successfully'
  }else{
    return 'Email Sent Falied'
  }
  
};

module.exports.userMailVerification=async (Email,Code)=>{
  let userDetails = await database.readAll({Email})
  if(userDetails.otp === Code){
    let updatestatus =  database.updateStatus({Email})
    return updatestatus
  }else{
    return ('User Not Verified...!')
  }
}
