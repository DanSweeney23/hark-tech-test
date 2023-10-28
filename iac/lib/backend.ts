import { Construct } from "constructs";
import { aws_s3, aws_glue, aws_apigateway, aws_lambda, Duration, aws_iam } from 'aws-cdk-lib';
import { RemovalPolicy } from 'aws-cdk-lib';
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";

const DATABASE_NAME = 'hark_database';

export default function (scope: Construct, accountId: string) {
  //Define bucket & database to host IOT data
  const dataBucket = new aws_s3.Bucket(scope, 'data-bucket', {
    removalPolicy: RemovalPolicy.DESTROY
  });

  const db = new aws_glue.CfnDatabase(scope, 'glue-db', {
    catalogId: accountId,
    databaseInput: {
      name: DATABASE_NAME
    }
  });

  const energyTable = createTable({
    tableName: 'half_hourly_energy_data',
    location: 'HalfHourlyEnergyData/',
    columns: [
      {
        name: 'timestamp',
        type: 'string'
      },
      {
        name: 'consumption',
        type: 'double'
      }
    ]
  });

  const anomolyTable = createTable({
    tableName: 'half_hourly_energy_data_anomalies',
    location: 'HalfHourlyEnergyDataAnomalies/',
    columns: [
      {
        name: 'timestamp',
        type: 'string'
      },
      {
        name: 'consumption',
        type: 'double'
      }
    ]
  });

  const weatherTable = createTable({
    tableName: 'weather_table',
    location: 'Weather/',
    columns: [
      {
        name: 'date',
        type: 'string'
      },
      {
        name: 'averagetemperature',
        type: 'double'
      },
      {
        name: 'averagehumidity',
        type: 'double'
      }
    ]
  });

  //Define API & lambda to retreive data
  const api = new aws_apigateway.RestApi(scope, 'hark-api');

  const readDatabasePolicy = new aws_iam.PolicyStatement({
    actions: [
      'athena:*',
      's3:GetBucketLocation',
      's3:GetObject',
      's3:PutObject'
    ],
    resources: [
      `arn:aws:athena:*:${accountId}:workgroup`,
      `arn:aws:s3:::athena-results-278421086553/*`,
      dataBucket.bucketArn,
      dataBucket.arnForObjects('/*')
    ]
  });

  const getConsolidatedDataLambda = new aws_lambda.Function(scope, 'get-consolidated-data-lambda', {
    code: aws_lambda.Code.fromAsset(`../lambda/getConsolidatedData`),
    handler: 'index.handler',
    runtime: aws_lambda.Runtime.NODEJS_18_X,
    timeout: Duration.seconds(10)
  });
  const consolidatedDataIntegration = new LambdaIntegration(getConsolidatedDataLambda);
  const consolidatedDataResource = api.root.addResource("consolidateddata");
  consolidatedDataResource.addCorsPreflight({ allowOrigins: ['*'] })
  consolidatedDataResource.addMethod('GET', consolidatedDataIntegration);


  function createTable(params: { tableName: string, location: string, columns: aws_glue.CfnTable.ColumnProperty[] }) {
    new aws_glue.CfnTable(scope, params.tableName.replace(/_/g, '-'), {
      catalogId: accountId,
      databaseName: DATABASE_NAME,
      tableInput: {
        name: params.tableName,
        tableType: 'EXTERNAL_TABLE',
        parameters: {
          'classification': 'csv',
          'typeOfData': 'file',
          'delimiter': ',',
          'skip.header.line.count': 1
        },
        storageDescriptor: {
          columns: params.columns,
          location: dataBucket.s3UrlForObject(params.location),
          inputFormat: 'org.apache.hadoop.mapred.TextInputFormat',
          serdeInfo: {
            serializationLibrary: 'org.apache.hadoop.hive.serde2.OpenCSVSerde',
            parameters: {
              'field.delim': ','
            }
          }
        }
      }
    })
  }
}

