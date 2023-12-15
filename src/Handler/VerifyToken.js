const jwt = require('jsonwebtoken');

module.exports.verifyJWTToken = async (token) => {
    if(!token) return {status:false}
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log('Decoded Token:', decoded);
    return ({status:true})
};
