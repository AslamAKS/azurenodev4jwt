const config = require("../Config/DBConfig");
const Database = require("../Util/DBUtil");
const database = new Database(config);
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken')
const { sendVerificationMail } = require("./MailVerificationHandler")

module.exports.createTable = async () => {
  let DBCreation = await database
    .executeQuery(
      `ALTER TABLE Users
      ADD otp NVARCHAR(50),
          status BIT DEFAULT 0 ;`
    )
    .then(() => {
      console.log("Table created");
    })
    .catch((err) => {
      console.log(`Creating table failed: ${err}`);
    });
  return DBCreation;
};

module.exports.insertData = async (
  UserName,
  Email,
  Password,
  FirstName,
  LastName,
  PhoneNumber,
  Company,
  Department,
  Position,
  Purpose,
  Source
) => {
  let checkUserNameAndEmail = await database.readAll({ UserName, Email });
  if (checkUserNameAndEmail != null) {
    if (
      checkUserNameAndEmail.username === UserName &&
      checkUserNameAndEmail.email === Email
    )
      return "User Alredy Registerd...! Please LogIn";
    else if (checkUserNameAndEmail.username === UserName)
      return "UserName Alredy Exist";
    else if (checkUserNameAndEmail.email === Email) return "Email Alredy Exist";
  } else {
    let SaltValue = (await bcrypt.genSalt(12)).toString()    
    let HashedPassword = (await bcrypt.hash(Password, SaltValue)).toString()
    let insertDataDB = await database.create({
      UserName,
      Email,
      HashedPassword,
      SaltValue,
      FirstName,
      LastName,
      PhoneNumber,
      Company,
      Department,
      Position,
      Purpose,
      Source,
    });
    let VerificationMail = await sendVerificationMail(Email)
    return {insertDataDB, VerificationMail};
  }
};

module.exports.userValid = async (userInput, password)=>{
  let isUserValid;
  if(userInput.includes("@")){
    let Email=userInput;
    isUserValid = await database.readAll({Email})
  }else{
    let UserName=userInput;
    isUserValid = await database.readAll({UserName})
  }

  if(isUserValid == null){
    return "User Not Exist, Please Register..."
  }else{
    let verifyPassword = await bcrypt.compare(password, isUserValid.password)
    let jwtToken=jwt.sign(isUserValid,process.env.SECRET_KEY,{expiresIn:'1d'})
    console.log(jwtToken);
    if(verifyPassword && jwtToken) return ({verifyPassword,jwtToken})
    else return "Incorrect UserName or Password...!"
  }
};




// CREATE TABLE Users(
//   id int NOT NULL IDENTITY,
//   username NVARCHAR(50) UNIQUE NOT NULL,
//   email NVARCHAR(100) UNIQUE NOT NULL,
//   password NVARCHAR(100) NOT NULL,
//   salt NVARCHAR(50) NOT NULL,
//   first_name NVARCHAR(50),
//   last_name NVARCHAR(50),
//   phonenumber NVARCHAR(20),
//   company NVARCHAR(100),
//   department NVARCHAR(50),
//   position NVARCHAR(50),
//   purpouse NVARCHAR(255),
//   source NVARCHAR(100));