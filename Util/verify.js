const jwt = require("jsonwebtoken");


const verifyToken = (req, res, next) => {
  // console.log('ere',req.cookies)
  const token = req.cookies.access_token;
  if (!token) { res.status(401).json({message:"Invalid token"}); return;}
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err){ res.status(401).json({message:"Invalid token"}); return;}
    req._id = decoded.id;
    next();
    return
  });
  // req.owner_id = decoded.id;
  //  console.log('vot end')
  // next();
  // console.log('vot d end')
  return;
};

module.exports = {verifyToken}