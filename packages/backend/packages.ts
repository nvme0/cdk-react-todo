#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from "@aws-cdk/core";
import { CdkReactTodoStack } from './cdk-react-todo-stack';

const app = new cdk.App();
new CdkReactTodoStack(app, 'CdkReactTodoStack');
