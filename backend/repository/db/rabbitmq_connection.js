import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import amqp from "amqplib";
import { logger } from "../../library/logger.js";

export const rabbitmqConnection = async () => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    dotenv.config({ path: path.resolve(__dirname, "../../.env") });

    const connect = await amqp.connect(process.env.RABBITMQ_URL);
    return connect;
  } catch (error) {
    // @ts-ignore
    logger.error(error);
  }
};
