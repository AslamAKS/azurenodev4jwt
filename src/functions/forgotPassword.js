const { app } = require("@azure/functions");
const { sendVerificationMail } = require("../Handler/MailVerificationHandler");

app.http('forgotPassword', {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const body = await request.json();
    let Email = body.Email;
    let sendMail = sendVerificationMail(Email)
    return {
      headers: { 'content-type': 'application/json' },
      status:200,
      body:JSON.stringify(sendMail)
    };
  },
});
