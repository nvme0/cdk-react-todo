import * as AWS from "aws-sdk";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import apiResponses from "./utils/apiResponses";

const TABLE_NAME = process.env.TABLE_NAME || "";

const db = new AWS.DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  if (!event.body) {
    return apiResponses._400({ error: "invalid request, you are missing the parameter body" });
  }

  const { id } = event.pathParameters || {};
  if (!id) {
    return { statusCode: 400, body: "invalid request, you are missing the path parameter id" };
  }

  const item = typeof event.body === "object" ? event.body : JSON.parse(event.body);
  const itemProperties = Object.keys(item);
  if (!itemProperties || itemProperties.length < 1) {
    return { statusCode: 400, body: "invalid request, no arguments provided" };
  }

  const firstProperty = itemProperties.splice(0, 1);
  const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: `set ${firstProperty} = :${firstProperty}`,
    ExpressionAttributeValues: {},
    ReturnValues: "UPDATED_NEW",
  };

  params.ExpressionAttributeValues = {
    ...(params.ExpressionAttributeValues || {}),
    [`:${firstProperty}`]: item[`${firstProperty}`],
  };

  itemProperties.forEach((property) => {
    params.UpdateExpression += `, ${property} = :${property}`;
    params.ExpressionAttributeValues = {
      ...(params.ExpressionAttributeValues || {}),
      [`:${property}`]: item[`${property}`],
    };
  });

  try {
    await db.update(params).promise();
    return apiResponses._204({ todo: item });
  } catch (dbError) {
    return apiResponses._500({ error: dbError });
  }
};
