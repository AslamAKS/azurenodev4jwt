const sql = require("mssql");

function createDatabase(config) {
  let poolConnection = null;
  let connected = false;

  const connect = async () => {
    try {
      console.log(`Database connecting...${connected}`);
      if (!connected) {
        poolConnection = await sql.connect(config);
        connected = true;
        console.log("Database connection successful");
      } else {
        console.log("Database already connected");
      }
    } catch (error) {
      console.log(`Not connected to database: ${error}`);
    }
  };

  const disconnect = () => {
    try {
      if (poolConnection) {
        poolConnection.close();
        console.log("Database connection closed");
      }
    } catch (error) {
      console.error(`Error closing database connection: ${error}`);
    }
  };

  const executeQuery = async (query) => {
    await connect();
    const request = poolConnection.request();
    const result = await request.query(query);
    // return result.rowsAffected[0];
    if (result.rowsAffected[0] != 0) {
      return "DB Creation Success";
    } else {
      return "DB Creation Failed";
    }
  };

  const create = async (data) => {
    await connect();
    const request = poolConnection.request();
    request.input("UserName", sql.NVarChar(255), data.UserName);
    request.input("Email", sql.NVarChar(255), data.Email);
    request.input("Password", sql.NVarChar(255), data.HashedPassword);
    request.input("Salt", sql.NVarChar(255), data.SaltValue);
    request.input("FirstName", sql.NVarChar(255), data.FirstName);
    request.input("LastName", sql.NVarChar(255), data.LastName);
    request.input("PhoneNumber", sql.NVarChar(255), data.PhoneNumber);
    request.input("Company", sql.NVarChar(255), data.Company);
    request.input("Department", sql.NVarChar(255), data.Department);
    request.input("Position", sql.NVarChar(255), data.Position);
    request.input("Purpouse", sql.NVarChar(255), data.Purpose);
    request.input("Source", sql.NVarChar(255), data.Source);
    const result = await request.query(
      `INSERT INTO Users (username,email,password,Salt,first_name,last_name,phonenumber,company,department,position,purpouse,source)
       VALUES (@UserName,@Email,@Password,@Salt,@FirstName,@LastName,@PhoneNumber,@Company,@Department,@Position,@Purpouse,@Source)`
    );
    if (result.rowsAffected[0] != 0) {
      return "Insertion Success";
    } else {
      return "Insertion Failed";
    }
  };

  const readAll = async (data) => {
    await connect();
    const request = poolConnection.request();
    request.input("UserName", sql.NVarChar(255), data.UserName);
    request.input("Email", sql.NVarChar(255), data.Email);
    const result = await request.query(
      `SELECT * FROM Users
       WHERE username = @UserName 
       OR email = @Email`
    );
    console.log("at util ", result);
    return result.recordset[0];
  };

  const updateOTP = async (data,query) => {
    await connect();
    const request = poolConnection.request();
    request.input("OTP", sql.NVarChar(255), data.OTP);
    request.input("Email", sql.NVarChar(255), data.Email);
    const result = await request.query(`UPDATE Users SET otp = @OTP WHERE email = @Email;`);
    console.log("at util ", result);
    return result.rowsAffected[0];
  };

  const updateStatus = async (data)=>{
    await connect();
    const request = poolConnection.request();
    request.input("Email", sql.NVarChar(255), data.Email);
    const result = await request.query(`UPDATE Users SET status = 1 WHERE email = @Email;`);
    if(result.rowsAffected[0]) return "Status Updated Succesfully"
    else "Status Upadtaion Failed...!"
  }

  const updatePassword = async (data)=>{
    await connect();
    const request = poolConnection.request();
    request.input("Email", sql.NVarChar(255), data.Email);
    request.input("Password", sql.NVarChar(255), data.HashedPassword);
    const result = await request.query(`UPDATE Users SET password = @Password WHERE email = @Email;`);
    if(result.rowsAffected[0]) return "Password Updated Succesfully"
    else return "Updation Failed..! Please Try Agian"
  }

  //   const read = async (id) => {
  //     await connect();
  //     const request = poolConnection.request();
  //     const result = await request
  //       .input("id", sql.Int, +id)
  //       .query(`SELECT * FROM Person WHERE id = @id`);
  //     console.log("@Util ",result.recordset[0]);
  //     if(result.recordset[0]===undefined){
  //       return 'No Data Found'
  //     }else{
  //       return result.recordset[0];
  //     }
  //   };

  //   const update = async (id, firstName, lastName) => {
  //     await connect();
  //     const request = poolConnection.request();
  //     request.input("id", sql.Int, +id);
  //     request.input("firstName", sql.NVarChar(255), firstName);
  //     request.input("lastName", sql.NVarChar(255), lastName);
  //     const result = await request.query(`UPDATE Person SET firstName=@firstName, lastName=@lastName WHERE id = @id`);
  //     console.log(result);
  //     console.log("output   ",result.output);
  //     console.log("rows affected   ",result.rowsAffected[0]);
  //     console.log("recordset   ",result.recordset);
  //     if(result.rowsAffected[0] != 0){
  //       return 'Updation Success'
  //     }else{
  //       return 'Updation Failed'
  //     }
  //     // return result.rowsAffected[0];
  //   };

  //   const remove = async (id) => {
  //     await connect();
  //     const idAsNumber = Number(id);
  //     const request = poolConnection.request();
  //     const result = await request
  //       .input("id", sql.Int, idAsNumber)
  //       .query(`DELETE FROM Person WHERE id = @id`);
  //     if(result.rowsAffected[0] != 0){
  //       return 'Deletion Success'
  //     }else{
  //       return 'Deletion Failed'
  //     }
  //     // return result.rowsAffected[0];
  //   };

  return {
    connect,
    disconnect,
    executeQuery,
    create,
    readAll,
    updateOTP,
    updateStatus,
    updatePassword,
    // read,
    // update,
    // remove,
  };
}

module.exports = createDatabase;
