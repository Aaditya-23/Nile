import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import routes from "./routes/index.js";
import ConfigureDatabase from "./config/mongoose.js";

dotenv.config();
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json({ limit: "50MB" }));
app.use(express.urlencoded({ extended: true }));

ConfigureDatabase();
app.use("/", routes);

app.listen(port, (error) => {
  if (error) {
    console.error(`Error in firing up the server: ${error.message}`);
    return;
  }

  console.log(`Server is running on port, ${port}`);
});
