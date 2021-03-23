import * as AWS from "aws-sdk";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import apiResponses from "./utils/apiResponses";

const TABLE_NAME = process.env.TABLE_NAME || "";

const db = new AWS.DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const { id } = event.pathParameters || {};
  if (!id) {
    return { statusCode: 400, body: "invalid request, you are missing the path parameter id" };
  }

  const params: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
    TableName: TABLE_NAME,
    Key: { id },
  };

  try {
    await db.delete(params).promise();
    return apiResponses._200({ id });
  } catch (dbError) {
    return apiResponses._500({ error: dbError });
  }
};
