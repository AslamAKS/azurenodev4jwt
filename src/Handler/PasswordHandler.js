const config = require("../Config/DBConfig");
const { sendVerificationMail } = require("./MailVerificationHandler")
const Database = require("../Util/DBUtil");
const database = new Database(config);
const bcrypt=require('bcryptjs');

module.exports.forgotPasswordMail=async (Email)=>{
  let userDetails = await database.readAll({Email})
    if(userDetails.email === Email){
            let sendMail=await sendVerificationMail(Email)
            return sendMail
    }else{
        return "No User Found...!"
    }
}

module.exports.verifyOTPCode=async(Email,Code)=>{
  let userDetails = await database.readAll({Email})
    if(userDetails.otp === Code){
        return ({status : true})
    }else{
        return ({status:false})
    }
}

module.exports.changePassword=async(Email, Password)=>{
    let HashedPassword = (await bcrypt.hash(Password, 12)).toString();
    let userDetails = await database.updatePassword({Email,HashedPassword})
    return userDetails
}