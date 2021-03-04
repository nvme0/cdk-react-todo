import * as cdk from "@aws-cdk/core";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
// import * as s3 from "@aws-cdk/aws-s3";
// import * as s3Deployment from "@aws-cdk/aws-s3-deployment";
// import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as path from "path";

// TODO set static files dir to react build dir
// const STATIC_FILES_DIR = "";

export class CdkReactTodoStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * S3
     */

    // const bucket = new s3.Bucket(this, "CdkReactTodoBucket", {
    //   publicReadAccess: true,
    //   websiteIndexDocument: "index.html"
    // });

    /**
     * React App Deployment
     */

    // new s3Deployment.BucketDeployment(this, "CdkReactTodoBucket", {
    //   sources: [s3Deployment.Source.asset(STATIC_FILES_DIR)],
    //   destinationBucket: bucket
    // });

    /**
     * Cloudfront
     */

    // new cloudfront.CloudFrontWebDistribution(this, "CdkReactTodoDistribution", {
    //   originConfigs: [
    //     {
    //       s3OriginSource: {
    //         s3BucketSource: bucket
    //       },
    //       behaviors : [ { isDefaultBehavior: true } ]
    //     }
    //   ]
    // });

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
      code: lambda.Code.fromAsset(path.join(__dirname, "build")),
      handler: "list.handler",
      environment: {
        TABLE_NAME: dynamoTable.tableName,
        PRIMARY_KEY: "id",
      },
    });

    dynamoTable.grantReadWriteData(list);

    /**
     * APIs
     */

    const api = new apigateway.RestApi(this, "CdkReactTodoApi", {
      restApiName: "TODO Service",
    });
    const todos = api.root.addResource("todos");

    const listIntegration = new apigateway.LambdaIntegration(list);
    todos.addMethod("GET", listIntegration);
  }
}
