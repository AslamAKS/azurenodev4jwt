const { app } = require("@azure/functions");
const { userValid } = require("../Handler/DBHandler");

app.http("logIn", {
  methods: ["POST"],
  authLevel: "function",
  handler: async (request, context) => {
    const body = await request.json();
    let UserNameOREmail = body.usernameORemail;
    let Password = body.password;

    let isUserValid = await userValid(UserNameOREmail, Password);
    console.log(isUserValid);
    return {
      headers: {
        "content-type": "application/json",
        "Authorization": `Bearer ${isUserValid.jwtToken}`,
      },
      status: 200,
      body: JSON.stringify(isUserValid),
    };
  },
});
