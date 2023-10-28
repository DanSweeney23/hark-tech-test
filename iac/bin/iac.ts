#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { HarkIacStack } from '../lib/hark-iac-stack';

const app = new cdk.App();
new HarkIacStack(app, 'HarkIacStack', {
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION
  },
});