import jwt from "jsonwebtoken";
// import genToken from "../utils/token.js";
const isAuth = async (req, res, next) => {

  try {

    const token = req.cookies.token;

    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = decoded.id;

    next();

  } catch (error) {

    return res.json({
      success: false,
      message: "Invalid token"
    });

  }

};

export default isAuth;