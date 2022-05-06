import mongoose from "mongoose";

export default async function ConfigureDatabase() {
  await mongoose
    .connect(process.env.CONNECTION_URL)
    .then(() => console.log("Connected to Database successfully"))
    .catch((error) =>
      console.log(`Error connecting to the database: ${error.message}`)
    );
}
