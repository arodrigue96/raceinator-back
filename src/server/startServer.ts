import { type Express } from "express";
import chalk from "chalk";

const startServer = (app: Express, port: number) => {
  app.listen(port, () => {
    console.log(chalk.green(`Listenting in port: ${port}`));
  });
};

export default startServer;