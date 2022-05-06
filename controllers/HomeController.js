export const Home = async (req, res) => {
  try {
    return res.send("<h1> Welcome to the Buisness Layer of application </h1>");
  } catch (error) {
    console.log(`Error in Home: ${error.message}`);
    return res.send("<h1> Internal Application Error </h1>");
  }
};
