const jwt = require("jsonwebtoken");

const SECRET_KEY = "your_secret_key_here"; // Replace this with your actual secret key
function logger(req, res, next) {
  console.log(
    `${new Date().toISOString()} - ${req.method} request to ${req.url}`
  );
  next();
}

// Middleware for authenticating using JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    console.log("Authorization header is missing");
    return res.sendStatus(401); // No authorization header
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    console.log("Authorization header is malformed:", authHeader);
    return res.sendStatus(401); // Incorrect authorization header format
  }
  const token = parts[1];


  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.error("JWT Error:", err.name, err.message);
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expired" });
      } else if (err.name === "JsonWebTokenError") {
        return res.status(403).json({ error: "Token is invalid" });
      } else {
        return res.status(403).json({ error: "Token is not valid" });
      }
    }

    req.user = user;
    next();
  });
}

// Error handling middleware
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
}

module.exports = {
  logger,
  authenticateToken,
  errorHandler,
};
