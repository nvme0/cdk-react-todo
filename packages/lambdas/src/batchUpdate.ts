import * as AWS from "aws-sdk";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import apiResponses from "./utils/apiResponses";

const TABLE_NAME = process.env.TABLE_NAME || "";

const db = new AWS.DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  if (!event.body) {
    return apiResponses._400({ error: "invalid request, you are missing the parameter body" });
  }
  const { todos } = typeof event.body === "object" ? event.body : JSON.parse(event.body);
  if (!todos) {
    return apiResponses._400({ error: "invalid request, you have not provided any todos" });
  }

  const writeRequests: AWS.DynamoDB.DocumentClient.WriteRequests = [];
  todos.forEach((item: any) => {
    writeRequests.push({
      PutRequest: {
        Item: item,
      },
    });
  });

  const params: AWS.DynamoDB.DocumentClient.BatchWriteItemInput = {
    RequestItems: {
      [TABLE_NAME]: writeRequests,
    },
  };

  try {
    await db.batchWrite(params).promise();
    return apiResponses._204({ todos });
  } catch (dbError) {
    return apiResponses._500({ error: dbError });
  }
};
