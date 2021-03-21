# CDK React TODO App

A TODO App using AWS CDK to deploy a stack with:
- A Dynamo Database (DB)
- API Gateway
- Lamda Functions
- S3 Hosting
- Cloudfront (CDN)

## URL

https://k84gidorpj.execute-api.ap-southeast-2.amazonaws.com/prod/todos

## Setup

`npm i`

`npm run bootstrap`

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

- Add TODO endpoints: Create (POST), Update (PUT), Delete (Delete), Get One (GET)
- Add React Frontend: Todos, React DnD, Material UI, React Query with optimisic updates
- Add CloudFront (CDN)
- Add deployment pipeline
- Add Amazon Congnito (user accounts)
- Unit tests, e2e tests
