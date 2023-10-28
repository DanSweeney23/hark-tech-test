import { Construct } from "constructs";
import { aws_s3, aws_s3_deployment, RemovalPolicy } from 'aws-cdk-lib';
import { BlockPublicAccess } from "aws-cdk-lib/aws-s3";
import { CfnDistribution, CloudFrontWebDistribution, OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront";

export default function (scope: Construct) {
  //Define S3 bucket to host the site
  const deploymentBucket = new aws_s3.Bucket(scope, 'deployment-bucket', {
    publicReadAccess: true,
    websiteIndexDocument: "index.html",
    removalPolicy: RemovalPolicy.DESTROY,
    blockPublicAccess: new BlockPublicAccess({
      blockPublicAcls: false,
      blockPublicPolicy: false
    })
  });

  const oai = new OriginAccessIdentity(scope, 'bucket-oai', {});
  deploymentBucket.grantRead(oai);
  
  const deployment = new aws_s3_deployment.BucketDeployment(scope, 'deploy-static-website', {
    sources: [aws_s3_deployment.Source.asset("../frontend/dist")],
    destinationBucket: deploymentBucket
  });

  // Define CloudFront Distribution and error responses.
  const accessDeniedErrorResponse: CfnDistribution.CustomErrorResponseProperty = {
    errorCode: 403,
    errorCachingMinTtl: 30,
    responseCode: 200,
    responsePagePath: '/index.html',
  };
  const notFoundErrorResponse: CfnDistribution.CustomErrorResponseProperty = {
    errorCode: 404,
    errorCachingMinTtl: 30,
    responseCode: 200,
    responsePagePath: '/index.html',
  };

  const distribution = new CloudFrontWebDistribution(scope, 'cf-web-distribution', {
    originConfigs: [
      {
        s3OriginSource: {
          s3BucketSource: deploymentBucket,
          originAccessIdentity: oai
        },
        behaviors: [{ isDefaultBehavior: true }],
      },
    ],
    errorConfigurations: [
      accessDeniedErrorResponse,
      notFoundErrorResponse
    ]
  });

}