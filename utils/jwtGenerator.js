const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(username,role,id) {
  const payload = {
    user: {
      username,
      id,
      role
    }
  };

  return jwt.sign(payload, process.env.JWT_SECRET);
}

module.exports = jwtGenerator;