// import * as AWS from "aws-sdk";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import apiResponses from "./utils/apiResponses";

// const TABLE_NAME = process.env.TABLE_NAME || '';

// const db = new AWS.DynamoDB.DocumentClient();

// export const handler: APIGatewayProxyHandlerV2 = async (event) => {
//   const params = {
//     TableName: TABLE_NAME
//   };

//   try {
//     const response = await db.scan(params).promise();
//     return apiResponses._200({ todos: JSON.stringify(response.Items) });
//   } catch (dbError) {
//     return apiResponses._500({ error: JSON.stringify(dbError) })
//   }
// }

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  return apiResponses._200({ message: "It worked!" });
}
