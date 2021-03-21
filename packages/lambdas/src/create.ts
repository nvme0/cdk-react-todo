import * as AWS from "aws-sdk";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { v4 as uuid } from "uuid";
import apiResponses from "./utils/apiResponses";

const TABLE_NAME = process.env.TABLE_NAME || "";

const db = new AWS.DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  if (!event.body) {
    return apiResponses._400({ error: "invalid request, you are missing the parameter body" });
  }

  const item = typeof event.body === "object" ? event.body : JSON.parse(event.body);
  item.id = uuid();
  const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: TABLE_NAME,
    Item: item,
  };

  try {
    await db.put(params).promise();
    return apiResponses._201({ todo: item });
  } catch (dbError) {
    return apiResponses._500({ error: dbError });
  }
};
