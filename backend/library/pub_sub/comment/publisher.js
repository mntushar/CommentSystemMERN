import { rabbitmqConnection } from "../../../repository/db/rabbitmq_connection.js";
import { logger } from "../../logger.js";

export const exchange = "header_exchange";
export const exchangeType = "headers";

export const sendNotification = async (headers, message) => {
  try {
    const connection = await rabbitmqConnection();
    const channel = await connection.createChannel();

    await channel.assertExchange(exchange, exchangeType, { durable: true });

    channel.publish(exchange, "", Buffer.from(JSON.stringify(message)), {
      persistent: true,
      headers,
    });

    logger.info(" Sent notification with headers");

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    logger.error(error);
  }
};
