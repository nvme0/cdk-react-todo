# CDK React TODO App

A TODO App using AWS CDK to deploy a stack with:
- A Dynamo Database (DB)
- API Gateway
- Lamda Functions
- S3 Hosting
- Cloudfront (CDN)

## URLs

### App

S3 Bucket
http://cdkreacttodostack-cdkreacttodobucket3939bc5a-1i5m1l47gewki.s3-website-ap-southeast-2.amazonaws.com/

CloudFront
d388s3z8md8pjr.cloudfront.net

### API

https://k84gidorpj.execute-api.ap-southeast-2.amazonaws.com/prod/todos

## Setup

`npm i`

`npm run lerna:bootstrap`

## Useful commands

 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
 * `cdk destroy`     clean up the stack

## Resources

[Aws Examples - API, CORS, Lambda, CRUD, DynamoDB](https://github.com/aws-samples/aws-cdk-examples/tree/master/typescript/api-cors-lambda-crud-dynamodb)

[AWS CDK Workshop - TypeScript](https://cdkworkshop.com/20-typescript.html)

[AWS CDK Patterns](https://github.com/cdk-patterns/serverless)

## TODO

- SNS Pub/Sub when TODO has expired
- Add deployment pipeline
- Support Multiple User Accounts
- Unit tests, e2e tests
