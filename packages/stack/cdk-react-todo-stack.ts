import * as cdk from "@aws-cdk/core";
import * as cognito from "@aws-cdk/aws-cognito";
import * as iam from "@aws-cdk/aws-iam";
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
     * Cognito - User Pool
     */

    const userPool = new cognito.UserPool(this, "CdkAuthUserPool", {
      userPoolName: "cdk-react-todo-users",
      autoVerify: { email: true },
      selfSignUpEnabled: true,
      passwordPolicy: {
        minLength: 8,
        requireSymbols: true,
        requireLowercase: true,
        requireDigits: true,
        requireUppercase: true,
      },
    });

    const userPoolClient = userPool.addClient("CdkAuthUserPoolClient", {
      userPoolClientName: "CdkAuthPoolClientName_app_clientWeb",
    });

    /**
     * Cognito - Identity Pool
     */

    const identityPool = new cognito.CfnIdentityPool(this, "CdkAuthIdentityPool", {
      allowUnauthenticatedIdentities: false,
      cognitoIdentityProviders: [
        {
          clientId: userPoolClient.userPoolClientId,
          providerName: userPool.userPoolProviderName,
        },
      ],
    });

    /**
     * Cognito - IAM
     */

    const authenticatedRole = new iam.Role(this, "CdkCognitoDefaultAuthenticatedRole", {
      assumedBy: new iam.FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          StringEquals: { "cognito-identity.amazonaws.com:aud": identityPool.ref },
          "ForAnyValue:StringLike": { "cognito-identity.amazonaws.com:amr": "authenticated" },
        },
        "sts:AssumeRoleWithWebIdentity",
      ),
    });

    authenticatedRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["mobileanalytics:PutEvents", "cognito-sync:*", "cognito-identity:*"],
        resources: ["*"],
      }),
    );

    new cognito.CfnIdentityPoolRoleAttachment(this, "DefaultValid", {
      identityPoolId: identityPool.ref,
      roles: {
        authenticated: authenticatedRole.roleArn,
      },
    });

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

    const defaultLambdaFunctionProps: Omit<lambda.FunctionProps, "handler"> = {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromAsset(LAMBDAS_OUTPUT_DIR),
      environment: {
        TABLE_NAME: dynamoTable.tableName,
        PRIMARY_KEY: "id",
      },
    };

    const updateOne = new lambda.Function(this, "updateTodoFunction", {
      ...defaultLambdaFunctionProps,
      handler: "lambdas.updateOne",
    });

    const deleteOne = new lambda.Function(this, "deleteTodoFunction", {
      ...defaultLambdaFunctionProps,
      handler: "lambdas.deleteOne",
    });

    const list = new lambda.Function(this, "listTodosFunction", {
      ...defaultLambdaFunctionProps,
      handler: "lambdas.list",
    });

    const createOne = new lambda.Function(this, "createTodoFunction", {
      ...defaultLambdaFunctionProps,
      handler: "lambdas.createOne",
    });

    const batchUpdate = new lambda.Function(this, "batchUpdateTodosFunction", {
      ...defaultLambdaFunctionProps,
      handler: "lambdas.batchUpdate",
    });

    dynamoTable.grantReadWriteData(updateOne);
    dynamoTable.grantReadWriteData(deleteOne);
    dynamoTable.grantReadWriteData(list);
    dynamoTable.grantReadWriteData(createOne);
    dynamoTable.grantReadWriteData(batchUpdate);

    /**
     * REST API
     */

    const api = new apigateway.RestApi(this, "CdkReactTodoApi", {
      restApiName: "TODO Service",
    });

    const authorizer = new apigateway.CfnAuthorizer(this, "CdkReactTodoApiAuthorizer", {
      restApiId: api.restApiId,
      name: "CdkReactTodoAuthorizer",
      type: apigateway.AuthorizationType.COGNITO,
      identitySource: "method.request.header.Authorization",
      providerArns: [userPool.userPoolArn],
    });

    const defaultCorsPreflightOptions: apigateway.CorsOptions = {
      allowHeaders: ["*"],
      allowOrigins: ["*"],
      allowMethods: ["OPTIONS", "GET", "PUT", "PATCH", "POST", "DELETE"],
    };

    const todo = api.root.addResource("todo").addResource("{id}", {
      defaultCorsPreflightOptions,
    });

    const defaultMethodProps: apigateway.MethodOptions = {
      authorizer: {
        authorizerId: authorizer.ref,
        authorizationType: apigateway.AuthorizationType.COGNITO,
      },
    };

    const updateOneIntegration = new apigateway.LambdaIntegration(updateOne);
    todo.addMethod("PATCH", updateOneIntegration, {
      ...defaultMethodProps,
    });

    const deleteOneIntegration = new apigateway.LambdaIntegration(deleteOne);
    todo.addMethod("DELETE", deleteOneIntegration, {
      ...defaultMethodProps,
    });

    const todos = api.root.addResource("todos", {
      defaultCorsPreflightOptions,
    });

    const listIntegration = new apigateway.LambdaIntegration(list);
    todos.addMethod("GET", listIntegration, {
      ...defaultMethodProps,
    });

    const createOneIntegration = new apigateway.LambdaIntegration(createOne);
    todos.addMethod("POST", createOneIntegration, {
      ...defaultMethodProps,
    });

    const batchUpdateIntegration = new apigateway.LambdaIntegration(batchUpdate);
    todos.addMethod("PATCH", batchUpdateIntegration, {
      ...defaultMethodProps,
    });

    /**
     * Outputs
     */

    new cdk.CfnOutput(this, "AwsProjectRegion", { value: "ap-southeast-2" });
    new cdk.CfnOutput(this, "AwsCognitoIdentityPoolId", { value: identityPool.ref });
    new cdk.CfnOutput(this, "AwsCognitoRegion", { value: "ap-southeast-2" });
    new cdk.CfnOutput(this, "AwsUserPoolsId", { value: userPool.userPoolId });
    new cdk.CfnOutput(this, "AwsUserPoolsWebClientId", { value: userPoolClient.userPoolClientId });
    new cdk.CfnOutput(this, "oauth", { value: "{}" });
  }
}
