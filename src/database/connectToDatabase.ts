import chalk from "chalk";
import mongoose from "mongoose";

const connectToDatabase = async (url: string): Promise<void> => {
  mongoose.set("sanitizeFilter", true);
  await mongoose.connect(url);

  console.log(chalk.bgGreenBright("You are connected to the database"));
};

export default connectToDatabase;
