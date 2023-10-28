import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import frontend from './frontend';
import backend from './backend';

export class HarkIacStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    frontend(this);
    backend(this, props.env!.account!);
  }
}
