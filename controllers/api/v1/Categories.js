import { readFileSync } from "fs";
import path from "path";

export const getCategories = async (req, res) => {
  try {
    const filePath = path.join(path.resolve(), "Data", "Categories.json");

    const { Categories } = JSON.parse(readFileSync(filePath));

    return res.status(200).json({ Categories });
  } catch (error) {
    console.log(`Error in fetching all the categories: ${error.message}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
