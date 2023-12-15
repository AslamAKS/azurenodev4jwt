const { app } = require("@azure/functions");
const { userMailVerification } = require("../Handler/MailVerificationHandler");

app.http('userVerification', {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const body = await request.json();
    let Email = body.Email; //from url ?
    let Code = body.Code;
    let userValidation = await userMailVerification(Email,Code)
    return{
        headers: { 'content-type': 'application/json' },
        body:JSON.stringify(userValidation)
    }
  },
});
