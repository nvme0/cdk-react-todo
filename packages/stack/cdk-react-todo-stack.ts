import * as cdk from "@aws-cdk/core";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3Deployment from "@aws-cdk/aws-s3-deployment";
import * as cloudfront from "@aws-cdk/aws-cloudfront";

const STATIC_FILES_DIR = "./packages/app/build";
const LAMBDAS_OUTPUT_DIR = "./packages/lambdas/build";

export class CdkReactTodoStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * S3
     */

    const bucket = new s3.Bucket(this, "CdkReactTodoBucket", {
      publicReadAccess: true,
      websiteIndexDocument: "index.html",
    });

    /**
     * React App Deployment
     */

    new s3Deployment.BucketDeployment(this, "CdkReactTodoBucketDeployment", {
      sources: [s3Deployment.Source.asset(STATIC_FILES_DIR)],
      destinationBucket: bucket,
    });

    /**
     * Cloudfront
     */

    new cloudfront.CloudFrontWebDistribution(this, "CdkReactTodoDistribution", {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
          },
          behaviors: [{ isDefaultBehavior: true }],
        },
      ],
    });

    /**
     * DB
     */

    const dynamoTable = new dynamodb.Table(this, "todos", {
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING,
      },
      tableName: "todos",
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
    });

    /**
     * Lambdas
     */

    const list = new lambda.Function(this, "listTodosFunction", {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromAsset(LAMBDAS_OUTPUT_DIR),
      handler: "lambdas.list",
      environment: {
        TABLE_NAME: dynamoTable.tableName,
        PRIMARY_KEY: "id",
      },
    });

    const createOne = new lambda.Function(this, "createTodoFunction", {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromAsset(LAMBDAS_OUTPUT_DIR),
      handler: "lambdas.create",
      environment: {
        TABLE_NAME: dynamoTable.tableName,
        PRIMARY_KEY: "id",
      },
    });

    const updateOne = new lambda.Function(this, "updateTodoFunction", {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromAsset(LAMBDAS_OUTPUT_DIR),
      handler: "lambdas.update",
      environment: {
        TABLE_NAME: dynamoTable.tableName,
        PRIMARY_KEY: "id",
      },
    });

    const batchUpdate = new lambda.Function(this, "batchUpdateTodosFunction", {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromAsset(LAMBDAS_OUTPUT_DIR),
      handler: "lambdas.batchUpdate",
      environment: {
        TABLE_NAME: dynamoTable.tableName,
        PRIMARY_KEY: "id",
      },
    });

    dynamoTable.grantReadWriteData(list);
    dynamoTable.grantReadWriteData(createOne);
    dynamoTable.grantReadWriteData(updateOne);
    dynamoTable.grantReadWriteData(batchUpdate);

    /**
     * APIs
     */

    const api = new apigateway.RestApi(this, "CdkReactTodoApi", {
      restApiName: "TODO Service",
    });

    const todo = api.root.addResource("todo").addResource("{id}", {
      defaultCorsPreflightOptions: {
        allowHeaders: ["Content-Type"],
        allowOrigins: ["*"],
        allowMethods: ["OPTIONS", "GET", "PUT", "PATCH", "POST", "DELETE"],
      },
    });
    const todos = api.root.addResource("todos", {
      defaultCorsPreflightOptions: {
        allowHeaders: ["Content-Type"],
        allowOrigins: ["*"],
        allowMethods: ["OPTIONS", "GET", "PUT", "PATCH", "POST", "DELETE"],
      },
    });

    const listIntegration = new apigateway.LambdaIntegration(list);
    todos.addMethod("GET", listIntegration);

    const createOneIntegration = new apigateway.LambdaIntegration(createOne);
    todos.addMethod("POST", createOneIntegration);

    const updateOneIntegration = new apigateway.LambdaIntegration(updateOne);
    todo.addMethod("PATCH", updateOneIntegration);

    const batchUpdateIntegration = new apigateway.LambdaIntegration(batchUpdate);
    todos.addMethod("PATCH", batchUpdateIntegration);
  }
}
