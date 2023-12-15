const { app } = require("@azure/functions");
const { insertData } = require("../Handler/DBHandler");

app.http('registration', {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const body = await request.json();
    let UserName = body.username;
    let Email = body.email;
    let Password=body.password;
    let FirstName = body.firstname;
    let LastName = body.lastname;
    let PhoneNumber = body.phone;
    let Company = body.company;
    let Department = body.department;
    let Position = body.position;
    let Purpose = body.purpose;
    let Source = "RS";
    
    

    let insertDataResponce = await insertData(UserName, Email, Password, FirstName, LastName, PhoneNumber, Company, Department, Position, Purpose, Source);

    return {
        headers: { 'content-type': 'application/json' },
        status:200,
        body:JSON.stringify(insertDataResponce)
      };

  },
});
