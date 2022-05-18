import { readFileSync } from "fs";
import path from "path";
const filePath = path.join(path.resolve(), "Data", "Products.json");

export const getProducts = async (req, res) => {
  try {
    const { Products } = JSON.parse(readFileSync(filePath));
    return res.status(200).json({ Products });
  } catch (error) {
    console.log(`Error in fetching all the products: ${error.message}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getNewReleases = async (req, res) => {
  try {
    const { Products } = JSON.parse(readFileSync(filePath));

    const newReleases = await Products.filter((item, index) => {
      return index < 15;
    });

    return res.status(200).json({ newReleases });
  } catch (error) {
    console.log(`Error in fetching New Releases: ${error.message}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
