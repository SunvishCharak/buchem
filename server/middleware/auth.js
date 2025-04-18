import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log("Token",req.headers)

  if (!token) {
    req.body.userId = null;
    return next();
  }
  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = token_decode.id;

    console.log(token_decode.id);
    console.log(req.body.userId);
    next();
  } catch (error) {
    console.log(error);
    req.body.userId = null;
    next();
  }
};

export default authUser;

// import jwt from "jsonwebtoken";

// const authUser = async (req, res, next) => {
//   const { token } = req.headers;

//   if (!token) {
//     req.body.userId = null;
//     return next();
//   }
//   try {
//     const token_decode = jwt.verify(token, process.env.JWT_SECRET);
//     req.body.userId = token_decode.id;
//     next();
//   } catch (error) {
//     console.log(error);
//     req.body.userId = null;
//     next();
//   }
// };

// export default authUser;
