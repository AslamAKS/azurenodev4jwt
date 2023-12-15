const { app } = require("@azure/functions");
const { changePassword, verifyOTPCode } = require("../Handler/PasswordHandler");
const { verifyJWTToken } = require("../Handler/VerifyToken");

app.http('changePassword', {
  methods: ["POST"],
  authLevel: "function",
  handler: async (request, context) => {

    const token =await request.headers.get('Authorization').split(' ')[1];
    console.log(token);
    let verifyToken =await verifyJWTToken(token)

    if(verifyToken.status){

      const body = await request.json();
      let Email = body.Email; //from url ?
      let Code = body.Code;
      let Password = body.Password;
      let ConfirmPassword = body.ConfirmPassword;
      let passwordChangedStatus;
      let codeVerification = await verifyOTPCode(Email,Code)
  
      if(codeVerification.status){
        if (Password === ConfirmPassword) {
          passwordChangedStatus = await changePassword(Email, Password);
        } else {
          passwordChangedStatus = "Password Do Not Match, Please Give Correct Matching Password";
        }
      }else{
        passwordChangedStatus = "Invalid OTP...!";
      }
      
      return {
        headers: { "content-type": "application/json" },
        body: JSON.stringify(passwordChangedStatus),
      };
    }else{
      return {
        headers: { "content-type": "application/json" },
        body: JSON.stringify('Authentication Failed'),
      };
    }
  },
});
