import jwt from "jsonwebtoken";

const Authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    //TODO: Change the secret Key
    const decodedData = jwt.verify(token, "secret");
    req.email = decodedData?.email;

    next();
  } catch (error) {
    console.log(`Error in middleware: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

export default Authenticate;
